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

// Define residence as a union of literals
export const residenceType = v.union(
  v.literal("temporary"),
  v.literal("permanent")
);

// Define consentment as a union of literals
export const consentmentType = v.union(v.literal("yes"), v.literal("no"));

export const jobStatusTypes = v.union(
  v.literal("urgent"),
  v.literal("normal"),
  v.literal("closed"),
  v.literal("all")
);

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

// keyFunctions structure
export const keyFunctionsType = v.object({
  function: v.string(),
});

// qualifications structure
export const qualificationsType = v.object({
  qualification: v.string(),
});

// experiences structure
export const experiencesType = v.object({
  experience: v.string(),
});

// competences structure
export const competencesType = v.object({
  competence: v.string(),
});

// structure for answers with a label indicating correctness
export const answerType = v.object({
  answer: v.string(),
  isCorrect: v.boolean(),
});

// test structure
export const testType = v.object({
  question: v.string(),
  answers: v.array(answerType),
});

// result structure
export const resultType = v.object({
  userId: v.id("users"),
  applicantName: v.optional(v.string()),
  jobPost: v.optional(v.string()),
  testId: v.id("aptitude_test"),
  selectedAnswers: v.array(v.object({
    question: v.string(),
    selectedAnswer: v.string(),
  })),
  aptitudetestscore: v.number(),
  commOne: v.optional(v.number()),
  commTwo: v.optional(v.number()),
  commThree: v.optional(v.number()),
  commFour: v.optional(v.number()),
  oralInterviewAverage: v.optional(v.number()),
  overallAverageScore: v.optional(v.number()),
});

export default defineSchema({
  files: defineTable({
    name: v.string(),
    type: v.optional(fileTypes),
    imageId: v.optional(v.id("_storage")),
    uacefileId: v.optional(v.id("_storage")),
    fileoneId: v.optional(v.id("_storage")),
    filetwoId: v.optional(v.id("_storage")),
    filethreeId: v.optional(v.id("_storage")),
    filefourId: v.optional(v.id("_storage")),
    filefiveId: v.optional(v.id("_storage")),
    filesixId: v.optional(v.id("_storage")),
    filesevenId: v.optional(v.id("_storage")),
    fileeightId: v.optional(v.id("_storage")),
    filenineId: v.optional(v.id("_storage")),
    filetenId: v.optional(v.id("_storage")),
    userId: v.id("users"),
    shouldDelete: v.optional(v.boolean()),
    dateOfBirth: v.optional(v.string()),
    post: v.optional(v.string()),
    email: v.optional(v.string()),
    telephone: v.optional(v.string()),
    postalAddress: v.optional(v.string()),
    nationality: v.optional(v.string()),
    nin: v.optional(v.string()),
    homeDistrict: v.optional(v.string()),
    subcounty: v.optional(v.string()),
    village: v.optional(v.string()),
    residence: v.optional(v.string()),
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
  }).index("by_shouldDelete", ["shouldDelete"]),

  shortlisted: defineTable({
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),

  appointed: defineTable({
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),

  rejected: defineTable({
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  jobs: defineTable({
    title: v.string(),
    salaryScale: v.string(),
    reportsTo: v.string(),
    purpose: v.string(),
    keyFunctions: v.optional(v.array(keyFunctionsType)),
    qualifications: v.optional(v.array(qualificationsType)),
    experiences: v.optional(v.array(experiencesType)),
    competences: v.optional(v.array(competencesType)),
    shouldDelete: v.optional(v.boolean()),
  }).index("by_shouldDelete", ["shouldDelete"]),

  aptitude_test: defineTable({
    aptitudeTest: v.optional(v.array(testType)),
    shouldDelete: v.optional(v.boolean()),
  }).index("by_shouldDelete", ["shouldDelete"]),

  results: defineTable(resultType).index("by_userId", ["userId"]),

});
