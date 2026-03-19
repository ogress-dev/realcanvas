'use client';

  import { useState, useRef, useEffect } from 'react';
  import { motion, useMotionValue, animate } from 'framer-motion';
  import { Move } from 'lucide-react';
  import { useRouter } from 'next/navigation';
  import Logo from '@/components/Logo';
  import { useQuery } from 'convex/react';
  import { api } from '@/convex/_generated/api';

  const fallbackImages: Record<number, string> = {
    1: '/images/grillwise.jpg',
    2: '/images/checked.png',
    3: '/images/albed.jpg',
    4: '/images/abaco.jpg',
    5: '/images/apcollective.png',
    6: '/images/muso.jpg',
    7: '/images/checked.png',
    8: '/images/checked.png',
    9: '/images/checked.png',
    10: '/images/fablab.jpg',
    11: '/images/checked.png',
  };

  const HexagonInfoIcon = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2L20.66 7L20.66 17L12 22L3.34 17L3.34 7Z" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );

  interface ProjectCellProps {
    project: any;
    router: any;
    isActive: boolean;
  }

  const ProjectCell = ({ project, router, isActive }: ProjectCellProps) => {
    const cell = project.cell || { left: 0, top: 0, width: 200, height: 200, rotation: 0 };
    const title = project.title || 'Untitled';
    const description = project.description || '';
    const coverImage = project.coverImage || fallbackImages[project.id] || '/images/checked.png';

    const cellStyle = {
      rotate: cell.rotation || 0,
      width: `${cell.width}px`,
      height: `${cell.height}px`,
    };

    const handleClick = () => {
      if (!isActive) return;
      router.push(`/projects/${project.id}`);
    };

    return (
      <motion.div
        drag={false}
        whileHover={{
          scale: 1.05,
          zIndex: 50,
          rotate: cell.rotation || 0
        }}
        onTap={handleClick}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={cellStyle}
        className={`cursor-pointer group ${!isActive ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <div
          className="relative rounded-[16px] overflow-hidden shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
          style={{ width: '100%', height: '100%' }}
        >
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
          >
            <span className="text-xs font-medium tracking-wide">View Product</span>
          </motion.div>
        </div>
        <div className="mt-3 pointer-events-none hidden sm:block">
          <h3 className="text-[14px] font-bold text-black">{title}</h3>
          <p className="text-[12px] text-black text-left mt-1">{description}</p>
        </div>
      </motion.div>
    );
  };

  const Hero = () => {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const aboutButtonRef = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const convexProjects = useQuery(api.projects.listProjects);

    const activeProjectIds = convexProjects?.filter((p: any) => p.cell?.isActive !== false).map((p: any) => p.id) || [];

    const getCellStyle = (id: number) => {
      const project = convexProjects?.find((p: any) => p.id === id);
      const cell = project?.cell;
      if (!cell) return { left: '0px', top: '0px', width: '200px', height: '200px', rotate: 0 };
      return {
        left: `${cell.left}px`,
        top: `${cell.top}px`,
        width: `${cell.width}px`,
        height: `${cell.height}px`,
        rotate: cell.rotation || 0,
      };
    };

    const getProjectImage = (id: number) => {
      const project = convexProjects?.find((p: any) => p.id === id);
      if (project?.coverImage) return project.coverImage;
      return fallbackImages[id] || '/images/checked.png';
    };

    const getProjectInfo = (id: number) => {
      const project = convexProjects?.find((p: any) => p.id === id);
      return {
        title: project?.title || '',
        description: project?.description || '',
      };
    };

    const [dragConstraints, setDragConstraints] = useState({
      left: -3500,
      right: 3500,
      top: -1280,
      bottom: 1280
    });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const updateDragConstraints = () => {
        setDragConstraints({
          left: -Math.max(1000, Math.abs(1920 - window.innerWidth) * 3.5),
          right: Math.max(1000, Math.abs(1920 - window.innerWidth) * 3.5),
          top: -Math.max(300, Math.abs(1603 - window.innerHeight) * 0.8),
          bottom: Math.max(300, Math.abs(1603 - window.innerHeight) * 0.8)
        });
        setIsMobile(window.innerWidth < 768);
      };

      updateDragConstraints();
      window.addEventListener('resize', updateDragConstraints);
      return () => window.removeEventListener('resize', updateDragConstraints);
    }, []);

    useEffect(() => {
      const centerOffset = (window.innerWidth / 2) - 800;
      x.set(centerOffset);
    }, []);

    const [isExpandingAbout, setIsExpandingAbout] = useState(false);
    const [aboutButtonRect, setAboutButtonRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const lastTap = useRef(0);

    const handleAboutClick = () => {
      if (aboutButtonRef.current) {
        const rect = aboutButtonRef.current.getBoundingClientRect();
        setAboutButtonRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
        setIsExpandingAbout(true);
        setTimeout(() => {
          router.push('/projects/about');
        }, 600);
      } else {
        router.push('/about');
      }
    };

    const handleResetView = () => {
      animate(x, 0, {
        duration: 0.5,
        ease: "easeInOut"
      });
      animate(y, 0, {
        duration: 0.5,
        ease: "easeInOut"
      });
    };

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const canvasWidth = 2240;
      const canvasHeight = 1603;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const horizontalBoundaryFactor = 3.5;
      const verticalBoundaryFactor = 0.8;

      const maxScrollX = Math.max(1000, Math.abs(canvasWidth - viewportWidth) * horizontalBoundaryFactor);
      const maxScrollY = Math.max(300, Math.abs(canvasHeight - viewportHeight) * verticalBoundaryFactor);

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const currentX = x.get();
        const currentY = y.get();
        const scrollSpeed = 1.5;

        if (e.shiftKey) {
          const newX = currentX - e.deltaY * scrollSpeed;
          const clampedX = Math.max(-maxScrollX, Math.min(maxScrollX, newX));
          x.set(clampedX);
        } else {
          const newY = currentY - e.deltaY * scrollSpeed;
          const clampedY = Math.max(-maxScrollY, Math.min(maxScrollY, newY));
          y.set(clampedY);

          if (e.deltaX !== 0) {
            const newX = currentX - e.deltaX * scrollSpeed;
            const clampedX = Math.max(-maxScrollX, Math.min(maxScrollX, newX));
            x.set(clampedX);
          }
        }
      };

      container.addEventListener('wheel', onWheel, {
        passive: false
      });

      return () => container.removeEventListener('wheel', onWheel);
    }, [x, y]);

    const handleTouchStart = (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        const now = Date.now();
        if (now - lastTap.current < 300) {
          handleResetView();
        }
        lastTap.current = now;
      }
    };

    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={isExpandingAbout ? { opacity: 1 } : { opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
        className="relative w-screen h-screen overflow-hidden bg-[#FFFFFF]"
      >
        {isExpandingAbout && aboutButtonRect && (
          <motion.div
            initial={{
              position: 'fixed',
              top: aboutButtonRect.top,
              left: aboutButtonRect.left,
              width: aboutButtonRect.width,
              height: aboutButtonRect.height,
              borderRadius: '12px',
              backgroundColor: '#1E1E1D',
              zIndex: 100
            }}
            animate={{
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: '0px'
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
          />
        )}

        <div className="absolute top-0 left-0 right-0 z-50 px-6 md:px-12 pt-6 md:pt-8 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto cursor-pointer">
            <Logo />
          </div>
          <div className="flex items-center gap-2 text-[#888] select-none pointer-events-auto hidden sm:flex">
            <Move className="w-4 h-4" />
            <span className="text-sm font-light tracking-wide">Drag to explore</span>
          </div>
        </div>

        <motion.div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onDoubleClick={handleResetView}
        >
          <motion.div
            drag
            dragConstraints={dragConstraints}
            dragElastic={0.05}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20, power: 0.2 }}
            style={{
              width: '2240px',
              height: '1603px',
              x,
              y,
              backgroundImage: `
                linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '320px 320px',
              backgroundPosition: '320px 0px'
            }}
            className="relative"
          >
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '-320px',
                 top: '0px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">20</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '0px',
                 top: '0px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">19</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '320px',
                 top: '0px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">18</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '640px',
                 top: '0px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">17</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '960px',
                 top: '0px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">16</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '1280px',
                 top: '0px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">15</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '1600px',
                 top: '0px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">34</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '-320px',
                 top: '320px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">21</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '1600px',
                 top: '320px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">33</span>
             </div>
              <div
               className="absolute flex items-start md:items-center justify-center pt-6 md:pt-0 bg-blue-100"
               style={{
                 left: '320px',
                 top: '320px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">5</span>
             </div>
            <div
              className="absolute flex items-start md:items-center justify-center pt-6 md:pt-0"
              style={{
                left: '640px',
                top: '320px',
                width: '320px',
                height: '320px',
                zIndex: 100
              }}
            >
              <span className="text-black text-4xl font-bold absolute top-4 left-4">4</span>
            </div>
            <div
              className="absolute flex items-start md:items-center justify-center pt-6 md:pt-0"
              style={{
                left: '960px',
                top: '320px',
                width: '320px',
                height: '320px',
                zIndex: 100
              }}
            >
              <span className="text-black text-4xl font-bold absolute top-4 left-4">3</span>
            </div>
            <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '1280px',
                 top: '320px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">14</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '1280px',
                 top: '320px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">14</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: isMobile ? '0px' : '-480px',
                 top: '640px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">22</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: isMobile ? '0px' : '-160px',
                 top: '640px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">7</span>
             </div>
             <div
               className="absolute flex items-end md:items-center justify-center pb-6 md:pb-0"
               style={{
                 left: isMobile ? '640px' : '800px',
                 top: isMobile ? '740px' : '640px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">1</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: isMobile ? '960px' : '1120px',
                 top: '640px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">2</span>
             </div>
             <div
               className="absolute md:hidden"
               style={{
                 left: '1280px',
                 top: '640px',
                 width: '320px',
                 height: '320px'
               }}
             />
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '1440px',
                 top: '640px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">13</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '1760px',
                 top: '640px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">32</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '-320px',
                 top: '960px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">23</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '0px',
                 top: '960px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">8</span>
             </div>
             <div
               className="absolute flex items-end md:items-center justify-center pb-6 md:pb-0"
               style={{
                 left: '320px',
                 top: '960px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">9</span>
             </div>
             <div
               className="absolute flex items-end md:items-center justify-center pb-6 md:pb-0"
               style={{
                 left: '640px',
                 top: '960px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">10</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '960px',
                 top: '960px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">11</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '1280px',
                 top: '960px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">12</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '1600px',
                 top: '960px',
                 width: '320px',
                 height: '320px',
                 zIndex: 1
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">31</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '-320px',
                 top: '1280px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">24</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '0px',
                 top: '1280px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">25</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '320px',
                 top: '1280px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">26</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '640px',
                 top: '1280px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">27</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '960px',
                 top: '1280px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-white text-4xl font-bold absolute top-4 left-4">28</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '1280px',
                 top: '1280px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">29</span>
             </div>
             <div
               className="absolute flex items-center justify-center"
               style={{
                 left: '1600px',
                 top: '1280px',
                 width: '320px',
                 height: '320px',
                 zIndex: 100
               }}
             >
               <span className="text-black text-4xl font-bold absolute top-4 left-4">30</span>
             </div>
             <div
               className="absolute flex items-start md:items-center justify-start md:justify-center pl-6 md:pl-0 pt-6 md:pt-0"
               style={{
                 left: isMobile ? '640px' : '160px',
                 top: '640px',
                 width: '320px',
                 height: isMobile ? '100px' : '320px',
                 zIndex: 100
               }}
             >
              <motion.div
                drag={false}
                whileHover={{
                  scale: 1.05,
                  zIndex: 50,
                  rotate: -15
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                  rotate: -15,
                  width: isMobile ? '96px' : '140px',
                  height: isMobile ? '96px' : '140px'
                }}
                className="group"
              >
                <div
                  className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 flex items-center justify-center"
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <img src="/home.jpg" alt="Home" className="w-full h-full object-cover" />
                </div>
              </motion.div>
            </div>
             <div
               className="absolute flex items-start md:items-center justify-end md:justify-start pr-6 md:pr-0 md:pl-6 md:pt-0"
               style={{
                 left: isMobile ? '320px' : '480px',
                 top: '640px',
                 width: '320px',
                 height: isMobile ? '420px' : '320px',
                 zIndex: 100
               }}
             >
              <p className="text-black text-[21px] md:text-[18px] leading-relaxed font-bold w-[147px] md:w-auto">
                Lorem ipsum dolor sit amet <br />consectetur adipiscing elit Ut et <br />massa mi. Aliquam in hendrerit <br />urna. Pellentesque sit amet
              </p>
            </div>

            {convexProjects && convexProjects.map((project: any) => {
              const cell = project.cell || { left: 0, top: 0, width: 200, height: 200, rotation: 0, zIndex: 50 };
              const title = project.title || 'Untitled';
              const description = project.description || '';
              const coverImage = project.coverImage || fallbackImages[project.id] || '/images/checked.png';
              const isActive = project.cell?.isActive !== false;

              return (
                <div
                  key={project.id}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${cell.left}px`,
                    top: `${cell.top}px`,
                    width: `${cell.width}px`,
                    height: `${cell.height}px`,
                    zIndex: cell.zIndex || 50
                  }}
                >
                  <motion.div
                    drag={false}
                    whileHover={{
                      scale: 1.05,
                      zIndex: 50,
                      rotate: cell.rotation || 0
                    }}
                    onTap={() => {
                      if (!isActive) return;
                      router.push(`/projects/${project.id}`);
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      rotate: cell.rotation || 0,
                      width: `${cell.width}px`,
                      height: `${cell.height}px`
                    }}
                    className={`cursor-pointer group ${!isActive ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div
                      className="relative rounded-[16px] overflow-hidden bg-white shadow-lg transition-shadow duration-500 group-hover:shadow-2xl flex items-center justify-center"
                      style={{ width: '100%', height: '100%' }}
                    >
                      <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                      >
                        <span className="text-xs font-medium tracking-wide">View Product</span>
                      </motion.div>
                    </div>
                    <div className="mt-3 pointer-events-none hidden sm:block">
                      <h3 className="text-[14px] font-bold text-black">{title}</h3>
                      <p className="text-[12px] text-black text-left mt-1">{description}</p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-20 md:bottom-8 left-0 right-0 px-6 md:px-12 flex items-end justify-between pointer-events-none z-50">
          <div className="flex items-center justify-center gap-3 pointer-events-auto w-full md:w-auto">
            <motion.button
              ref={aboutButtonRef}
              whileHover={{ y: -2 }}
              onClick={handleAboutClick}
              className="h-[52px] w-full md:w-auto flex items-center justify-center bg-[#1E1E1D] text-white px-6 rounded-xl shadow-lg hover:bg-black transition-colors gap-2"
            >
              <HexagonInfoIcon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">About</span>
            </motion.button>
          </div>
          <div className="sm:flex hidden items-center gap-6 bg-white text-black rounded-[16px] px-6 py-3 shadow-lg pointer-events-auto">
            <div className="text-[15px] font-semibold">
              <div>Shaping sense through</div>
              <div>Brand and Product Design</div>
            </div>
            <div className="text-[15px] font-semibold">
              <div>hello@dorodavid.com</div>
              <div>+39 3456366497</div>
            </div>
            <div className="text-[15px] font-semibold">
              <div>San Zeno, 31100</div>
              <div>Treviso, Italia.</div>
            </div>
          </div>
        </div>
      </motion.section>
    );
  };

  export default Hero;

