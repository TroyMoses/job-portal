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

  return { user };
}

export const createAnswer = mutation({
    args: {
      jobId: v.id("jobs"),
      questionId: v.id("questions"),
      orgId: v.string(),
      answer: v.string(),
    },
    async handler(ctx, args) {
      const hasAccess = await hasAccessToOrg(ctx, args.orgId);
  
      if (!hasAccess) {
        throw new ConvexError("you do not have access to this org");
      }
      await ctx.db.insert("answers", {
        jobId: args.jobId,
        questionId: args.questionId,
        orgId: args.orgId,
        answer: args.answer,
      });
    },
  });

export const getAnswer = query({
    args: {
      answerId: v.id("answers"),
    },
    handler: async (ctx, args) => {
      const answer = await ctx.db.get(args.answerId);
  
      if (!answer) {
        throw new Error("Answer not found");
      }
  
      return answer;
    },
});

export const updateAnswer = mutation({
    args: {
      answerId: v.id("answers"),
      answer: v.any(),
      fileId: v.optional(v.id("files")),
    },
    handler: async (ctx, args) => {
      const updateData = {
        ...(args.answer && { answer: args.answer }),
        ...(args.fileId && { fileId: args.fileId }),
      };
  
      await ctx.db.patch(args.answerId, updateData);
  
      const updatedAnswer = await ctx.db.get(args.answerId);
      return updatedAnswer; 
    },
});

export const deleteAnswer = mutation({
    args: {
      answerId: v.id("answers"),
    },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.answerId);
    },
});

