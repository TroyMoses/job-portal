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

// Define yesNoChoice as a union of literals
export const yesNoChoiceType = v.union(v.literal("yes"), v.literal("no"));

export default defineSchema({
  files: defineTable({
    name: v.string(),
    type: fileTypes,
    orgId: v.string(),
    fileId: v.id("_storage"),
    userId: v.id("users"),
    shouldDelete: v.optional(v.boolean()),
    dateOfBirth: v.optional(v.string()),
    yesNoChoice: v.optional(yesNoChoiceType),
    post: v.optional(v.string()),
    email: v.optional(v.string()),
    telephone: v.optional(v.string()),
    postalAddress: v.optional(v.string()),
    nationality: v.optional(v.string()),
    homeDistrict: v.optional(v.string()),
    subcounty: v.optional(v.string()),
    village: v.optional(v.string()),
    presentministry: v.optional(v.string()),
    presentpost: v.optional(v.string()),
    presentsalary: v.optional(v.string()),
    termsofemployment: v.optional(v.string()),
    maritalstatus: v.optional(v.string()),
    children: v.optional(v.string()),
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
});
