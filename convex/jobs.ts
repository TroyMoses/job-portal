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
  qualificationsType,
} from "./schema";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a job");
  }

  return await ctx.storage.generateUploadUrl();
});

export const createJob = mutation({
  args: {
    title: v.string(),
    salaryScale: v.string(),
    reportsTo: v.string(),
    purpose: v.string(),
    keyFunctions: v.array(keyFunctionsType),
    qualifications: v.array(qualificationsType),
    experiences: v.array(experiencesType),
    competences: v.array(competencesType),
  },
  async handler(ctx, args) {
    await ctx.db.insert("jobs", {
      title: args.title,
      salaryScale: args.salaryScale,
      reportsTo: args.reportsTo,
      purpose: args.purpose,
      keyFunctions: args.keyFunctions,
      qualifications: args.qualifications,
      experiences: args.experiences,
      competences: args.competences,
    });
  },
});

export const getJobById = query({
  args: { jobId: v.id("jobs") },
  async handler(ctx, { jobId }) {
    const job = await ctx.db.get(jobId);
    if (!job) {
      throw new ConvexError("Job not found");
    }
    return job;
  },
});

export const getJobs = query({
  args: {
    query: v.optional(v.string()),
    deletedOnly: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    let jobs = await ctx.db.query("jobs").collect();

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
        purpose: job.purpose,
        keyFunctions: job.keyFunctions,
        qualifications: job.qualifications,
        experiences: job.experiences,
        competences: job.competences,
      }))
    );

    return modifiedJobs;
  },
});

export const getAllJobs = query({
  args: {},
  async handler(ctx) {
    const jobs = await ctx.db.query("jobs").collect();

    return jobs;
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

export const deletejob = mutation({
  args: { jobId: v.id("jobs") },
  async handler(ctx, args) {
    const access = await hasAccessToJob(ctx, args.jobId);

    if (!access) {
      throw new ConvexError("no access to job");
    }

    // Instantly delete the job from the database
    await ctx.db.delete(args.jobId);
  },
});

export const restoreJob = mutation({
  args: { jobId: v.id("jobs") },
  async handler(ctx, args) {
    const access = await hasAccessToJob(ctx, args.jobId);

    if (!access) {
      throw new ConvexError("no access to job");
    }

    await ctx.db.patch(args.jobId, {
      shouldDelete: false,
    });
  },
});

async function hasAccessToJob(ctx: QueryCtx | MutationCtx, jobId: Id<"jobs">) {
  const job = await ctx.db.get(jobId);

  if (!job) {
    return null;
  }

  return { job };
}
