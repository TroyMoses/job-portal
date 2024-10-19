import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { jobStatusTypes } from "./schema";
import { Doc, Id } from "./_generated/dataModel";


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
        orgId: v.string(),
        imageId: v.optional(v.id("_storage")),
        salary: v.string(),
        location: v.string(),
        jobType: v.string(),
        status: v.array(jobStatusTypes),
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    
        if (!hasAccess) {
          throw new ConvexError("you do not have access to this org");
        }
        await ctx.db.insert("jobs", {
            title: args.title,
            description: args.description,
            userId: hasAccess.user._id,
            orgId: args.orgId,
            salary: args.salary,
            location: args.location,
            jobType: args.jobType,
            imageId: args.imageId,
            status: args.status,
        });
    }
});

export const getJobs = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        favoritesJob: v.optional(v.boolean()),
        deletedOnly: v.optional(v.boolean()),
        type: v.optional(jobStatusTypes),
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
    
        if (args.favoritesJob) {
          const favorites = await ctx.db
            .query("favoritesJob")
            .withIndex("by_userId_orgId_jobId", (q) =>
              q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
            )
            .collect();
    
          jobs = jobs.filter((job) =>
            favorites.some((favorite) => favorite.jobId === job._id)
          );
        }
    
        if (args.deletedOnly) {
          jobs = jobs.filter((job) => job.shouldDelete);
        } else {
          jobs = jobs.filter((job) => !job.shouldDelete);
        }
    
        if (args.type) {
          jobs = jobs.filter((job) => job.status === args.type);
        }

        const modifiedJobs = await Promise.all(
            jobs.map(async (job) => ({
                ...job,
                title: job.title,
                description:job.description,
                orgId: job.orgId,
                salary: job.salary,
                location: job.location,
                jobType: job.jobType,
                imageUrl: job.imageId ? await ctx.storage.getUrl(job.imageId) : null,
                type: job.status,
            }))
    );
    
        return modifiedJobs;
    },
});

export const deleteAlljobs = internalMutation({
    args: {},
    async handler(ctx) {
      const jobs = await ctx.db
        .query("jobs")
        .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
        .collect();
  
        await Promise.all(
          jobs.map(async (job) => {
            if (job.imageId) {
              await ctx.storage.delete(job.imageId);
            }
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

  export const toggleFavorite = mutation({
    args: { jobId: v.id("jobs") },
    async handler(ctx, args) {
      const access = await hasAccessToJob(ctx, args.jobId);
  
      if (!access) {
        throw new ConvexError("no access to job");
      }
  
      const favoriteJob = await ctx.db
        .query("favoritesJob")
        .withIndex("by_userId_orgId_jobId", (q) =>
          q
            .eq("userId", access.user._id)
            .eq("orgId", access.job.orgId)
            .eq("jobId", access.job._id)
        )
        .first();
  
      if (!favoriteJob) {
        await ctx.db.insert("favoritesJob", {
          jobId: access.job._id,
          userId: access.user._id,
          orgId: access.job.orgId,
        });
      } else {
        await ctx.db.delete(favoriteJob._id);
      }
    },
  });
  
  export const getAllFavorites = query({
    args: { orgId: v.string() },
    async handler(ctx, args) {
      const hasAccess = await hasAccessToOrg(ctx, args.orgId);
  
      if (!hasAccess) {
        return [];
      }
  
      const favorites = await ctx.db
        .query("favoritesJob")
        .withIndex("by_userId_orgId_jobId", (q) =>
          q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
        )
        .collect();
  
      return favorites;
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
  