'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { Plus, X, Trash2 } from 'lucide-react';

export default function AdminProjects() {
  const router = useRouter();
  const projects = useQuery(api.projects.listProjects);
  const createProject = useMutation(api.projects.createProject);
  const deleteProject = useMutation(api.projects.deleteProject);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    title: '',
    folder: '',
    description: '',
    projectType: 'normal' as 'normal' | 'text',
    textContent: '',
  });

  if (projects === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading projects...</div>
      </div>
    );
  }

  const handleCreateProject = async () => {
    if (newProject.projectType === 'normal' && (!newProject.title || !newProject.folder)) {
      alert('Please fill in title and folder');
      return;
    }
    if (newProject.projectType === 'text' && !newProject.textContent.trim()) {
      alert('Please enter text content for text projects');
      return;
    }
    
    setIsCreating(true);
    try {
      const result = await createProject({
        name: newProject.projectType === 'normal' ? (newProject.name || newProject.title) : undefined,
        title: newProject.projectType === 'normal' ? newProject.title : undefined,
        folder: newProject.projectType === 'normal' ? newProject.folder : undefined,
        description: newProject.projectType === 'normal' ? newProject.description : undefined,
        projectType: newProject.projectType,
        textContent: newProject.projectType === 'text' ? newProject.textContent : undefined,
      });
      console.log('Created project:', result);
      setShowModal(false);
      setNewProject({
        name: '',
        title: '',
        folder: '',
        description: '',
        projectType: 'normal',
        textContent: '',
      });
      router.refresh();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: number, title: string) => {
    const confirmed = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingProjectId(projectId);
    try {
      await deleteProject({ projectId });
      router.refresh();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    } finally {
      setDeletingProjectId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Project
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2A2A2A] rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Create New Project</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-2">Project Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewProject(prev => ({ ...prev, projectType: 'normal' }))}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                      newProject.projectType === 'normal'
                        ? 'bg-white text-black border-white'
                        : 'bg-[#1E1E1D] text-white border-gray-700'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewProject(prev => ({ ...prev, projectType: 'text' }))}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                      newProject.projectType === 'text'
                        ? 'bg-white text-black border-white'
                        : 'bg-[#1E1E1D] text-white border-gray-700'
                    }`}
                  >
                    Text
                  </button>
                </div>
              </div>

              {newProject.projectType === 'normal' ? (
                <>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Title *</label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Project Title"
                      className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Folder *</label>
                    <input
                      type="text"
                      value={newProject.folder}
                      onChange={(e) => setNewProject(prev => ({ ...prev, folder: e.target.value }))}
                      placeholder="project-name"
                      className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Description</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Project description"
                      rows={2}
                      className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600 resize-none"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Text Content *</label>
                  <textarea
                    value={newProject.textContent}
                    onChange={(e) => setNewProject(prev => ({ ...prev, textContent: e.target.value }))}
                    placeholder="Enter the text that should appear on the canvas"
                    rows={4}
                    className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600 resize-none"
                  />
                </div>
              )}

              <p className="text-xs text-gray-500">
                Cell properties (size, rotation, position) can be edited after creating the project.
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={isCreating}
                  className="flex-1 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <div
            key={project.id}
            onClick={() => router.push(`/TuSaiChi/projects/${project.id}`)}
            className={`rounded-xl overflow-hidden border hover:scale-[1.02] transition-all cursor-pointer ${
              project.cell?.isActive 
                ? 'border-gray-800 hover:border-gray-700' 
                : 'border-red-900/50 opacity-60'
            }`}
          >
            <div className="aspect-square relative bg-gray-900 overflow-hidden">
              {project.projectType === 'text' ? (
                <div className="w-full h-full flex items-center justify-center p-4 text-center text-white text-sm leading-relaxed">
                  {project.textContent || 'Text project'}
                </div>
              ) : project.images && project.images.length > 0 ? (
                <img
                  src={project.images[0]?.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  No image
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs">
                Cell {project.id}
              </div>
              <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                project.cell?.isActive 
                  ? 'bg-green-600/80 text-white' 
                  : 'bg-red-600/80 text-white'
              }`}>
                {project.cell?.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-medium text-white">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#1E1E1D] rounded p-2">
                  <span className="text-gray-500 block">Dimensions</span>
                  <span className="text-white">
                    {project.cell?.width} × {project.cell?.height}
                  </span>
                </div>
                <div className="bg-[#1E1E1D] rounded p-2">
                  <span className="text-gray-500 block">Rotation</span>
                  <span className="text-white">{project.cell?.rotation}°</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800">
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-500">Images</span>
                    <span className="text-white">{project.images?.length || 0}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id, project.title || `Project ${project.id}`);
                    }}
                    disabled={deletingProjectId === project.id}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 bg-red-700/80 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deletingProjectId === project.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
