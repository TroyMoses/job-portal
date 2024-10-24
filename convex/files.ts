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
    imageId: v.id("_storage"),
    uacefileId: v.id("_storage"),
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
      uacefileId: args.uacefileId,
      type: args.type,
      userId: userId,
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
      const shortlisted = await ctx.db
        .query("shortlisted")
        .collect();

      files = files.filter((file) =>
        shortlisted.some((shortlist) => shortlist.userId === file.userId)
      );
    }

    if (args.appointedOnly) {
      const appointed = await ctx.db
        .query("appointed")
        .collect();

      files = files.filter((file) =>
        appointed.some((appointed) => appointed.userId === file.userId)
      );
    }

    if (args.rejectedOnly) {
      const rejected = await ctx.db
        .query("rejected")
        .collect();

      files = files.filter((file) =>
        rejected.some((rejected) => rejected.userId === file.userId)
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
        imageUrl: file.imageId
          ? await ctx.storage.getUrl(file.imageId)
          : null,
        uaceFileUrl: file.uacefileId
          ? await ctx.storage.getUrl(file.uacefileId)
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
        if (file.imageId) {
          await ctx.storage.delete(file.imageId);
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
    }
  },
});

export const toggleRejected = mutation({
  args: { userId: v.id("users" )},
  async handler(ctx, args) {

    const rejected = await ctx.db
      .query("rejected")
      .first();

    if (!rejected) {
      await ctx.db.insert("rejected", {
        userId: args.userId,
      });
    } else {
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

export const getAllRejected = query({
  args: {},
  async handler(ctx, args) {
    const rejected = await ctx.db
      .query("rejected")
      .collect();

    return rejected;
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
