import {
    MutationCtx,
    QueryCtx,
    internalMutation,
    mutation,
    query,
} from "./_generated/server";
import { v } from "convex/values";
import { answerTypes } from "./schema";

export const createQuestion = mutation({
    args: {
      jobId: v.id("jobs"),
      question: v.string(),
      answerType: answerTypes,
    },
    handler: async (ctx, args) => {
      const questionId = await ctx.db.insert("questions", {
        jobId: args.jobId,
        question: args.question,
        answerType: args.answerType,
      });
  
      return questionId;
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
  