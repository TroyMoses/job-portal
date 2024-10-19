import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import {
  competencesType,
  experiencesType,
  keyFunctionsType,
  keyOutputsType,
  qualificationsType,
  responsibleForType,
} from "./schema";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a job");
  }

  return await ctx.storage.generateUploadUrl();
});

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();

  if (!user) {
    return null;
  }

  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    return null;
  }

  return { user };
}

export const createJob = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
    salaryScale: v.string(),
    reportsTo: v.string(),
    responsibleFor: v.array(responsibleForType),
    purpose: v.string(),
    keyOutputs: v.array(keyOutputsType),
    keyFunctions: v.array(keyFunctionsType),
    qualifications: v.array(qualificationsType),
    experiences: v.array(experiencesType),
    competences: v.array(competencesType),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      throw new ConvexError("you do not have access to this org");
    }
    await ctx.db.insert("jobs", {
      title: args.title,
      salaryScale: args.salaryScale,
      userId: hasAccess.user._id,
      orgId: args.orgId,
      reportsTo: args.reportsTo,
      responsibleFor: args.responsibleFor,
      purpose: args.purpose,
      keyOutputs: args.keyOutputs,
      keyFunctions: args.keyFunctions,
      qualifications: args.qualifications,
      experiences: args.experiences,
      competences: args.competences,
    });
  },
});

export const getJobById = query({
  args: {
    jobId: v.id("jobs"),
  },
  async handler(ctx, args) {
    const job = await ctx.db.get(args.jobId);

    if (!job) {
      throw new ConvexError("Job not found");
    }

    return job;
  },
});

export const getJobs = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    deletedOnly: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    let jobs = await ctx.db
      .query("jobs")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    if (query) {
      jobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (args.deletedOnly) {
      jobs = jobs.filter((job) => job.shouldDelete);
    } else {
      jobs = jobs.filter((job) => !job.shouldDelete);
    }

    const modifiedJobs = await Promise.all(
      jobs.map(async (job) => ({
        ...job,
        title: job.title,
        salaryScale: job.salaryScale,
        reportsTo: job.reportsTo,
        responsibleFor: job.responsibleFor,
        purpose: job.purpose,
        keyOutputs: job.keyOutputs,
        keyFunctions: job.keyFunctions,
        qualifications: job.qualifications,
        experiences: job.experiences,
        competences: job.competences,
      }))
    );

    return modifiedJobs;
  },
});

export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    title: v.string(),
    salaryScale: v.string(),
    reportsTo: v.string(),
    responsibleFor: v.array(responsibleForType),
    purpose: v.string(),
    keyOutputs: v.array(keyOutputsType),
    keyFunctions: v.array(keyFunctionsType),
    qualifications: v.array(qualificationsType),
    experiences: v.array(experiencesType),
    competences: v.array(competencesType),
  },
  async handler(ctx, args) {
    const access = await hasAccessToJob(ctx, args.jobId);

    if (!access) {
      throw new ConvexError("no access to job");
    }

    await ctx.db.patch(args.jobId, {
      title: args.title,
      salaryScale: args.salaryScale,
      reportsTo: args.reportsTo,
      responsibleFor: args.responsibleFor,
      purpose: args.purpose,
      keyOutputs: args.keyOutputs,
      keyFunctions: args.keyFunctions,
      qualifications: args.qualifications,
      experiences: args.experiences,
      competences: args.competences,
    });
  },
});


export const deleteAllJobs = internalMutation({
  args: {},
  async handler(ctx) {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
      .collect();

      await Promise.all(
        jobs.map(async (job) => {
          return await ctx.db.delete(job._id);
        })
      );
  },
});

function assertCanDeleteJob(user: Doc<"users">, job: Doc<"jobs">) {
  const canDelete =
    job.userId === user._id ||
    user.orgIds.find((org) => org.orgId === job.orgId)?.role === "admin";

  if (!canDelete) {
    throw new ConvexError("you have no acces to delete this job");
  }
}

  export const deletejob = mutation({
    args: { jobId: v.id("jobs") },
    async handler(ctx, args) {
      const access = await hasAccessToJob(ctx, args.jobId);

      if (!access) {
        throw new ConvexError("no access to job");
      }

      assertCanDeleteJob(access.user, access.job);

      await ctx.db.patch(args.jobId, {
        shouldDelete: true,
      });
    },
  });

  export const restoreJob = mutation({
    args: { jobId: v.id("jobs") },
    async handler(ctx, args) {
      const access = await hasAccessToJob(ctx, args.jobId);

      if (!access) {
        throw new ConvexError("no access to job");
      }

      assertCanDeleteJob(access.user, access.job);

      await ctx.db.patch(args.jobId, {
        shouldDelete: false,
      });
    },
  });

async function hasAccessToJob(
    ctx: QueryCtx | MutationCtx,
    jobId: Id<"jobs">
  ) {
    const job = await ctx.db.get(jobId);

    if (!job) {
      return null;
    }

    const hasAccess = await hasAccessToOrg(ctx, job.orgId);

    if (!hasAccess) {
      return null;
    }

    return { user: hasAccess.user, job };
  }
