"use client";

import { PortableText } from "@portabletext/react";
import { useEffect, useRef, useState } from "react";
import DownloadEPKButton from "./DownloadEPKButton";

interface BiographySectionProps {
  biography: any;
  epkUrl?: string | null;
}

// Custom paragraph component with scroll-based opacity
function ParagraphWithOpacity({ children }: { children: React.ReactNode }) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const [paragraphOpacity, setParagraphOpacity] = useState(0.35);

  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (!paragraph) return;

    const handleScroll = () => {
      const rect = paragraph.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      
      // Calculate distance from paragraph center to viewport center
      const paragraphCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(paragraphCenter - viewportCenter);
      
      // When paragraph is centered (within 200px of viewport center), opacity = 1
      // Otherwise, opacity = 0.35
      // Smooth transition based on distance
      const maxDistance = viewportHeight * 0.4; // Start fading at 40% of viewport height from center
      const opacity = Math.max(0.35, Math.min(1, 1 - (distanceFromCenter / maxDistance) * 0.65));
      
      setParagraphOpacity(opacity);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <p ref={paragraphRef} style={{ opacity: paragraphOpacity }}>
      {children}
    </p>
  );
}

export default function BiographySection({ biography, epkUrl }: BiographySectionProps) {
  const [opacity, setOpacity] = useState(0.5);
  const [buttonOpacity, setButtonOpacity] = useState(0.05);
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionTop = rect.top;
      
      // Start at 50% opacity when section first appears
      // Animate to 100% as it scrolls into view
      // Calculate progress: 0 when section top is at viewport bottom, 1 when section top reaches viewport top
      let progress = 0;
      
      if (sectionTop < viewportHeight) {
        // Section has entered viewport
        // Progress from 0 to 1 as section scrolls from viewport bottom to top
        progress = Math.max(0, Math.min(1, (viewportHeight - sectionTop) / viewportHeight));
      }
      
      // Map progress from 0.5 (50%) to 1.0 (100%) opacity
      const newOpacity = 0 + (progress * 1);
      setOpacity(newOpacity);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle button opacity similar to paragraphs
  useEffect(() => {
    if (!epkUrl || !buttonRef.current) return;

    const button = buttonRef.current;
    const handleScroll = () => {
      const rect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      
      // Calculate distance from button center to viewport center
      const buttonCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(buttonCenter - viewportCenter);
      
      // When button is centered (within 200px of viewport center), opacity = 1
      // Otherwise, opacity = 0.05
      // Smooth transition based on distance
      const maxDistance = viewportHeight * 0.4; // Start fading at 40% of viewport height from center
      const opacity = Math.max(0.05, Math.min(1, 1 - (distanceFromCenter / maxDistance) * 0.95));
      
      setButtonOpacity(opacity);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [epkUrl]);

  // Handle hash navigation to bio section
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#bio') {
        const bioSection = sectionRef.current;
        if (bioSection) {
          // Small delay to ensure page is fully rendered
          setTimeout(() => {
            bioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Remove hash from URL after scrolling
            window.history.replaceState(null, '', window.location.pathname);
          }, 100);
        }
      }
    };

    // Check on mount
    checkHash();

    // Also check on hash change (in case user navigates with hash)
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Custom components for PortableText to wrap paragraphs
  const portableTextComponents = {
    block: {
      normal: ({ children }: any) => {
        return <ParagraphWithOpacity>{children}</ParagraphWithOpacity>;
      },
    },
  };

  return (
    <div 
      ref={sectionRef}
      id="bio"
      className="relative w-full md:w-[45vw] min-h-screen z-10 mt-[100vh] md:mt-0" 
      style={{ backgroundColor: '#222222' }}
      data-bio-section
    >
      <div className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-24 md:py-32 lg:py-48">
        <div 
          className="text-white text-lg leading-relaxed [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2"
          style={{ opacity }}
        >
          <PortableText value={biography} components={portableTextComponents} />
        </div>
        {epkUrl && (
          <div ref={buttonRef} className="mt-0 mb-0 md:mt-[25vh] md:mb-[25vh]" style={{ opacity: buttonOpacity }}>
            <DownloadEPKButton epkUrl={epkUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

