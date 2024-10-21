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
  testType,
} from "./schema";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a job");
  }

  return await ctx.storage.generateUploadUrl();
});

export const createTest = mutation({
  args: {
    aptitudeTest: v.array(testType),
  },
  async handler(ctx, args) {
    await ctx.db.insert("aptitude_test", {
      aptitudeTest: args.aptitudeTest,
    });
  },
});

export const getTestById = query({
  args: { testId: v.id("aptitude_test") },
  async handler(ctx, { testId }) {
    const aptitude_test = await ctx.db.get(testId);
    if (!aptitude_test) {
      throw new ConvexError("Aptitude test not found");
    }
    return aptitude_test;
  },
});

export const getAllTests = query({
  args: {},
  async handler(ctx) {
    const aptitude_test = await ctx.db.query("aptitude_test").collect();

    return aptitude_test;
  },
});

export const deleteTests = internalMutation({
  args: {},
  async handler(ctx) {
    const aptitude_test = await ctx.db
      .query("aptitude_test")
      .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
      .collect();

    await Promise.all(
      aptitude_test.map(async (job) => {
        return await ctx.db.delete(job._id);
      })
    );
  },
});

export const deleteTest = mutation({
  args: { testId: v.id("aptitude_test") },
  async handler(ctx, args) {
    const access = await hasAccessToTest(ctx, args.testId);

    if (!access) {
      throw new ConvexError("no access to job");
    }

    await ctx.db.patch(args.testId, {
      shouldDelete: true,
    });
  },
});

export const restoreJob = mutation({
  args: { testId: v.id("aptitude_test") },
  async handler(ctx, args) {
    const access = await hasAccessToTest(ctx, args.testId);

    if (!access) {
      throw new ConvexError("no access to job");
    }

    await ctx.db.patch(args.testId, {
      shouldDelete: false,
    });
  },
});

async function hasAccessToTest(ctx: QueryCtx | MutationCtx, testId: Id<"aptitude_test">) {
  const aptitude_test = await ctx.db.get(testId);

  if (!aptitude_test) {
    return null;
  }

  return { aptitude_test };
}
