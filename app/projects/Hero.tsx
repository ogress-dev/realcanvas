'use client';

  import { useState, useRef, useEffect } from 'react';
  import { motion, useMotionValue, animate } from 'framer-motion';
  import { Move } from 'lucide-react';
  import { useRouter } from 'next/navigation';
  import Logo from '@/components/Logo';
  import { useQuery } from 'convex/react';
  import { api } from '@/convex/_generated/api';

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


  const Hero = () => {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const aboutButtonRef = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const convexProjects = useQuery(api.projects.listProjects);

    const [dragConstraints, setDragConstraints] = useState({
      left: -3500,
      right: 3500,
      top: -1280,
      bottom: 1280
    });

    useEffect(() => {
      const updateDragConstraints = () => {
        setDragConstraints({
          left: -Math.max(1000, Math.abs(2560 - window.innerWidth) * 3.5),
          right: Math.max(1000, Math.abs(2560 - window.innerWidth) * 3.5),
          top: -Math.max(300, Math.abs(1920 - window.innerHeight) * 0.8),
          bottom: Math.max(300, Math.abs(1920 - window.innerHeight) * 0.8)
        });
      };

      updateDragConstraints();
      window.addEventListener('resize', updateDragConstraints);
      return () => window.removeEventListener('resize', updateDragConstraints);
    }, []);

    useEffect(() => {
      const centerProjectOne = () => {
        const canvasWidth = 2560;
        const canvasHeight = 1920;
        const projectOne = convexProjects?.find((p: any) => p.id === 1);
        const projectWidth = projectOne?.cell?.width || 200;
        const projectHeight = projectOne?.cell?.height || 200;
        const { gridLeft, gridTop } = getGridPositionForNumber(1);

        const projectLeft = gridLeft + (320 - projectWidth) / 2;
        const projectTop = gridTop + (320 - projectHeight) / 2;

        const projectCenterX = projectLeft + projectWidth / 2;
        const projectCenterY = projectTop + projectHeight / 2;

        // The canvas starts centered (x=0,y=0), so we offset from canvas center.
        const centeredX = (canvasWidth / 2) - projectCenterX;
        const centeredY = (canvasHeight / 2) - projectCenterY;

        x.set(centeredX);
        y.set(centeredY);
      };

      centerProjectOne();
      window.addEventListener('resize', centerProjectOne);
      return () => window.removeEventListener('resize', centerProjectOne);
    }, [convexProjects, x, y]);

    // Helper function to get grid position for a spiral number
    const getGridPositionForNumber = (targetNum: number) => {
      const grid: number[][] = Array(6).fill(null).map(() => Array(8).fill(0));
      
      let num = 1;
      let col = 3, row = 2; // Start at true center (col 3, row 2)
      
      const directions = [
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }
      ];
      
      let dirIndex = 0;
      let stepsToTake = 1;
      let directionChangeCount = 0;
      
      grid[row][col] = num++;
      
      while (num <= 48) {
        const dir = directions[dirIndex];
        
        for (let step = 0; step < stepsToTake; step++) {
          col += dir.dx;
          row += dir.dy;
          
          if (col >= 0 && col < 8 && row >= 0 && row < 6 && grid[row][col] === 0) {
            grid[row][col] = num++;
            if (num > 48) break;
          }
        }
        
        dirIndex = (dirIndex + 1) % 4;
        directionChangeCount++;
        
        if (directionChangeCount % 2 === 0) {
          stepsToTake++;
        }
      }
      
      // Find position of targetNum
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 8; c++) {
          if (grid[r][c] === targetNum) {
            return {
              gridLeft: -320 + c * 320,
              gridTop: r * 320
            };
          }
        }
      }
      
      return { gridLeft: 0, gridTop: 0 };
    };

    const [isExpandingAbout, setIsExpandingAbout] = useState(false);
    const [aboutButtonRect, setAboutButtonRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [inactiveNotice, setInactiveNotice] = useState<string | null>(null);
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

      const canvasWidth = 2560;
      const canvasHeight = 1920;
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
        {inactiveNotice && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[120] bg-[#1E1E1D] text-white px-4 py-2 rounded-full shadow-lg text-sm pointer-events-none">
            {inactiveNotice}
          </div>
        )}
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
              width: '2560px',
              height: '1920px',
              x,
              y
            }}
            className="relative"
          >
              {/* Dynamic grid generation: 8 columns × 6 rows = 48 cells, each 320x320px */}
              {Array.from({ length: 48 }).map((_, index) => {
                const col = index % 8;
                const row = Math.floor(index / 8);
                const left = -320 + col * 320;
                const top = row * 320;
                
                return (
                  <div
                    key={index}
                    className="absolute flex items-center justify-center border border-blue-200"
                    style={{
                      left: `${left}px`,
                      top: `${top}px`,
                      width: '320px',
                      height: '320px',
                      zIndex: 10,
                      pointerEvents: 'none'
                    }}
                  >
                  </div>
                );
              })}
            {convexProjects && convexProjects.map((project: any) => {
              const title = project.title || 'Untitled';
              const description = project.description || '';
              const coverImage = project.coverImage || '/images/checked.png';
              const isTextProject = project.projectType === 'text';
              const textContent = project.textContent || '';
              const isActive = project.cell?.isActive !== false;
              
              // Position project in grid cell based on its project ID
              const gridNumber = project.id; // Use project ID as grid number
              const { gridLeft, gridTop } = getGridPositionForNumber(gridNumber);
              
              // Get project dimensions from database, defaulting to 200x200 if not set
              const projectWidth = project.cell?.width || 200;
              const projectHeight = project.cell?.height || 200;
              const projectRotation = project.cell?.rotation || 0;
              
              // Center the project within its 320×320 grid cell
              const cellSize = 320;
              const offsetX = (cellSize - projectWidth) / 2;
              const offsetY = (cellSize - projectHeight) / 2;
              
              const cell = {
                left: gridLeft + offsetX,
                top: gridTop + offsetY,
                width: projectWidth,
                height: projectHeight,
                rotation: projectRotation,
                zIndex: 20
              };

              return (
                <div
                  key={project.id}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${cell.left}px`,
                    top: `${cell.top}px`,
                    width: `${cell.width}px`,
                    height: `${cell.height}px`,
                    zIndex: cell.zIndex || 20
                  }}
                >
                  {isTextProject ? (
                    <div
                      className="w-full h-full flex items-center justify-center p-2 text-center text-black text-sm leading-relaxed"
                      style={{
                        transform: `rotate(${cell.rotation || 0}deg)`,
                      }}
                    >
                      {textContent}
                    </div>
                  ) : (
                  <motion.div
                    drag={false}
                    whileHover={{
                      scale: 1.05,
                      zIndex: 30,
                      rotate: cell.rotation || 0
                    }}
                    onTap={() => {
                      if (!isActive) {
                        setInactiveNotice('Upcoming project hold on');
                        setTimeout(() => setInactiveNotice(null), 1800);
                        return;
                      }
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
                      {!isTextProject && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1E1E1D] text-white px-4 py-2 shadow-lg rounded-[24px] whitespace-nowrap z-40 pointer-events-none"
                        >
                          <span className="text-xs font-medium tracking-wide">View Product</span>
                        </motion.div>
                      )}
                    </div>
                    {!isTextProject && (
                      <div className="mt-3 pointer-events-none hidden sm:block">
                        <h3 className="text-[14px] font-bold text-black">{title}</h3>
                        <p className="text-[12px] text-black text-left mt-1">{description}</p>
                      </div>
                    )}
                  </motion.div>
                  )}
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

