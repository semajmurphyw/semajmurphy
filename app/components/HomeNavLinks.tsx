"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface HomeNavLinksProps {
  biography?: {
    biography?: any;
  };
}

export default function HomeNavLinks({ biography }: HomeNavLinksProps) {
  const [isBioVisible, setIsBioVisible] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [animationsComplete, setAnimationsComplete] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsAnimated(true);
    // Animation completes after duration (0.6s)
    const timer = setTimeout(() => {
      setAnimationsComplete(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!biography?.biography) return;

    const handleScroll = () => {
      // Check scroll position relative to bio section entry
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      
      // Bio section starts at 100vh (after one-liner section)
      // Trigger when bio section is 50% scrolled into view = 100vh + 50vh = 150vh
      const fadeStartPoint = viewportHeight * 1.5;
      setIsBioVisible(scrollY >= fadeStartPoint);
    };

    // Check on mount and on scroll
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [biography]);

  const navItems = [
    { href: "/about", label: "About", isLink: true },
    { href: "/selected-works", label: "Selected Works", isLink: true },
    { href: "/gallery", label: "Gallery", isLink: true },
  ];

  return (
    <nav className="absolute bottom-0 right-0 z-10 flex flex-col items-end gap-4 p-6 md:p-8">
      {navItems.map((item, index) => {
        const shouldReduceOpacity = index > 0 && isBioVisible;
        
        const className = `text-2xl font-medium uppercase text-white drop-shadow-lg transition-opacity duration-300 hover:underline md:text-3xl`;
        
        // Calculate opacity based on animation state and bio visibility
        let opacity: number | undefined = undefined;
        let animationStyle: React.CSSProperties = {};
        
        if (!isAnimated) {
          // Start hidden before animation
          opacity = 0;
        } else if (!animationsComplete) {
          // During animation, let CSS animation handle opacity (all items animate together)
          animationStyle = {
            animation: `fadeIn 0.6s ease-out forwards`
          };
        } else {
          // After animation completes, use inline opacity for smooth transitions
          opacity = shouldReduceOpacity ? 0.5 : 1;
        }
        
        const style: React.CSSProperties = { 
          ...(opacity !== undefined && { opacity }),
          ...animationStyle
        };

        if (item.isLink) {
          return (
              <Link
                key={item.label}
                href={item.href}
                className={className}
                style={style}
              >
                {item.label}
              </Link>
            );
          } else {
            return (
              <a
                key={item.label}
                href={item.href}
                className={className}
                style={style}
              >
                {item.label}
              </a>
            );
        }
      })}
    </nav>
  );
}

