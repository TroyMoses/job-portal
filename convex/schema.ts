import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(
  v.literal("image"),
  v.literal("csv"),
  v.literal("pdf"),
  v.literal("ppt"),
  v.literal("pptx"),
  v.literal("doc"),
  v.literal("docx"),
  v.literal("xlsx")
);

export const roles = v.union(v.literal("admin"), v.literal("member"));

export const answerTypes = v.union(
  v.literal("text"),
  v.literal("essay"),
  v.literal("number"),
  v.literal("boolean"),
  v.literal("file")
);

export default defineSchema({
  files: defineTable({
    name: v.string(),
    type: fileTypes,
    orgId: v.string(),
    fileId: v.id("_storage"),
    userId: v.id("users"),
    shouldDelete: v.optional(v.boolean()),
  })
    .index("by_orgId", ["orgId"])
    .index("by_shouldDelete", ["shouldDelete"]),
    
  favorites: defineTable({
    fileId: v.id("files"),
    orgId: v.string(),
    userId: v.id("users"),
  }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),
  
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      })
    ),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
  
  jobs: defineTable({
    title: v.string(),
    description: v.string(),
    image: v.optional(v.string()),
    salary: v.string(),
    location: v.string(),
    jobType: v.string(),
  }).index("by_title_location", ["title", "location"]),
  
  questions: defineTable({
    jobId: v.id("jobs"),
    question: v.string(),
    answerType: answerTypes,
  }).index("by_jobId", ["jobId"]),
  
  answers: defineTable({
    jobId: v.id("jobs"),
    questionId: v.id("questions"),
    userId: v.id("users"),
    answer: v.any(),
    fileId: v.optional(v.id("files")),
  }).index("by_jobId_userId", ["jobId", "userId"]),
});
