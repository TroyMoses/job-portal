import {
    MutationCtx,
    QueryCtx,
    internalMutation,
    mutation,
    query,
 } from "./_generated/server";
import { v } from "convex/values";

export const createAnswer = mutation({
    args: {
      jobId: v.id("jobs"),
      questionId: v.id("questions"),
      userId: v.id("users"),
      answer: v.any(),
      fileId: v.optional(v.id("files")),
    },
    handler: async (ctx, args) => {
      const answerId = await ctx.db.insert("answers", {
        jobId: args.jobId,
        questionId: args.questionId,
        userId: args.userId,
        answer: args.answer,
        fileId: args.fileId,
      });
  
      return answerId;
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

