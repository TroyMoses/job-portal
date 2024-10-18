import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";

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
    title: v.string(),
    description: v.string(),
    imageId: v.id("_storage"),
    orgId: v.string(),
    salary: v.string(),
    location: v.string(),
    jobType: v.string(),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      throw new ConvexError("you do not have access to this org");
    }
    await ctx.db.insert("jobs", {
      title: args.title,
      description: args.description,
      imageId: args.imageId,
      orgId: args.orgId,
      salary: args.salary,
      location: args.location,
      jobType: args.jobType,
    });
  },
});

export const getJob = query({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    return job;
  },
});

export const allJobs = query({
  handler: async (ctx) => {
    const jobs = await ctx.db.query("jobs").collect();  // Collects all jobs
    return jobs;
  },
});

export const getJobs = query({
  args: {
    orgId: v.string(),
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

    const jobsWithUrl = await Promise.all(
      jobs.map(async (job) => ({
        ...job,
        imageId: job.imageId ? await ctx.storage.getUrl(job.imageId) : null,
        title: job.title,
        description: job.description,
        orgId: job.orgId,
        salary: job.salary,
        location: job.location,
        jobType: job.jobType,
      }))
    );

    return jobsWithUrl;
  },
});

export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    salary: v.optional(v.string()),
    location: v.optional(v.string()),
    jobType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updateData = {
      ...(args.title && { title: args.title }),
      ...(args.description && { description: args.description }),
      ...(args.image && { image: args.image }),
      ...(args.salary && { salary: args.salary }),
      ...(args.location && { location: args.location }),
      ...(args.jobType && { jobType: args.jobType }),
    };

    await ctx.db.patch(args.jobId, updateData);

    const updatedJob = await ctx.db.get(args.jobId);
    return updatedJob; // Return updated job
  },
});

export const deleteJob = mutation({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.jobId);

    return { success: true };
  },
});
