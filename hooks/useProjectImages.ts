"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function useProjectById(projectId: number) {
  return useQuery(api.projects.getProjectById, { projectId });
}

export function useProjectImages(projectId: number) {
  return useQuery(api.projects.getProjectImages, { projectId });
}

export function useListProjects() {
  return useQuery(api.projects.listProjects);
}
