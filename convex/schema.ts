import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    projectType: v.optional(v.union(v.literal("normal"), v.literal("text"))),
    textContent: v.optional(v.string()),
    category: v.optional(v.string()),
    year: v.optional(v.string()),
    client: v.optional(v.string()),
    coverImage: v.optional(v.id("_storage")),
    // Content sections
    textureTitle: v.optional(v.string()),
    textureText: v.optional(v.string()),
    formTitle: v.optional(v.string()),
    formText: v.optional(v.string()),
    philosophyTitle: v.optional(v.string()),
    philosophyText: v.optional(v.string()),
    dataValue: v.optional(v.string()),
    dataLabel: v.optional(v.string()),
  }),
  projectConfig: defineTable({
    projectId: v.number(),
    name: v.string(),
    title: v.string(),
    folder: v.string(),
    description: v.string(),
    cell: v.object({
      left: v.number(),
      top: v.number(),
      width: v.number(),
      height: v.number(),
      rotation: v.number(),
      zIndex: v.number(),
      isActive: v.boolean(),
    }),
  }),
  projectImages: defineTable({
    projectId: v.number(),
    storageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    order: v.number(),
    isCover: v.optional(v.boolean()),
  }),
  projectCells: defineTable({
    projectId: v.number(),
    projectName: v.string(),
    left: v.number(),
    top: v.number(),
    width: v.number(),
    height: v.number(),
    rotation: v.number(),
    zIndex: v.number(),
    isActive: v.boolean(),
  }),
});
