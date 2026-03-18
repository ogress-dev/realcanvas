import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const clearAndReseed = mutation({
  handler: async (ctx) => {
    const existingProjects = await ctx.db.query("projects").collect();
    for (const p of existingProjects) {
      await ctx.db.delete(p._id);
    }
    
    const existingImages = await ctx.db.query("projectImages").collect();
    for (const img of existingImages) {
      await ctx.db.delete(img._id);
    }
    
    const existingCells = await ctx.db.query("projectCells").collect();
    for (const cell of existingCells) {
      await ctx.db.delete(cell._id);
    }
    
    const existingConfig = await ctx.db.query("projectConfig").collect();
    for (const config of existingConfig) {
      await ctx.db.delete(config._id);
    }
    
    const projectsToSeed = [
      { projectId: 1, name: "Grillwise", title: "Grillwise", folder: "Grillwise", description: "Brand & Web Design", cell: { left: 800, top: 640, width: 288, height: 160, rotation: 15, zIndex: 50, isActive: true } },
      { projectId: 2, name: "Project-2", title: "Project 2", folder: "Project-2", description: "Project 2", cell: { left: 1120, top: 640, width: 96, height: 96, rotation: 45, zIndex: 50, isActive: true } },
      { projectId: 3, name: "Albed-Price-list", title: "Albed Price list", folder: "Albed-Price-list", description: "Strategy & Editorial Design", cell: { left: 960, top: 320, width: 270, height: 270, rotation: 15, zIndex: 50, isActive: true } },
      { projectId: 4, name: "Abaco", title: "Abaco", folder: "Abaco", description: "Product Design", cell: { left: 640, top: 320, width: 170, height: 170, rotation: 30, zIndex: 50, isActive: true } },
      { projectId: 5, name: "ApCollective", title: "ApCollective", folder: "ApCollective", description: "Portfolio", cell: { left: 320, top: 320, width: 120, height: 170, rotation: -30, zIndex: 50, isActive: true } },
      { projectId: 6, name: "Muso", title: "Muso", folder: "Muso", description: "Brand, Strategy, Web & Product Design", cell: { left: 0, top: 320, width: 270, height: 270, rotation: -15, zIndex: 50, isActive: true } },
      { projectId: 7, name: "Empathy-Design", title: "Empathy Design", folder: "Empathy-Design", description: "Logo & Set Design", cell: { left: -160, top: 640, width: 160, height: 160, rotation: -30, zIndex: 50, isActive: true } },
      { projectId: 8, name: "Syform", title: "Syform", folder: "Syform", description: "Set & Graphic Design", cell: { left: 0, top: 960, width: 160, height: 160, rotation: -30, zIndex: 50, isActive: true } },
      { projectId: 9, name: "Upcoming", title: "Upcoming", folder: "Upcoming", description: "Coming Soon", cell: { left: 320, top: 960, width: 160, height: 208, rotation: -15, zIndex: 50, isActive: true } },
      { projectId: 10, name: "The-Social-Fablab", title: "The Social Fablab", folder: "The-Social-Fablab", description: "Speculative & Brand Design", cell: { left: 640, top: 960, width: 178, height: 96, rotation: 15, zIndex: 50, isActive: true } },
      { projectId: 11, name: "Diversa", title: "Diversa", folder: "Diversa", description: "Strategy & Brand Design", cell: { left: 960, top: 960, width: 160, height: 160, rotation: 30, zIndex: 50, isActive: true } },
    ];
    
    for (const p of projectsToSeed) {
      await ctx.db.insert("projectConfig", {
        projectId: p.projectId,
        name: p.name,
        title: p.title,
        folder: p.folder,
        description: p.description,
        cell: p.cell,
      });
      await ctx.db.insert("projects", {
        name: p.folder,
        title: p.title,
        description: p.description,
      });
    }
    
    return { message: "Cleared and reseeded successfully" };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const uploadImage = mutation({
  args: {
    storageId: v.id("_storage"),
    projectId: v.number(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const existingImages = await ctx.db.query("projectImages")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .collect();
    
    const maxOrder = existingImages.length > 0 
      ? Math.max(...existingImages.map((img) => img.order)) 
      : 0;
    
    await ctx.db.insert("projectImages", {
      projectId: args.projectId,
      storageId: args.storageId,
      order: args.order || maxOrder + 1,
    });
    
    return { success: true };
  },
});

export const setImageAsCover = mutation({
  args: {
    imageId: v.id("projectImages"),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);
    if (!image) return { success: false, error: "Image not found" };
    
    const allImages = await ctx.db.query("projectImages")
      .filter((q) => q.eq(q.field("projectId"), image.projectId))
      .collect();
    
    for (const img of allImages) {
      await ctx.db.patch(img._id, { isCover: false });
    }
    
    await ctx.db.patch(args.imageId, { isCover: true });
    
    return { success: true };
  },
});

export const uploadCoverImage = mutation({
  args: {
    storageId: v.id("_storage"),
    projectId: v.number(),
  },
  handler: async (ctx, args) => {
    const allConfig = await ctx.db.query("projectConfig").collect();
    const project = allConfig.find(c => c.projectId === args.projectId);
    if (!project) return { success: false, error: "Project not found" };
    
    const existing = await ctx.db.query("projects")
      .filter((q) => q.eq(q.field("name"), project.folder))
      .first();
    
    if (existing) {
      if (existing.coverImage) {
        try {
          await ctx.storage.delete(existing.coverImage);
        } catch (e) {
          console.log("Could not delete old cover image:", e);
        }
      }
      await ctx.db.patch(existing._id, {
        coverImage: args.storageId,
      });
    } else {
      await ctx.db.insert("projects", {
        name: project.folder,
        title: project.title,
        description: project.description,
        coverImage: args.storageId,
      });
    }
    
    return { success: true };
  },
});

export const createProject = mutation({
  args: {
    name: v.string(),
    title: v.string(),
    folder: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const allConfig = await ctx.db.query("projectConfig").collect();
    const staticIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const dynamicIds = allConfig.map(c => c.projectId);
    const usedIds = [...staticIds, ...dynamicIds];
    const maxId = Math.max(...usedIds, 0);
    const newId = maxId + 1;
    
    await ctx.db.insert("projectConfig", {
      projectId: newId,
      name: args.name,
      title: args.title,
      folder: args.folder,
      description: args.description,
      cell: {
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        rotation: 0,
        zIndex: 50,
        isActive: true,
      },
    });
    
    await ctx.db.insert("projects", {
      name: args.folder,
      title: args.title,
      description: args.description,
    });
    
    return { success: true, projectId: newId };
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.number(),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.query("projectConfig")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .first();
    
    if (config) {
      await ctx.db.delete(config._id);
    }
    
    const project = await ctx.db.query("projects")
      .filter((q) => q.eq(q.field("name"), config?.folder || ""))
      .first();
    
    if (project) {
      await ctx.db.delete(project._id);
    }
    
    const images = await ctx.db.query("projectImages")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .collect();
    
    for (const img of images) {
      await ctx.db.delete(img._id);
    }
    
    const cell = await ctx.db.query("projectCells")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .first();
    
    if (cell) {
      await ctx.db.delete(cell._id);
    }
    
    return { success: true };
  },
});

export const seedProjects = mutation({
  handler: async (ctx) => {
    const existingConfig = await ctx.db.query("projectConfig").collect();
    const existingProjects = await ctx.db.query("projects").collect();
    
    const projectsToSeed = [
      { projectId: 1, name: "Grillwise", title: "Grillwise", folder: "Grillwise", description: "Brand & Web Design", cell: { left: 800, top: 640, width: 288, height: 160, rotation: 15, zIndex: 50, isActive: true } },
      { projectId: 2, name: "Project-2", title: "Project 2", folder: "Project-2", description: "Project 2", cell: { left: 1120, top: 640, width: 96, height: 96, rotation: 45, zIndex: 50, isActive: true } },
      { projectId: 3, name: "Albed-Price-list", title: "Albed Price list", folder: "Albed-Price-list", description: "Strategy & Editorial Design", cell: { left: 960, top: 320, width: 270, height: 270, rotation: 15, zIndex: 50, isActive: true } },
      { projectId: 4, name: "Abaco", title: "Abaco", folder: "Abaco", description: "Product Design", cell: { left: 640, top: 320, width: 170, height: 170, rotation: 30, zIndex: 50, isActive: true } },
      { projectId: 5, name: "ApCollective", title: "ApCollective", folder: "ApCollective", description: "Portfolio", cell: { left: 320, top: 320, width: 120, height: 170, rotation: -30, zIndex: 50, isActive: true } },
      { projectId: 6, name: "Muso", title: "Muso", folder: "Muso", description: "Brand, Strategy, Web & Product Design", cell: { left: 0, top: 320, width: 270, height: 270, rotation: -15, zIndex: 50, isActive: true } },
      { projectId: 7, name: "Empathy-Design", title: "Empathy Design", folder: "Empathy-Design", description: "Logo & Set Design", cell: { left: -160, top: 640, width: 160, height: 160, rotation: -30, zIndex: 50, isActive: true } },
      { projectId: 8, name: "Syform", title: "Syform", folder: "Syform", description: "Set & Graphic Design", cell: { left: 0, top: 960, width: 160, height: 160, rotation: -30, zIndex: 50, isActive: true } },
      { projectId: 9, name: "Upcoming", title: "Upcoming", folder: "Upcoming", description: "Coming Soon", cell: { left: 320, top: 960, width: 160, height: 208, rotation: -15, zIndex: 50, isActive: true } },
      { projectId: 10, name: "The-Social-Fablab", title: "The Social Fablab", folder: "The-Social-Fablab", description: "Speculative & Brand Design", cell: { left: 640, top: 960, width: 178, height: 96, rotation: 15, zIndex: 50, isActive: true } },
      { projectId: 11, name: "Diversa", title: "Diversa", folder: "Diversa", description: "Strategy & Brand Design", cell: { left: 960, top: 960, width: 160, height: 160, rotation: 30, zIndex: 50, isActive: true } },
    ];
    
    for (const p of projectsToSeed) {
      const existingConfigForProject = existingConfig.find(c => c.projectId === p.projectId);
      if (!existingConfigForProject) {
        await ctx.db.insert("projectConfig", {
          projectId: p.projectId,
          name: p.name,
          title: p.title,
          folder: p.folder,
          description: p.description,
          cell: p.cell,
        });
      }
      
      const existingProject = existingProjects.find(proj => proj.name === p.folder);
      if (!existingProject) {
        await ctx.db.insert("projects", {
          name: p.folder,
          title: p.title,
          description: p.description,
        });
      }
    }
    
    return { success: true, message: `Seeded ${projectsToSeed.length} projects` };
  },
});

export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

interface CellProperties {
  cellNumber: number;
  left: number;
  top: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  isActive: boolean;
}

export const getProjectById = query({
  args: { projectId: v.number() },
  handler: async (ctx, args) => {
    const allConfig = await ctx.db.query("projectConfig").collect();
    const project = allConfig.find((c) => c.projectId === args.projectId);
    if (!project) return null;
    
    const allImages = await ctx.db.query("projectImages").collect();
    const images = allImages.filter((img) => img.projectId === args.projectId);
    
    const allCells = await ctx.db.query("projectCells").collect();
    const dbCell = allCells.find((c) => c.projectId === args.projectId);
    const cell = dbCell ? {
      cellNumber: args.projectId,
      left: dbCell.left,
      top: dbCell.top,
      width: dbCell.width,
      height: dbCell.height,
      rotation: dbCell.rotation,
      zIndex: dbCell.zIndex,
      isActive: dbCell.isActive,
    } : project.cell ? {
      cellNumber: args.projectId,
      ...project.cell,
    } : {
      cellNumber: args.projectId,
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      rotation: 0,
      zIndex: 50,
      isActive: true,
    };
    
    const dbProjects = await ctx.db.query("projects").collect();
    const dbProject = dbProjects.find((p) => p.name === project.folder);
    
    let coverImageUrl: string | null = null;
    if (dbProject?.coverImage) {
      try {
        coverImageUrl = await ctx.storage.getUrl(dbProject.coverImage) || null;
      } catch (e) {
        coverImageUrl = null;
      }
    }
    
    const imagesWithUrls = await Promise.all(
      images.sort((a, b) => a.order - b.order).map(async (img) => {
        let imageUrl: string | null = img.imageUrl || null;
        if (img.storageId && !imageUrl) {
          try {
            imageUrl = await ctx.storage.getUrl(img.storageId) || null;
          } catch (e) {
            imageUrl = null;
          }
        }
        return {
          ...img,
          imageUrl,
        };
      })
    );
    
    return {
      title: dbProject?.title || project.title,
      description: dbProject?.description || project.description,
      folder: project.folder,
      name: project.name,
      cell,
      coverImage: coverImageUrl,
      storageCoverImageId: dbProject?.coverImage || null,
      client: dbProject?.client || null,
      category: dbProject?.category || null,
      year: dbProject?.year || null,
      textureTitle: dbProject?.textureTitle || null,
      textureText: dbProject?.textureText || null,
      formTitle: dbProject?.formTitle || null,
      formText: dbProject?.formText || null,
      philosophyTitle: dbProject?.philosophyTitle || null,
      philosophyText: dbProject?.philosophyText || null,
      dataValue: dbProject?.dataValue || null,
      dataLabel: dbProject?.dataLabel || null,
      images: imagesWithUrls,
    };
  },
});

export const getProjectImages = query({
  args: { projectId: v.number() },
  handler: async (ctx, args) => {
    const allImages = await ctx.db.query("projectImages").collect();
    return allImages
      .filter((img) => img.projectId === args.projectId)
      .sort((a, b) => a.order - b.order);
  },
});

export const listProjects = query({
  handler: async (ctx) => {
    const allImages = await ctx.db.query("projectImages").collect();
    const allCells = await ctx.db.query("projectCells").collect();
    const dbProjects = await ctx.db.query("projects").collect();
    const allConfig = await ctx.db.query("projectConfig").collect();
    
    const allProjectsList = allConfig.map((config) => ({
      name: config.name,
      title: config.title,
      folder: config.folder,
      description: config.description,
      id: config.projectId,
      cellNumber: config.projectId,
      cell: config.cell,
    }));
    
    const projects = await Promise.all(
      allProjectsList.map(async (project) => {
        const numId = project.id;
        const images = allImages.filter((img) => img.projectId === numId);
        const dbCell = allCells.find((c) => c.projectId === numId);
        const cell = dbCell ? {
          cellNumber: dbCell.cellNumber,
          left: dbCell.left,
          top: dbCell.top,
          width: dbCell.width,
          height: dbCell.height,
          rotation: dbCell.rotation,
          zIndex: dbCell.zIndex,
          isActive: dbCell.isActive,
        } : project.cell;
        const dbProject = dbProjects.find((p) => p.name === project.folder);
        
        let coverImageUrl: string | null = null;
        if (dbProject?.coverImage) {
          try {
            coverImageUrl = await ctx.storage.getUrl(dbProject.coverImage) || null;
          } catch (e) {
            coverImageUrl = null;
          }
        }
        
        const imagesWithUrls = await Promise.all(
          images.sort((a, b) => a.order - b.order).map(async (img) => {
            let imageUrl: string | null = img.imageUrl || null;
            if (img.storageId && !imageUrl) {
              try {
                imageUrl = await ctx.storage.getUrl(img.storageId) || null;
              } catch (e) {
                imageUrl = null;
              }
            }
            return {
              ...img,
              imageUrl,
            };
          })
        );
        
        return {
          id: numId,
          title: dbProject?.title || project.title,
          description: dbProject?.description || project.description,
          folder: project.folder,
          name: project.name,
          cell,
          coverImage: coverImageUrl,
          client: dbProject?.client || null,
          category: dbProject?.category || null,
          year: dbProject?.year || null,
          textureTitle: dbProject?.textureTitle || null,
          textureText: dbProject?.textureText || null,
          formTitle: dbProject?.formTitle || null,
          formText: dbProject?.formText || null,
          philosophyTitle: dbProject?.philosophyTitle || null,
          philosophyText: dbProject?.philosophyText || null,
          dataValue: dbProject?.dataValue || null,
          dataLabel: dbProject?.dataLabel || null,
          images: imagesWithUrls,
        };
      })
    );
    return projects;
  },
});

export const seedAll = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("projects").collect();
    if (existing.length > 0) {
      return { message: "Already seeded", count: existing.length };
    }

    const projectsToSeed = [
      { projectId: 1, name: "Grillwise", title: "Grillwise", folder: "Grillwise", description: "Brand & Web Design", cell: { left: 800, top: 640, width: 288, height: 160, rotation: 15, zIndex: 50, isActive: true } },
      { projectId: 2, name: "Project-2", title: "Project 2", folder: "Project-2", description: "Project 2", cell: { left: 1120, top: 640, width: 96, height: 96, rotation: 45, zIndex: 50, isActive: true } },
      { projectId: 3, name: "Albed-Price-list", title: "Albed Price list", folder: "Albed-Price-list", description: "Strategy & Editorial Design", cell: { left: 960, top: 320, width: 270, height: 270, rotation: 15, zIndex: 50, isActive: true } },
      { projectId: 4, name: "Abaco", title: "Abaco", folder: "Abaco", description: "Product Design", cell: { left: 640, top: 320, width: 170, height: 170, rotation: 30, zIndex: 50, isActive: true } },
      { projectId: 5, name: "ApCollective", title: "ApCollective", folder: "ApCollective", description: "Portfolio", cell: { left: 320, top: 320, width: 120, height: 170, rotation: -30, zIndex: 50, isActive: true } },
      { projectId: 6, name: "Muso", title: "Muso", folder: "Muso", description: "Brand, Strategy, Web & Product Design", cell: { left: 0, top: 320, width: 270, height: 270, rotation: -15, zIndex: 50, isActive: true } },
      { projectId: 7, name: "Empathy-Design", title: "Empathy Design", folder: "Empathy-Design", description: "Logo & Set Design", cell: { left: -160, top: 640, width: 160, height: 160, rotation: -30, zIndex: 50, isActive: true } },
      { projectId: 8, name: "Syform", title: "Syform", folder: "Syform", description: "Set & Graphic Design", cell: { left: 0, top: 960, width: 160, height: 160, rotation: -30, zIndex: 50, isActive: true } },
      { projectId: 9, name: "Upcoming", title: "Upcoming", folder: "Upcoming", description: "Coming Soon", cell: { left: 320, top: 960, width: 160, height: 208, rotation: -15, zIndex: 50, isActive: true } },
      { projectId: 10, name: "The-Social-Fablab", title: "The Social Fablab", folder: "The-Social-Fablab", description: "Speculative & Brand Design", cell: { left: 640, top: 960, width: 178, height: 96, rotation: 15, zIndex: 50, isActive: true } },
      { projectId: 11, name: "Diversa", title: "Diversa", folder: "Diversa", description: "Strategy & Brand Design", cell: { left: 960, top: 960, width: 160, height: 160, rotation: 30, zIndex: 50, isActive: true } },
    ];
    
    for (const p of projectsToSeed) {
      await ctx.db.insert("projectConfig", {
        projectId: p.projectId,
        name: p.name,
        title: p.title,
        folder: p.folder,
        description: p.description,
        cell: p.cell,
      });
      await ctx.db.insert("projects", {
        name: p.folder,
        title: p.title,
        description: p.description,
      });
    }

    const sampleImages: Record<number, string[]> = {
      1: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
        "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800",
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
      ],
      3: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      ],
      4: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      ],
      5: [
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800",
      ],
      6: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
      ],
      7: [
        "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800",
      ],
      8: [
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
      ],
      10: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      ],
      11: [
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800",
      ],
    };

    for (const [projectId, urls] of Object.entries(sampleImages)) {
      for (let i = 0; i < urls.length; i++) {
        await ctx.db.insert("projectImages", {
          projectId: parseInt(projectId),
          imageUrl: urls[i],
          order: i + 1,
        });
      }
    }

    return { message: "Seeded successfully", count: projectsToSeed.length };
  },
});

export const saveProjectInfo = mutation({
  args: {
    projectId: v.number(),
    title: v.string(),
    description: v.string(),
    folder: v.string(),
    client: v.optional(v.string()),
    category: v.optional(v.string()),
    year: v.optional(v.string()),
    textureTitle: v.optional(v.string()),
    textureText: v.optional(v.string()),
    formTitle: v.optional(v.string()),
    formText: v.optional(v.string()),
    philosophyTitle: v.optional(v.string()),
    philosophyText: v.optional(v.string()),
    dataValue: v.optional(v.string()),
    dataLabel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log('saveProjectInfo called with:', args);
    const existing = await ctx.db.query("projects")
      .filter((q) => q.eq(q.field("name"), args.folder))
      .first();
    
    if (existing) {
      console.log('Updating existing project:', existing._id);
      await ctx.db.patch(existing._id, {
        title: args.title,
        description: args.description,
        name: args.folder,
        client: args.client,
        category: args.category,
        year: args.year,
        textureTitle: args.textureTitle,
        textureText: args.textureText,
        formTitle: args.formTitle,
        formText: args.formText,
        philosophyTitle: args.philosophyTitle,
        philosophyText: args.philosophyText,
        dataValue: args.dataValue,
        dataLabel: args.dataLabel,
      });
    } else {
      console.log('Inserting new project');
      await ctx.db.insert("projects", {
        name: args.folder,
        title: args.title,
        description: args.description,
        category: args.category || "Design",
        year: args.year || "2026",
        client: args.client || args.title,
        textureTitle: args.textureTitle,
        textureText: args.textureText,
        formTitle: args.formTitle,
        formText: args.formText,
        philosophyTitle: args.philosophyTitle,
        philosophyText: args.philosophyText,
        dataValue: args.dataValue,
        dataLabel: args.dataLabel,
      });
    }
    
    return { success: true };
  },
});

export const saveProjectCell = mutation({
  args: {
    projectId: v.number(),
    cellNumber: v.number(),
    left: v.number(),
    top: v.number(),
    width: v.number(),
    height: v.number(),
    rotation: v.number(),
    zIndex: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    console.log('saveProjectCell called with:', args);
    const existing = await ctx.db.query("projectCells")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .first();
    
    if (existing) {
      console.log('Updating existing cell:', existing._id);
      await ctx.db.patch(existing._id, {
        cellNumber: args.cellNumber,
        left: args.left,
        top: args.top,
        width: args.width,
        height: args.height,
        rotation: args.rotation,
        zIndex: args.zIndex,
        isActive: args.isActive,
      });
    } else {
      console.log('Inserting new cell');
      await ctx.db.insert("projectCells", {
        projectId: args.projectId,
        cellNumber: args.cellNumber,
        left: args.left,
        top: args.top,
        width: args.width,
        height: args.height,
        rotation: args.rotation,
        zIndex: args.zIndex,
        isActive: args.isActive,
      });
    }
    
    return { success: true };
  },
});

export const addProjectImage = mutation({
  args: {
    projectId: v.number(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existingImages = await ctx.db.query("projectImages")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .collect();
    
    const maxOrder = existingImages.length > 0 
      ? Math.max(...existingImages.map((img) => img.order)) 
      : 0;
    
    await ctx.db.insert("projectImages", {
      projectId: args.projectId,
      imageUrl: args.imageUrl,
      order: maxOrder + 1,
    });
    
    return { success: true };
  },
});

export const removeProjectImage = mutation({
  args: {
    projectId: v.number(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("projectImages")
      .filter((q) => 
        q.and(
          q.eq(q.field("projectId"), args.projectId),
          q.eq(q.field("imageUrl"), args.imageUrl)
        )
      )
      .first();
    
    if (existing) {
      await ctx.db.delete(existing._id);
    }
    
    return { success: true };
  },
});

export const updateProjectImages = mutation({
  args: {
    projectId: v.number(),
    images: v.array(v.object({
      imageUrl: v.string(),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    console.log('updateProjectImages called with:', args);
    const existingImages = await ctx.db.query("projectImages")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .collect();
    
    console.log('Existing images:', existingImages.length);
    
    for (const img of existingImages) {
      await ctx.db.delete(img._id);
    }
    
    for (const img of args.images) {
      await ctx.db.insert("projectImages", {
        projectId: args.projectId,
        imageUrl: img.imageUrl,
        order: img.order,
      });
    }
    
    return { success: true };
  },
});
