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
  residenceType,
  consentmentType,
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
    ucefileId: v.id("_storage"),
    uacefileId: v.id("_storage"),
    userId: v.string(),
    type: fileTypes,
    dateOfBirth: v.string(),
    residence: residenceType,
    email: v.string(),
    telephone: v.string(),
    postalAddress: v.string(),
    nationality: v.string(),
    homeDistrict: v.string(),
    subcounty: v.string(),
    village: v.string(),
    presentministry: v.string(),
    presentpost: v.string(),
    presentsalary: v.string(),
    termsofemployment: v.string(),
    maritalstatus: v.string(),
    children: v.string(),
    schools: v.array(schoolType),
    employmentrecord: v.array(employmentType),
    uceyear: v.string(),
    ucerecord: v.array(uceType),
    uaceyear: v.string(),
    uacerecord: v.array(uaceType),
    conviction: v.string(),
    available: v.string(),
    referencerecord: v.array(referenceType),
    officerrecord: v.array(officerType),
    consentment: consentmentType,
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
      ucefileId: args.ucefileId,
      uacefileId: args.uacefileId,
      type: args.type,
      userId: userId,
      residence: args.residence,
      email: args.email,
      telephone: args.telephone,
      postalAddress: args.postalAddress,
      nationality: args.nationality,
      homeDistrict: args.homeDistrict,
      subcounty: args.subcounty,
      village: args.village,
      presentministry: args.presentministry,
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
    shortlisted: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    let files = await ctx.db.query("files").collect();

    if (args.shortlisted) {
      const shortlisted = await ctx.db
        .query("shortlisted")
        .collect();

      files = files.filter((file) =>
        shortlisted.some((shortlist) => shortlist.userId === file.userId)
      );
    }

    if (args.deletedOnly) {
      files = files.filter((file) => file.shouldDelete);
    } else {
      files = files.filter((file) => !file.shouldDelete);
    }

    const filesWithUrl = await Promise.all(
      files.map(async (file) => ({
        ...file,
        uceFileUrl: file.ucefileId
          ? await ctx.storage.getUrl(file.ucefileId)
          : null,
        uaceFileUrl: file.uacefileId
          ? await ctx.storage.getUrl(file.uacefileId)
          : null,
        post: file.post,
        email: file.email,
        telephone: file.telephone,
        postalAddress: file.postalAddress,
        nationality: file.nationality,
        homeDistrict: file.homeDistrict,
        subcounty: file.subcounty,
        village: file.village,
        residence: file.residence,
        presentministry: file.presentministry,
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
        if (file.ucefileId) {
          await ctx.storage.delete(file.ucefileId);
        }
        if (file.uacefileId) {
          await ctx.storage.delete(file.uacefileId);
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
  args: { userId: v.id("users" )},
  async handler(ctx, args) {

    const shortlisted = await ctx.db
      .query("shortlisted")
      .first();

    if (!shortlisted) {
      await ctx.db.insert("shortlisted", {
        userId: args.userId,
      });
    } else {
      await ctx.db.delete(shortlisted._id);
    }
  },
});

export const getAllShortListed = query({
  args: {},
  async handler(ctx, args) {
    const shortlisted = await ctx.db
      .query("shortlisted")
      .collect();

    return shortlisted;
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
