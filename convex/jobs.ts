import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";

export const createJob = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    image: v.optional(v.string()),
    salary: v.string(),
    location: v.string(),
    jobType: v.string(),
  },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("jobs", {
      title: args.title,
      description: args.description,
      image: args.image,
      salary: args.salary,
      location: args.location,
      jobType: args.jobType,
    });

    return jobId; 
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
