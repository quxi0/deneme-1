import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useUI } from '../context/UIContext';

const CustomCursor: React.FC = () => {
  const { cursorVariant, setCursorVariant } = useUI();
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // Store coordinates in refs to avoid re-renders
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  
  // Speed factor for Lerp (Linear Interpolation)
  // 0.15 is a good balance between organic lag and responsiveness
  const speed = 0.15;

  useEffect(() => {
    // 1. Mouse Move Listener
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    // 2. Hover Detection Listener
    // We keep this purely JS-based to avoid React state lag on hover detection
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check hierarchy for interactive elements
      const isLink = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button');
      const isImage = target.tagName === 'IMG';
      const isText = target.tagName === 'P' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'H3';

      if (isLink) {
        setCursorVariant('hover');
      } else if (isImage) {
        setCursorVariant('image');
      } else if (isText) {
        setCursorVariant('text');
      } else {
        setCursorVariant('default');
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, [setCursorVariant]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // 3. GSAP Setup
    // Center the pivot point so x/y coordinates represent the center of the cursor
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    // Create quickSetters for maximum performance
    // This bypasses standard DOM parsing during the animation loop
    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");

    // 4. Animation Loop
    const loop = () => {
      // Lerp logic: current = current + (target - current) * fraction
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
      
      pos.current.x += (mouse.current.x - pos.current.x) * dt;
      pos.current.y += (mouse.current.y - pos.current.y) * dt;
      
      xSet(pos.current.x);
      ySet(pos.current.y);
    };

    // Add to GSAP's requestAnimationFrame ticker
    gsap.ticker.add(loop);

    return () => {
      gsap.ticker.remove(loop);
    };
  }, []);

  // 5. Handle Visual Variants
  // We use gsap.to here for smooth transitions between states
  useEffect(() => {
    const cursor = cursorRef.current;
    const text = textRef.current;
    if (!cursor) return;

    const baseConfig = { 
      duration: 0.4, 
      ease: "power3.out",
      overwrite: true // Ensure new animations override old ones immediately
    };

    switch (cursorVariant) {
      case 'hover':
        gsap.to(cursor, {
          ...baseConfig,
          width: 64,
          height: 64,
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
          border: "none",
          borderRadius: "50%"
        });
        if (text) gsap.to(text, { opacity: 0, duration: 0.2 });
        break;
        
      case 'text':
        gsap.to(cursor, {
          ...baseConfig,
          width: 4,
          height: 24,
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
          border: "none",
          borderRadius: "2px"
        });
        if (text) gsap.to(text, { opacity: 0, duration: 0.2 });
        break;

      case 'image':
        gsap.to(cursor, {
          ...baseConfig,
          width: 80,
          height: 80,
          backgroundColor: "transparent",
          mixBlendMode: "normal",
          border: "1px solid rgba(255,255,255,0.8)",
          borderRadius: "50%"
        });
        if (text) gsap.to(text, { opacity: 1, delay: 0.1, duration: 0.2 });
        break;

      default: // 'default'
        gsap.to(cursor, {
          ...baseConfig,
          width: 12,
          height: 12,
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
          border: "none",
          borderRadius: "50%"
        });
        if (text) gsap.to(text, { opacity: 0, duration: 0.2 });
        break;
    }
  }, [cursorVariant]);

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden will-change-transform"
      style={{ backfaceVisibility: 'hidden' }}
    >
      <span ref={textRef} className="text-white text-xl font-light opacity-0 pointer-events-none select-none">
        +
      </span>
    </div>
  );
};

export default CustomCursor;
