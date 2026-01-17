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
      const bioSection = document.querySelector('[data-bio-section]');
      if (!bioSection) return;

      const rect = bioSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Trigger when section top enters viewport from below with 100px buffer
      // When scrolling down, rect.top decreases from > viewportHeight to <= viewportHeight
      // Add 100px buffer so opacity doesn't change until section is 100px into viewport
      const hasEntered = rect.top <= viewportHeight - 100;
      setIsBioVisible(hasEntered);
    };

    // Wait a bit for DOM to be ready, then check and set up listener
    const timeout = setTimeout(() => {
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 100);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [biography]);

  const navItems = [
    { href: "/", label: "About", isLink: true },
    { href: "/contact", label: "Contact", isLink: true },
    { href: "/selected-works", label: "Selected Works", isLink: true },
    { href: "/gallery", label: "Gallery", isLink: true },
  ];

  return (
    <nav className="absolute bottom-[20vh] left-0 md:bottom-0 md:left-auto md:right-0 z-10 flex flex-col items-start md:items-end gap-4 p-6 md:p-8">
      {navItems.map((item, index) => {
        const shouldReduceOpacity = index > 0 && isBioVisible;
        
        const className = `text-2xl font-medium uppercase text-white drop-shadow-lg transition-opacity duration-200 hover:underline md:text-3xl`;
        
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
          // Handle About link click to scroll to biography section
          const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (item.href === "/" && item.label === "About") {
              e.preventDefault();
              const bioSection = document.querySelector('[data-bio-section]');
              if (bioSection) {
                bioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          };

          return (
              <Link
                key={item.label}
                href={item.href}
                className={className}
                style={style}
                onClick={handleClick}
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

