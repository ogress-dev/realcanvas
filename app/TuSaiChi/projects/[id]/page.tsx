'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserButton } from '@clerk/nextjs';
import { ArrowLeft, Plus, Trash2, Save, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

const PROJECT_MAPPING: Record<number, { name: string; title: string; folder: string; description: string; cell: { projectName: string; left: number; top: number; width: number; height: number; rotation: number; zIndex: number; isActive: boolean } }> = {
   1: { name: "Grillwise", title: "Grillwise", folder: "Grillwise", description: "Brand & Web Design", cell: { projectName: "Project 1", left: 656, top: 720, width: 288, height: 160, rotation: 0, zIndex: 50, isActive: true } },
   2: { name: "Project-2", title: "Project 2", folder: "Project-2", description: "Project 2", cell: { projectName: "Project 2", left: 1072, top: 752, width: 96, height: 96, rotation: 0, zIndex: 50, isActive: true } },
   3: { name: "Albed-Price-list", title: "Albed Price list", folder: "Albed-Price-list", description: "Strategy & Editorial Design", cell: { projectName: "Project 3", left: 985, top: 345, width: 270, height: 270, rotation: 0, zIndex: 50, isActive: true } },
   4: { name: "Abaco", title: "Abaco", folder: "Abaco", description: "Product Design", cell: { projectName: "Project 4", left: 715, top: 395, width: 170, height: 170, rotation: 0, zIndex: 50, isActive: true } },
   5: { name: "ApCollective", title: "ApCollective", folder: "ApCollective", description: "Portfolio", cell: { projectName: "Project 5", left: 420, top: 395, width: 120, height: 170, rotation: 0, zIndex: 50, isActive: true } },
   6: { name: "Muso", title: "Muso", folder: "Muso", description: "Brand, Strategy, Web & Product Design", cell: { projectName: "Project 6", left: 25, top: 345, width: 270, height: 270, rotation: 0, zIndex: 50, isActive: true } },
   7: { name: "Empathy-Design", title: "Empathy Design", folder: "Empathy-Design", description: "Logo & Set Design", cell: { projectName: "Project 7", left: -240, top: 720, width: 160, height: 160, rotation: 0, zIndex: 50, isActive: true } },
   8: { name: "Syform", title: "Syform", folder: "Syform", description: "Set & Graphic Design", cell: { projectName: "Project 8", left: 80, top: 1040, width: 160, height: 160, rotation: 0, zIndex: 50, isActive: true } },
   9: { name: "Upcoming", title: "Upcoming", folder: "Upcoming", description: "Coming Soon", cell: { projectName: "Project 9", left: 400, top: 1016, width: 160, height: 208, rotation: 0, zIndex: 50, isActive: true } },
   10: { name: "The-Social-Fablab", title: "The Social Fablab", folder: "The-Social-Fablab", description: "Speculative & Brand Design", cell: { projectName: "Project 10", left: 711, top: 1072, width: 178, height: 96, rotation: 0, zIndex: 50, isActive: true } },
   11: { name: "Diversa", title: "Diversa", folder: "Diversa", description: "Strategy & Brand Design", cell: { projectName: "Project 11", left: 1040, top: 1040, width: 160, height: 160, rotation: 0, zIndex: 50, isActive: true } },
};

const DEFAULT_CELL = PROJECT_MAPPING[1]?.cell || { projectName: "Project 1", left: 0, top: 0, width: 100, height: 100, rotation: 0, zIndex: 50, isActive: true };

interface CellProperties {
  projectName: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  isActive: boolean;
}

interface ProjectImage {
  storageId?: string;
  imageUrl: string;
  order: number;
  isNew?: boolean;
  file?: File;
  isCover?: boolean;
}

const DEFAULT_PROJECT = {
  title: '',
  description: '',
  folder: '',
  cell: { projectName: "New Project", left: 0, top: 0, width: 100, height: 100, rotation: 0, zIndex: 50, isActive: true },
  images: [] as ProjectImage[]
};

export default function AdminProjectDetail() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.id as string);
  
  const convexProject = useQuery(api.projects.getProjectById, { projectId });
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const uploadImage = useMutation(api.projects.uploadImage);
  const uploadCoverImage = useMutation(api.projects.uploadCoverImage);
  const setImageAsCover = useMutation(api.projects.setImageAsCover);
  const saveProjectInfo = useMutation(api.projects.saveProjectInfo);
  const saveProjectCell = useMutation(api.projects.saveProjectCell);
  const updateProjectImages = useMutation(api.projects.updateProjectImages);
  
  const [cell, setCell] = useState<CellProperties>(DEFAULT_CELL);
  const [projectInfo, setProjectInfo] = useState({
    title: '',
    description: '',
    folder: '',
    client: '',
    category: '',
    year: '',
    textureTitle: '',
    textureText: '',
    formTitle: '',
    formText: '',
    philosophyTitle: '',
    philosophyText: '',
    dataValue: '',
    dataLabel: '',
  });
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [pendingCoverImage, setPendingCoverImage] = useState<File | null>(null);
  const [pendingCoverImagePreview, setPendingCoverImagePreview] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const sections = ['Cell Properties', 'Project Info', 'Content Sections'];
  const minSwipeDistance = 50;

  useEffect(() => {
    const defaultProject = PROJECT_MAPPING[projectId];
    if (convexProject !== undefined) {
      setCell(convexProject?.cell || defaultProject?.cell || DEFAULT_CELL);
      setProjectInfo({
        title: convexProject?.title || defaultProject?.title || '',
        description: convexProject?.description || defaultProject?.description || '',
        folder: convexProject?.folder || defaultProject?.folder || '',
        client: convexProject?.client || '',
        category: convexProject?.category || '',
        year: convexProject?.year || '',
        textureTitle: convexProject?.textureTitle || '',
        textureText: convexProject?.textureText || '',
        formTitle: convexProject?.formTitle || '',
        formText: convexProject?.formText || '',
        philosophyTitle: convexProject?.philosophyTitle || '',
        philosophyText: convexProject?.philosophyText || '',
        dataValue: convexProject?.dataValue || '',
        dataLabel: convexProject?.dataLabel || '',
      });
      setImages((convexProject?.images || []).map((img: any) => ({
        storageId: img.storageId,
        imageUrl: img.imageUrl,
        order: img.order || 1,
        isNew: false,
        isCover: img.isCover || false,
      })));
      setCoverImage(convexProject?.coverImage || null);
      setIsLoading(false);
    }
  }, [convexProject, projectId, refreshKey]);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const nextSection = () => {
    setCurrentSection(prev => (prev + 1) % sections.length);
  };

  const prevSection = () => {
    setCurrentSection(prev => (prev - 1 + sections.length) % sections.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSection();
    } else if (isRightSwipe) {
      prevSection();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1E1D] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!convexProject && projectId > 0) {
    return (
      <div className="min-h-screen bg-[#1E1E1D] text-white flex items-center justify-center">
        <div>Project not found</div>
      </div>
    );
  }

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, { imageUrl: newImageUrl.trim(), order: prev.length + 1, isNew: false }]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
      setPendingImages(prev => [...prev, ...newFiles]);
      newFiles.forEach((file) => {
        const objectUrl = URL.createObjectURL(file);
        setImages(prev => [...prev, { imageUrl: objectUrl, order: prev.length + 1, isNew: true, file }]);
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPendingCoverImage(file);
      setPendingCoverImagePreview(objectUrl);
    }
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = '';
    }
  };

  const handleSetAsCover = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isCover: i === index,
    })));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddImage();
    }
  };

  const handleSave = async () => {
    if (!projectInfo.folder) {
      alert('Please enter a folder name');
      return;
    }
    
    setIsSaving(true);
    try {
      if (pendingCoverImage) {
        console.log('Uploading cover image to Convex...');
        const uploadUrl = await generateUploadUrl();
        const coverResult = await fetch(uploadUrl, {
          method: 'POST',
          body: pendingCoverImage,
          headers: { 'Content-Type': pendingCoverImage.type },
        });
        if (!coverResult.ok) {
          throw new Error('Failed to upload cover image');
        }
        const { storageId } = await coverResult.json();
        console.log('Cover image uploaded, storageId:', storageId);
        
        await uploadCoverImage({
          projectId,
          storageId,
        });
        console.log('Cover image saved to database');
      }
      
      for (const img of images) {
        if (img.isNew && img.file) {
          console.log('Uploading image to Convex:', img.file.name);
          const uploadUrl = await generateUploadUrl();
          const imageResult = await fetch(uploadUrl, {
            method: 'POST',
            body: img.file,
            headers: { 'Content-Type': img.file.type },
          });
          if (!imageResult.ok) {
            throw new Error('Failed to upload image');
          }
          const { storageId } = await imageResult.json();
          console.log('Image uploaded, storageId:', storageId);
          
          await uploadImage({
            projectId,
            storageId,
            order: img.order,
          });
          console.log('Image saved to database');
        }
      }
      
      const allImages = images.filter(img => !img.isNew).map((img, idx) => ({
        imageUrl: img.imageUrl,
        order: idx + 1
      }));
      
      console.log('Saving project info:', { projectId, ...projectInfo });
      const infoResult = await saveProjectInfo({
        projectId,
        title: projectInfo.title,
        description: projectInfo.description,
        folder: projectInfo.folder,
        client: projectInfo.client || undefined,
        category: projectInfo.category || undefined,
        year: projectInfo.year || undefined,
        textureTitle: projectInfo.textureTitle || undefined,
        textureText: projectInfo.textureText || undefined,
        formTitle: projectInfo.formTitle || undefined,
        formText: projectInfo.formText || undefined,
        philosophyTitle: projectInfo.philosophyTitle || undefined,
        philosophyText: projectInfo.philosophyText || undefined,
        dataValue: projectInfo.dataValue || undefined,
        dataLabel: projectInfo.dataLabel || undefined,
      });
      console.log('Info result:', infoResult);
      
      console.log('Saving cell:', { projectId, projectName: cell.projectName, isActive: cell.isActive });
       const cellResult = await saveProjectCell({
         projectId,
         projectName: cell.projectName,
         isActive: cell.isActive,
       });
       console.log('Cell result:', cellResult);
      
      if (allImages.length > 0) {
        console.log('Saving existing images:', { projectId, images: allImages });
        const imageResult = await updateProjectImages({
          projectId,
          images: allImages,
        });
        console.log('Image result:', imageResult);
      }
      
      setPendingImages([]);
      setPendingCoverImage(null);
      setPendingCoverImagePreview(null);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        refreshData();
      }, 1000);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving: ' + error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCellChange = (field: keyof CellProperties, value: number | boolean) => {
    setCell(prev => ({ ...prev, [field]: value }));
  };

  const handleProjectInfoChange = (field: keyof typeof projectInfo, value: string) => {
    setProjectInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#1E1E1D] text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/TuSaiChi')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight">
                {projectInfo.title || 'New Project'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-green-500 text-sm">Saved to Convex!</span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <UserButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-medium mb-4">Images ({images.length})</h2>
              
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter image URL..."
                  className="flex-1 bg-[#2A2A2A] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
                />
                <button
                  onClick={handleAddImage}
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>

              {images.length === 0 ? (
                <div className="bg-[#2A2A2A] rounded-xl p-12 text-center border border-gray-800 border-dashed">
                  <p className="text-gray-500">No images yet. Add one above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="group relative aspect-square bg-[#2A2A2A] rounded-xl overflow-hidden border border-gray-800">
                      <img
                        src={img.imageUrl}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleSetAsCover(index)}
                          className={`p-2 rounded-lg transition-colors ${img.isCover ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                          title="Set as Cover"
                        >
                          <span className="text-xs font-medium">Cover</span>
                        </button>
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs">
                        #{index + 1}
                      </div>
                      {img.isCover && (
                        <div className="absolute top-2 right-2 bg-green-600 px-2 py-1 rounded text-xs">
                          Cover
                        </div>
                      )}
                      {img.isNew && (
                        <div className="absolute bottom-2 right-2 bg-blue-600 px-2 py-1 rounded text-xs">
                          New
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#2A2A2A] rounded-xl p-4 md:p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSection}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-medium">{sections[currentSection]}</h3>
                  <button
                    onClick={nextSection}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  {sections.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSection(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentSection ? 'bg-white' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div 
                ref={carouselRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="touch-pan-y"
              >
                {currentSection === 0 && (
                   <div className="space-y-4">
                     <div className="bg-[#1E1E1D] rounded-lg border border-gray-700 p-4">
                       <h4 className="text-sm text-gray-500 mb-3">Cell Assignment</h4>
                       <div className="space-y-2">
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-400">Cell Name:</span>
                           <span className="text-sm text-white font-medium">{cell.projectName}</span>
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-400">Position:</span>
                           <span className="text-sm text-white font-medium">({cell.left}, {cell.top})</span>
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-400">Image Size:</span>
                           <span className="text-sm text-white font-medium">{cell.width} × {cell.height}px</span>
                         </div>
                       </div>
                       <p className="text-xs text-gray-600 mt-3 border-t border-gray-700 pt-3">
                         Cell properties are locked. Edit image dimensions in the form fields below if needed.
                       </p>
                     </div>
                     
                     <div className="space-y-2">
                       <label className="text-sm text-gray-500 block">Image Width (px)</label>
                       <input
                         type="number"
                         value={cell.width}
                         onChange={(e) => handleCellChange('width', parseInt(e.target.value) || 0)}
                         className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm text-gray-500 block">Image Height (px)</label>
                       <input
                         type="number"
                         value={cell.height}
                         onChange={(e) => handleCellChange('height', parseInt(e.target.value) || 0)}
                         className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                       />
                     </div>
                     <div className="flex items-center justify-between p-4 bg-[#1E1E1D] rounded-lg border border-gray-700">
                       <div>
                         <label className="text-sm text-gray-500 block">Active</label>
                         <p className="text-xs text-gray-600">Project is clickable on site</p>
                       </div>
                       <button
                         type="button"
                         onClick={() => handleCellChange('isActive', !cell.isActive)}
                         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                           cell.isActive ? 'bg-green-600' : 'bg-red-600'
                         }`}
                       >
                         <span
                           className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                             cell.isActive ? 'translate-x-6' : 'translate-x-1'
                           }`}
                         />
                       </button>
                     </div>
                   </div>
                 )}

                {currentSection === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Cover Image</label>
                      <div className="flex gap-4 items-start">
                        <div className="w-24 h-24 bg-[#1E1E1D] rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                          {pendingCoverImagePreview || coverImage ? (
                            <img src={pendingCoverImagePreview || coverImage || ''} alt="Cover" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No image</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            ref={coverImageInputRef}
                            onChange={handleCoverImageUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => coverImageInputRef.current?.click()}
                            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Cover
                          </button>
                          <p className="text-xs text-gray-500 mt-2">This image appears in the projects grid</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Title</label>
                      <input
                        type="text"
                        value={projectInfo.title}
                        onChange={(e) => handleProjectInfoChange('title', e.target.value)}
                        className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Description</label>
                      <textarea
                        value={projectInfo.description}
                        onChange={(e) => handleProjectInfoChange('description', e.target.value)}
                        rows={3}
                        className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Folder</label>
                      <input
                        type="text"
                        value={projectInfo.folder}
                        onChange={(e) => handleProjectInfoChange('folder', e.target.value)}
                        className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">Cliente</label>
                        <input
                          type="text"
                          value={projectInfo.client}
                          onChange={(e) => handleProjectInfoChange('client', e.target.value)}
                          placeholder="Client name"
                          className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">Categoria</label>
                        <input
                          type="text"
                          value={projectInfo.category}
                          onChange={(e) => handleProjectInfoChange('category', e.target.value)}
                          placeholder="Design"
                          className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">Anno</label>
                        <input
                          type="text"
                          value={projectInfo.year}
                          onChange={(e) => handleProjectInfoChange('year', e.target.value)}
                          placeholder="2026"
                          className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentSection === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Texture Title</label>
                      <input
                        type="text"
                        value={projectInfo.textureTitle}
                        onChange={(e) => handleProjectInfoChange('textureTitle', e.target.value)}
                        placeholder="Texture"
                        className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600 mb-2"
                      />
                      <label className="text-sm text-gray-500 block mb-1">Texture Text</label>
                      <textarea
                        value={projectInfo.textureText}
                        onChange={(e) => handleProjectInfoChange('textureText', e.target.value)}
                        placeholder="Smooth finishes with organic, reactive edges that catch the light."
                        rows={2}
                        className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Form Title</label>
                      <input
                        type="text"
                        value={projectInfo.formTitle}
                        onChange={(e) => handleProjectInfoChange('formTitle', e.target.value)}
                        placeholder="Form"
                        className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600 mb-2"
                      />
                      <label className="text-sm text-gray-500 block mb-1">Form Text</label>
                      <textarea
                        value={projectInfo.formText}
                        onChange={(e) => handleProjectInfoChange('formText', e.target.value)}
                        placeholder="Minimalist silhouettes designed for stacking and daily use."
                        rows={2}
                        className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Philosophy Title</label>
                      <input
                        type="text"
                        value={projectInfo.philosophyTitle}
                        onChange={(e) => handleProjectInfoChange('philosophyTitle', e.target.value)}
                        placeholder="From old to gold."
                        className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600 mb-2"
                      />
                      <label className="text-sm text-gray-500 block mb-1">Philosophy Text</label>
                      <textarea
                        value={projectInfo.philosophyText}
                        onChange={(e) => handleProjectInfoChange('philosophyText', e.target.value)}
                        placeholder="We repurpose traditional techniques for contemporary living. Each piece tells a story of transformation..."
                        rows={3}
                        className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">Data Value</label>
                        <input
                          type="text"
                          value={projectInfo.dataValue}
                          onChange={(e) => handleProjectInfoChange('dataValue', e.target.value)}
                          placeholder="45.8%"
                          className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">Data Label</label>
                        <input
                          type="text"
                          value={projectInfo.dataLabel}
                          onChange={(e) => handleProjectInfoChange('dataLabel', e.target.value)}
                          placeholder="Sustainable Materials"
                          className="w-full bg-[#1E1E1D] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-4 text-center md:hidden">
                Swipe left or right to navigate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
