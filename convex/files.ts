import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import {
  employmentType,
  fileTypes,
  officerType,
  referenceType,
  schoolType,
  uaceType,
  uceType,
} from "./schema";
import { Doc, Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a file");
  }

  return await ctx.storage.generateUploadUrl();
});

export const createFile = mutation({
  args: {
    post: v.string(),
    name: v.string(),
    imageId: v.id("_storage"),
    ucefileId: v.id("_storage"),
    uacefileId: v.optional(v.id("_storage")),
    plefileId: v.optional(v.id("_storage")),
    transcriptfileId: v.optional(v.id("_storage")),
    universityfileId: v.optional(v.id("_storage")),
    prooffileoneId: v.optional(v.id("_storage")),
    prooffiletwoId: v.optional(v.id("_storage")),
    prooffilethreeId: v.optional(v.id("_storage")),
    prooffilefourId: v.optional(v.id("_storage")),
    prooffilefiveId: v.optional(v.id("_storage")),
    prooffilesixId: v.optional(v.id("_storage")),
    userId: v.string(),
    type: v.optional(fileTypes),
    dateOfBirth: v.string(),
    residence: v.string(),
    email: v.string(),
    telephone: v.string(),
    postalAddress: v.optional(v.string()),
    nationality: v.string(),
    nin: v.string(),
    homeDistrict: v.string(),
    subcounty: v.string(),
    village: v.string(),
    presentministry: v.optional(v.string()),
    registrationnumber: v.optional(v.string()),
    presentpost: v.optional(v.string()),
    presentsalary: v.optional(v.string()),
    termsofemployment: v.optional(v.string()),
    maritalstatus: v.string(),
    children: v.string(),
    schools: v.array(schoolType),
    employmentrecord: v.array(employmentType),
    uceyear: v.string(),
    ucerecord: v.array(uceType),
    uaceyear: v.optional(v.string()),
    uacerecord: v.optional(v.array(uaceType)),
    conviction: v.string(),
    available: v.string(),
    referencerecord: v.array(referenceType),
    officerrecord: v.array(officerType),
    consentment: v.string(),
  },

  async handler(ctx, args) {
    // Fetch the Clerk user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to upload a file");
    }

    // Find the Convex user using Clerk's tokenIdentifier
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new ConvexError("User not found in Convex database");
    }

    // Now use the Convex user's _id (the proper Id<"users">) in your createFile mutation
    const userId = user._id;

    await ctx.db.insert("files", {
      post: args.post,
      name: args.name,
      imageId: args.imageId,
      ucefileId: args.ucefileId,
      uacefileId: args.uacefileId,
      plefileId: args.plefileId,
      transcriptfileId: args.transcriptfileId,
      universityfileId: args.universityfileId,
      prooffileoneId: args.prooffileoneId,
      prooffiletwoId: args.prooffiletwoId,
      prooffilethreeId: args.prooffilethreeId,
      prooffilefourId: args.prooffilefourId,
      prooffilefiveId: args.prooffilefiveId,
      prooffilesixId: args.prooffilesixId,
      type: args.type,
      userId: userId,
      dateOfBirth: args.dateOfBirth,
      residence: args.residence,
      email: args.email,
      telephone: args.telephone,
      postalAddress: args.postalAddress,
      nationality: args.nationality,
      nin: args.nationality,
      homeDistrict: args.homeDistrict,
      subcounty: args.subcounty,
      village: args.village,
      presentministry: args.presentministry,
      registrationnumber: args.registrationnumber,
      presentpost: args.presentpost,
      presentsalary: args.presentsalary,
      termsofemployment: args.termsofemployment,
      maritalstatus: args.maritalstatus,
      children: args.children,
      schools: args.schools,
      employmentrecord: args.employmentrecord,
      uceyear: args.uceyear,
      ucerecord: args.ucerecord,
      uaceyear: args.uaceyear,
      uacerecord: args.uacerecord,
      conviction: args.conviction,
      available: args.available,
      referencerecord: args.referencerecord,
      officerrecord: args.officerrecord,
      consentment: args.consentment,
    });
  },
});

export const getFiles = query({
  args: {
    rejectedOnly: v.optional(v.boolean()),
    appointedOnly: v.optional(v.boolean()),
    shortlisted: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    let files = await ctx.db.query("files").collect();

    if (args.shortlisted) {
      const shortlisted = await ctx.db.query("shortlisted").collect();

      files = files.filter((file) =>
        shortlisted.some((shortlist) => shortlist.userId === file.userId)
      );
    }

    if (args.appointedOnly) {
      const appointed = await ctx.db.query("appointed").collect();

      files = files.filter((file) =>
        appointed.some((appointed) => appointed.userId === file.userId)
      );
    }

    if (args.rejectedOnly) {
      const rejected = await ctx.db.query("rejected").collect();
      files = files
        .filter((file) =>
          rejected.some((rejectedItem) => rejectedItem.userId === file.userId)
        )
        .map((file) => ({
          ...file,
          reason: rejected.find((rejectedItem) => rejectedItem.userId === file.userId)?.reason || "",
        }));
    }

    if (args.deletedOnly) {
      files = files.filter((file) => file.shouldDelete);
    } else {
      files = files.filter((file) => !file.shouldDelete);
    }

    const filesWithUrl = await Promise.all(
      files.map(async (file) => ({
        ...file,
        imageUrl: file.imageId ? await ctx.storage.getUrl(file.imageId) : null,
        uceFileUrl: file.ucefileId
          ? await ctx.storage.getUrl(file.ucefileId)
          : null,
        uaceFileUrl: file.uacefileId
          ? await ctx.storage.getUrl(file.uacefileId)
          : null,
        pleFileUrl: file.plefileId
          ? await ctx.storage.getUrl(file.plefileId)
          : null,
        transcriptFileUrl: file.transcriptfileId
          ? await ctx.storage.getUrl(file.transcriptfileId)
          : null,
        universityFileUrl: file.universityfileId
          ? await ctx.storage.getUrl(file.universityfileId)
          : null,
        proofFileOneUrl: file.prooffileoneId
          ? await ctx.storage.getUrl(file.prooffileoneId)
          : null,
        proofFileTwoUrl: file.prooffiletwoId
          ? await ctx.storage.getUrl(file.prooffiletwoId)
          : null,
        proofFileThreeUrl: file.prooffilethreeId
          ? await ctx.storage.getUrl(file.prooffilethreeId)
          : null,
        proofFileFourUrl: file.prooffilefourId
          ? await ctx.storage.getUrl(file.prooffilefourId)
          : null,
        proofFileFiveUrl: file.prooffilefiveId
          ? await ctx.storage.getUrl(file.prooffilefiveId)
          : null,
        proofFileSixUrl: file.prooffilesixId
          ? await ctx.storage.getUrl(file.prooffilesixId)
          : null,
        post: file.post,
        email: file.email,
        telephone: file.telephone,
        postalAddress: file.postalAddress,
        nationality: file.nationality,
        nin: file.nin,
        homeDistrict: file.homeDistrict,
        subcounty: file.subcounty,
        village: file.village,
        dateOfBirth: file.dateOfBirth,
        residence: file.residence,
        presentministry: file.presentministry,
        registrationnumber: file.registrationnumber,
        presentpost: file.presentpost,
        presentsalary: file.presentsalary,
        termsofemployment: file.termsofemployment,
        maritalstatus: file.maritalstatus,
        children: file.children,
        schools: file.schools,
        employmentrecord: file.employmentrecord,
        uceyear: file.uceyear,
        ucerecord: file.ucerecord,
        uaceyear: file.uaceyear,
        uacerecord: file.uacerecord,
        conviction: file.conviction,
        available: file.available,
        referencerecord: file.referencerecord,
        officerrecord: file.officerrecord,
        consentment: file.consentment,
      }))
    );

    return filesWithUrl;
  },
});

export const deleteAllFiles = internalMutation({
  args: {},
  async handler(ctx) {
    const files = await ctx.db
      .query("files")
      .withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true))
      .collect();

    await Promise.all(
      files.map(async (file) => {
        if (file.imageId) {
          await ctx.storage.delete(file.imageId);
        }
        if (file.ucefileId) {
          await ctx.storage.delete(file.ucefileId);
        }
        return await ctx.db.delete(file._id);
      })
    );
  },
});

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("no access to file");
    }

    await ctx.db.patch(args.fileId, {
      shouldDelete: true,
    });
  },
});

export const restoreFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("no access to file");
    }

    await ctx.db.patch(args.fileId, {
      shouldDelete: false,
    });
  },
});

export const toggleShortlisted = mutation({
  args: { userId: v.id("users") },
  async handler(ctx, args) {
    // Check if the user is already in the `shortlisted` table
    const shortlisted = await ctx.db
      .query("shortlisted")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!shortlisted) {
      // Insert the user into the `shortlisted` table
      await ctx.db.insert("shortlisted", {
        userId: args.userId,
      });

      // Remove the user from the `rejected` table if they are present
      const rejected = await ctx.db
        .query("rejected")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();

      if (rejected) {
        await ctx.db.delete(rejected._id);
      }
    } else {
    }
  },
});

export const toggleRejected = mutation({
  args: { userId: v.id("users"), reason: v.string(), },
  async handler(ctx, args) {
    const rejected = await ctx.db
      .query("rejected")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!rejected) {
      await ctx.db.insert("rejected", {
        userId: args.userId,
        reason: args.reason,
      });

      const shortlisted = await ctx.db
        .query("shortlisted")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();

      if (shortlisted) {
        await ctx.db.delete(shortlisted._id);
      }
    } else {
    }
  },
});

export const getAllShortListed = query({
  args: {},
  async handler(ctx, args) {
    const shortlisted = await ctx.db.query("shortlisted").collect();

    return shortlisted;
  },
});

export const getAllRejected = query({
  args: {},
  async handler(ctx, args) {
    const rejected = await ctx.db.query("rejected").collect();

    return rejected;
  },
});

export const getAllAppointed = query({
  args: {},
  async handler(ctx, args) {
    const appointed = await ctx.db.query("appointed").collect();

    return appointed;
  },
});

async function hasAccessToFile(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">
) {
  const file = await ctx.db.get(fileId);

  if (!file) {
    return null;
  }

  return { file };
}
