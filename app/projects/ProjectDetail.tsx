'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const ProjectDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const productId = parseInt(id, 10) || 1;
  const convexProject = useQuery(api.projects.getProjectById, { projectId: productId });

  const getFallbackImages = (id: number): string[] => {
    const allFallbacks: Record<number, string[]> = {
      1: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
        "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800",
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
        "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800",
      ],
      2: [
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
      ],
      3: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
        "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800",
      ],
      4: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
      ],
      5: [
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      ],
      6: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
        "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800",
      ],
      7: [
        "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1200",
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
      ],
      8: [
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      ],
      9: [
        "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1200",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      ],
      10: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
      ],
      11: [
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      ],
    };
    return allFallbacks[id] || allFallbacks[1];
  };

  const projectTitle = convexProject?.title || (() => {
    switch (productId) {
      case 1: return "Grillwise";
      case 2: return "Project 2";
      case 3: return "Albed Price list";
      case 4: return "Abaco";
      case 5: return "ApCollective";
      case 6: return "Muso";
      case 7: return "Empathy Design";
      case 8: return "Syform";
      case 9: return "Upcoming";
      case 10: return "The Social Fablab";
      case 11: return "Diversa";
      default: return "Collection 2026";
    }
  })();

  const projectDescription = convexProject?.description || "Portfolio project";
  const projectClient = convexProject?.client || "Orodavid";
  const projectCategory = convexProject?.category || "Design";
  const projectYear = convexProject?.year || "2026";
  const textureTitle = convexProject?.textureTitle || "Texture";
  const textureText = convexProject?.textureText || "Smooth finishes with organic, reactive edges that catch the light.";
  const formTitle = convexProject?.formTitle || "Form";
  const formText = convexProject?.formText || "Minimalist silhouettes designed for stacking and daily use.";
  const philosophyTitle = convexProject?.philosophyTitle || "From old to gold.";
  const philosophyText = convexProject?.philosophyText || "We repurpose traditional techniques for contemporary living. Each piece tells a story of transformation, where raw earth becomes an object of refined beauty.";
  const dataValue = convexProject?.dataValue || "45.8%";
  const dataLabel = convexProject?.dataLabel || "Sustainable Materials";

  const [editableTitle, setEditableTitle] = useState(projectTitle);
  const [projectImages, setProjectImages] = useState<string[]>([]);

  useEffect(() => {
    if (convexProject?.images && convexProject.images.length > 0) {
      setProjectImages(convexProject.images.map((img: any) => img.imageUrl));
    } else {
      setProjectImages(getFallbackImages(productId));
    }
  }, [convexProject, productId]);

  useEffect(() => {
    setEditableTitle(projectTitle);
  }, [projectTitle]);

  const scrollState = useRef({
    target: 0,
    current: 0,
    isScrolling: false
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number | undefined;

    const updateScroll = () => {
      if (window.innerWidth >= 768) {
        const state = scrollState.current;
        const diff = state.target - state.current;
        const delta = diff * 0.08;

        if (Math.abs(diff) > 0.5) {
          state.current += delta;
          container.scrollLeft = state.current;
          animationFrameId = requestAnimationFrame(updateScroll);
          state.isScrolling = true;
        } else {
          state.current = state.target;
          container.scrollLeft = state.current;
          state.isScrolling = false;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth >= 768) {
        e.preventDefault();
        const state = scrollState.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        state.target += e.deltaY * 1.5;
        state.target = Math.max(0, Math.min(state.target, maxScroll));

        if (!state.isScrolling) {
          state.current = container.scrollLeft;
          updateScroll();
        }
      }
    };

    scrollState.current.target = container.scrollLeft;
    scrollState.current.current = container.scrollLeft;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const logoUrl = "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/2e4bb3b0129f32c64a6d4db826afbca6.png";
  const fallbackImages = [
    "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/28eeef3a9cf0871a1a2bee8b7a4d75a0.jpg",
    "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/20aefb5a45a9df8a3655778d16003257.jpg",
    "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/318be5339e647d9619f809f4efe92695.jpg",
    "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/c3482573111cc00bed9df726134b3ffe.jpg",
    "https://horizons-cdn.hostinger.com/38ec5550-5152-446c-bb9a-73388eb1666a/d31e634b326074fc1749aa30d51e5285.jpg"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-screen h-screen bg-white text-[#1E1E1D] overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full p-6 md:p-12 flex justify-between items-start z-50 pointer-events-none">
        <button 
          onClick={() => router.push('/projects')} 
          className="pointer-events-auto p-2 md:p-3 bg-white/80 hover:bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm" 
          aria-label="Back to collection"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div className="pointer-events-auto">
          <button onClick={() => router.push('/projects')} className="focus:outline-none">
            <img alt="Orodavid Logo" className="h-8 md:h-10 w-auto object-contain cursor-pointer" src={logoUrl} />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="w-full h-full flex flex-col md:flex-row overflow-y-auto md:overflow-y-hidden md:overflow-x-auto snap-y snap-mandatory md:snap-none no-scrollbar"
      >
        <div className="w-full md:w-[45vw] lg:w-[40vw] min-h-screen md:h-screen shrink-0 snap-start flex flex-col justify-center p-8 md:p-16 lg:p-20 bg-[#F8F8F7]">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="w-full text-5xl md:text-7xl lg:text-8xl font-light mb-6 md:mb-8 tracking-tight leading-[0.95] text-[#1E1E1D]">
              {editableTitle}
            </h1>

            <div className="text-lg md:text-xl font-light text-gray-600 max-w-md leading-relaxed space-y-4 mb-12">
              <p>{projectDescription}</p>
            </div>
            
            <div className="mt-8 md:mt-16 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex flex-col">
                <div className="flex items-center justify-between py-2 border-b border-[#1E1E1D]/50">
                  <h3 className="text-sm font-normal uppercase tracking-widest text-gray-500">CLIENTE</h3>
                  <span className="text-base font-light text-[#1E1E1D]">{projectClient}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#1E1E1D]/50">
                  <h3 className="text-sm font-normal uppercase tracking-widest text-gray-500">CATEGORIA</h3>
                  <span className="text-base font-light text-[#1E1E1D]">{projectCategory}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <h3 className="text-sm font-normal uppercase tracking-widest text-gray-500">ANNO</h3>
                  <span className="text-base font-light text-[#1E1E1D]">{projectYear}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="w-full md:w-screen h-[60vh] md:h-screen shrink-0 snap-center relative overflow-hidden group">
          <div className="w-full h-full overflow-hidden relative">
            <img 
              className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" 
              alt="Collection Hero" 
              src={projectImages[0] || "https://tcxhdhzcqagieclvmvjm.supabase.co/storage/v1/object/public/product-images/Grillwise-046-Modifica.jpg"} 
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>
        </div>

        <div className="w-full md:w-screen h-auto md:h-screen shrink-0 snap-center grid grid-cols-1 md:grid-cols-2 md:grid-rows-2">
          <div className="relative aspect-square md:aspect-auto border-b md:border-b md:border-r border-white/20">
            <img src={projectImages[1] || fallbackImages[1]} className="w-full h-full object-cover" alt="Detail view" />
          </div>
          <div className="relative aspect-square md:aspect-auto border-b md:border-white/20 bg-[#EBEBE9] flex items-center justify-center p-12">
            <div className="max-w-xs text-center">
              <h3 className="text-3xl font-light mb-4">{textureTitle}</h3>
              <p className="text-gray-500 leading-relaxed">{textureText}</p>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-auto border-b md:border-b-0 md:border-r border-white/20 bg-[#1E1E1D] text-white flex items-center justify-center p-12">
            <div className="max-w-xs text-center">
              <h3 className="text-3xl font-400 mb-4">{formTitle}</h3>
              <p className="text-gray-400 leading-relaxed">{formText}</p>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-auto">
            <img src={projectImages[4] || fallbackImages[4]} className="w-full h-full object-cover" alt="Collage detail" />
          </div>
        </div>

        <div className="w-full md:w-[70vw] h-auto md:h-screen shrink-0 snap-center flex flex-col md:flex-row bg-white">
          <div className="w-full md:w-1/2 h-[50vh] md:h-full relative">
            <img src={projectImages[3] || fallbackImages[3]} className="w-full h-full object-cover" alt="Books stack" />
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-20">
            <div className="max-w-md">
              <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 block">Philosophy</span>
              <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight">{philosophyTitle}</h2>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {philosophyText}
              </p>
              <button className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest hover:text-gray-600 transition-colors">
                Read the story
                <span className="block w-8 h-[1px] bg-black group-hover:bg-gray-600 transition-colors"></span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[60vw] h-[50vh] md:h-screen shrink-0 snap-center bg-black relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-80">
            <img src={projectImages[2] || fallbackImages[2]} className="w-full h-full object-cover grayscale opacity-70" alt="Data visualization" />
          </div>
          <div className="relative z-10 text-center text-white p-8">
            <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-4">{dataValue}</h2>
            <p className="text-xl font-light tracking-wide text-gray-300">{dataLabel}</p>
          </div>
        </div>

        <div className="w-full md:w-screen h-[80vh] md:h-screen shrink-0 snap-center relative">
          <img src={projectImages[1] || "https://tcxhdhzcqagieclvmvjm.supabase.co/storage/v1/object/public/product-images/Grillwise-046-Modifica.jpg"} className="w-full h-full object-cover" alt="Collection End" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
