'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useProjects() {
  const projects = useQuery(api.projects.listProjects);
  return projects;
}

export function useProject(projectId: number) {
  const project = useQuery(api.projects.getProjectById, { projectId });
  return project;
}
