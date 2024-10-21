import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitResults = mutation({
  args: {
    userId: v.id("users"),
    testId: v.id("aptitude_test"),
    selectedAnswers: v.array(
      v.object({
        question: v.string(),
        selectedAnswer: v.string(),
      })
    ),
    score: v.number(),
  },
  async handler(ctx, args) {
    // Insert the result into the database
    await ctx.db.insert("results", {
      userId: args.userId,
      testId: args.testId,
      selectedAnswers: args.selectedAnswers,
      score: args.score,
    });
  },
});
