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
    // All animations complete after longest delay (0.4s) + duration (0.6s) = 1s
    const timer = setTimeout(() => {
      setAnimationsComplete(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!biography?.biography) return;

    const handleScroll = () => {
      // Check if we've scrolled past 100vh (past the one-liner section)
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      
      // Bio section starts at 100vh, so check if we've scrolled past that point
      setIsBioVisible(scrollY >= viewportHeight);
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
    { href: "/video", label: "Videos", isLink: true },
    { href: "/projects", label: "Projects", isLink: true },
    { href: "#", label: "Press", isLink: false },
    { href: "/gallery", label: "Gallery", isLink: true },
  ];

  return (
    <nav className="absolute bottom-0 right-0 z-10 flex flex-col items-end gap-4 p-6 md:p-8">
      {navItems.map((item, index) => {
        const delay = index * 0.1; // Stagger delay: 0s, 0.1s, 0.2s, 0.3s, 0.4s
        const shouldReduceOpacity = index > 0 && isBioVisible;
        
        const className = `text-2xl font-medium uppercase text-white drop-shadow-lg transition-opacity duration-300 hover:underline md:text-3xl ${
          animationsComplete && shouldReduceOpacity ? "!opacity-50" : ""
        }`;
        
        // Calculate opacity: start hidden, then after animation completes control based on bio visibility
        const opacity = !isAnimated ? 0 : undefined;  // Start hidden, then let animation handle it
        
        const style: React.CSSProperties = { 
          ...(opacity !== undefined && { opacity }),
          ...(isAnimated && {
            animation: `fadeIn 0.6s ease-out ${delay}s forwards`
          })
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

