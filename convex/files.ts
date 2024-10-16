import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { employmentType, fileTypes, officerType, referenceType, schoolType, uaceType, uceType, residenceType, consentmentType } from "./schema";
import { Doc, Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a file");
  }

  return await ctx.storage.generateUploadUrl();
});

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();

  if (!user) {
    return null;
  }

  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    return null;
  }

  return { user };
}

export const createFile = mutation({
  args: {
    post: v.string(),
    name: v.string(),
    ucefileId: v.id("_storage"),
    uacefileId: v.id("_storage"),
    orgId: v.string(),
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
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      throw new ConvexError("you do not have access to this org");
    }

    await ctx.db.insert("files", {
      post: args.post,
      name: args.name,
      orgId: args.orgId,
      ucefileId: args.ucefileId,
      uacefileId: args.uacefileId,
      type: args.type,
      userId: hasAccess.user._id,
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
    orgId: v.string(),
    query: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
    type: v.optional(fileTypes),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    if (query) {
      files = files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (args.favorites) {
      const favorites = await ctx.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) =>
          q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
        )
        .collect();

      files = files.filter((file) =>
        favorites.some((favorite) => favorite.fileId === file._id)
      );
    }

    if (args.deletedOnly) {
      files = files.filter((file) => file.shouldDelete);
    } else {
      files = files.filter((file) => !file.shouldDelete);
    }

    if (args.type) {
      files = files.filter((file) => file.type === args.type);
    }

    const filesWithUrl = await Promise.all(
      files.map(async (file) => ({
        ...file,
        uceFileUrl: file.ucefileId ? await ctx.storage.getUrl(file.ucefileId) : null,
        uaceFileUrl: file.uacefileId ? await ctx.storage.getUrl(file.uacefileId) : null,
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

function assertCanDeleteFile(user: Doc<"users">, file: Doc<"files">) {
  const canDelete =
    file.userId === user._id ||
    user.orgIds.find((org) => org.orgId === file.orgId)?.role === "admin";

  if (!canDelete) {
    throw new ConvexError("you have no acces to delete this file");
  }
}

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("no access to file");
    }

    assertCanDeleteFile(access.user, access.file);

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

    assertCanDeleteFile(access.user, access.file);

    await ctx.db.patch(args.fileId, {
      shouldDelete: false,
    });
  },
});

export const toggleFavorite = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("no access to file");
    }

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q
          .eq("userId", access.user._id)
          .eq("orgId", access.file.orgId)
          .eq("fileId", access.file._id)
      )
      .first();

    if (!favorite) {
      await ctx.db.insert("favorites", {
        fileId: access.file._id,
        userId: access.user._id,
        orgId: access.file.orgId,
      });
    } else {
      await ctx.db.delete(favorite._id);
    }
  },
});

export const getAllFavorites = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
      )
      .collect();

    return favorites;
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

  const hasAccess = await hasAccessToOrg(ctx, file.orgId);

  if (!hasAccess) {
    return null;
  }

  return { user: hasAccess.user, file };
}
