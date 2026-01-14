import React, { useRef, useEffect, useState } from 'react';

// Configuration
const FRAME_COUNT = 120;
const IMAGE_PATH_PREFIX = '/assets/sequence/img_';
const IMAGE_EXTENSION = '.jpg';
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

const ScrollSequence: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  
  // Image Cache
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload Images
  useEffect(() => {
    let loadedCount = 0;
    
    const preloadImages = () => {
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        // Format: img_001.jpg, img_010.jpg, img_100.jpg
        const formattedIndex = String(i).padStart(3, '0');
        img.src = `${IMAGE_PATH_PREFIX}${formattedIndex}${IMAGE_EXTENSION}`;
        
        img.onload = () => {
          imagesRef.current[i - 1] = img;
          loadedCount++;
          if (loadedCount === FRAME_COUNT) {
            setImagesLoaded(true);
            // Initial render
            renderFrame(0);
          }
        };
        
        img.onerror = () => {
          // Graceful degradation if images are missing (fallback to procedural logic)
          console.warn(`Missing sequence image: ${img.src}`);
          imagesRef.current[i - 1] = null;
        };
      }
    };

    preloadImages();
  }, []);

  // Cinematic Text Stages
  const getStageText = (p: number) => {
    if (p < 0.25) return "From Void to Form";
    if (p < 0.50) return "Tectonic Clarity";
    if (p < 0.75) return "Atmospheric Synthesis";
    return "The Narrative Complete";
  };

  const renderFrame = (scrollProgress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Responsive Canvas
    const canvasW = canvas.width;
    const canvasH = canvas.height;

    context.clearRect(0, 0, canvasW, canvasH);
    context.fillStyle = '#050505';
    context.fillRect(0, 0, canvasW, canvasH);

    // 1. Image Sequence Rendering
    if (imagesLoaded) {
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(scrollProgress * FRAME_COUNT)
      );
      
      const img = imagesRef.current[frameIndex];
      
      if (img) {
        // "Cover" fit logic for canvas
        const scale = Math.max(canvasW / img.width, canvasH / img.height);
        const x = (canvasW / 2) - (img.width / 2) * scale;
        const y = (canvasH / 2) - (img.height / 2) * scale;
        
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else {
        // Fallback wireframe if image missing
        drawProceduralFallback(context, canvasW, canvasH, scrollProgress);
      }
    } else {
      // Loading State or Fallback
      drawProceduralFallback(context, canvasW, canvasH, scrollProgress);
      
      // Loading Indicator text
      context.fillStyle = '#333';
      context.font = '12px Space Mono';
      context.fillText('LOADING SEQUENCE ASSETS...', 20, canvasH - 20);
    }
  };

  const drawProceduralFallback = (context: CanvasRenderingContext2D, width: number, height: number, scrollProgress: number) => {
      // Procedural Art Generation (Simulating Video Frames)
      const size = Math.min(width, height) * 0.4;
      const centerX = width / 2;
      const centerY = height / 2;
      const angle = scrollProgress * Math.PI * 2; 

      context.strokeStyle = `rgba(255, 255, 255, ${0.3 + scrollProgress * 0.5})`;
      context.lineWidth = 1.5;
      context.beginPath();

      const numPoints = 12;
      for (let i = 0; i <= numPoints; i++) {
        const theta = (i / numPoints) * Math.PI * 2;
        const r = size * (0.8 + 0.2 * Math.sin(angle * 4));
        const x = centerX + r * Math.cos(theta + angle);
        const y = centerY + r * Math.sin(theta + angle);
        
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      context.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(progress);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const stickyHeight = containerRef.current.offsetHeight; 
      const viewportHeight = window.innerHeight;
      const startTop = containerRef.current.offsetTop;
      const currentScroll = window.scrollY;

      let rawProgress = (currentScroll - startTop) / (stickyHeight - viewportHeight);
      rawProgress = Math.max(0, Math.min(1, rawProgress));
      
      setProgress(rawProgress);
      requestAnimationFrame(() => renderFrame(rawProgress));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [progress, imagesLoaded]);

  return (
    <div ref={containerRef} className="relative h-[350vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="block w-full h-full" />
        
        {/* Floating Text Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mix-blend-difference pointer-events-none w-full">
          <h2 className="text-4xl md:text-6xl font-serif text-white transition-all duration-700 ease-out transform">
             {getStageText(progress)}
          </h2>
          <div className="h-px w-24 bg-white/50 mx-auto mt-4 transition-all duration-700" style={{ width: `${progress * 200}px`}} />
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-500 ${progress > 0.05 ? 'opacity-0' : 'opacity-100'}`}>
          <span className="text-[10px] uppercase tracking-[0.3em] animate-pulse">Begin Sequence</span>
        </div>
      </div>
    </div>
  );
};

export default ScrollSequence;
