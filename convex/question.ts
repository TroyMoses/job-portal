import {
    MutationCtx,
    QueryCtx,
    internalMutation,
    mutation,
    query,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { answerTypes } from "./schema";


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

export const createQuestion = mutation({
    args: {
      jobId: v.id("jobs"),
      orgId: v.string(),
      question: v.string(),
      answerType: answerTypes,
    },
    handler: async (ctx, args) => {
      const questionId = await ctx.db.insert("questions", {
        jobId: args.jobId,
        orgId: args.orgId,
        question: args.question,
        answerType: args.answerType,
      });
    },
});

export const getQuestion = query({
    args: {
      questionId: v.id("questions"),
    },
    handler: async (ctx, args) => {
      const question = await ctx.db.get(args.questionId);
  
      if (!question) {
        throw new Error("Question not found");
      }
  
      return question;
    },
});

export const updateQuestion = mutation({
    args: {
      questionId: v.id("questions"),
      question: v.optional(v.string()),
      answerType: v.optional(answerTypes),
    },
    handler: async (ctx, args) => {
      const updateData = {
        ...(args.question && { question: args.question }),
        ...(args.answerType && { answerType: args.answerType }),
      };
  
      await ctx.db.patch(args.questionId, updateData);
  
      const updatedQuestion = await ctx.db.get(args.questionId);
      return updatedQuestion; // Return updated question
    },
});

export const deleteQuestion = mutation({
    args: {
      questionId: v.id("questions"),
    },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.questionId);
  
      return { success: true };
    },
  });
  