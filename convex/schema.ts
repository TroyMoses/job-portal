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

// school structure
export const schoolType = v.object({
  year: v.string(),
  schoolName: v.string(),
  award: v.string(),
});

// employment structure
export const employmentType = v.object({
  year: v.string(),
  position: v.string(),
  employer: v.string(),
});

// uce structure
export const uceType = v.object({
  subject: v.string(),
  grade: v.string(),
});

// uace structure
export const uaceType = v.object({
  subject: v.string(),
  grade: v.string(),
});

// reference structure
export const referenceType = v.object({
  name: v.string(),
  address: v.string(),
});

// officer structure
export const officerType = v.object({
  name: v.string(),
  title: v.string(),
  contact: v.string(),
});

export default defineSchema({
  files: defineTable({
    name: v.string(),
    type: fileTypes,
    orgId: v.string(),
    ucefileId: v.id("_storage"),
    uacefileId: v.id("_storage"),
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
    schools: v.optional(v.array(schoolType)),
    employmentrecord: v.optional(v.array(employmentType)),
    uceyear: v.optional(v.string()),
    ucerecord: v.optional(v.array(uceType)),
    uaceyear: v.optional(v.string()),
    uacerecord: v.optional(v.array(uaceType)),
    conviction: v.optional(v.string()),
    available: v.optional(v.string()),
    referencerecord: v.optional(v.array(referenceType)),
    officerrecord: v.optional(v.array(officerType)),
    consentment: v.optional(v.string()),
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
