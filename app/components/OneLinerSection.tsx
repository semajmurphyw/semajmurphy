"use client";

import { useEffect, useRef, useState } from "react";

interface OneLinerSectionProps {
  oneLiner: string;
}

export default function OneLinerSection({ oneLiner }: OneLinerSectionProps) {
  const [opacity, setOpacity] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionBottom = rect.bottom;
      
      // Calculate opacity: fade from 100% to 0% as section scrolls out of view
      // Since one-liner is at the bottom of the section, use section bottom
      // When section bottom is at viewport bottom (fully visible), opacity should be 1
      // When section bottom is at viewport top (scrolled out), opacity should be 0
      // Opacity = sectionBottom / viewportHeight, clamped between 0 and 1
      const newOpacity = Math.max(0, Math.min(1, sectionBottom / viewportHeight));
      setOpacity(newOpacity);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="relative w-[50vw] h-screen bg-transparent z-10 flex items-end"
    >
      <div className="p-6 md:p-8 max-h-[50vh] overflow-y-auto">
        <p 
          className="text-white text-lg md:text-xl drop-shadow-lg max-w-md"
          style={{ opacity }}
        >
          {oneLiner}
        </p>
      </div>
    </div>
  );
}

