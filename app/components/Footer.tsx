"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { urlFor } from "@/sanity/lib/image";

interface SocialMediaLink {
  _id: string;
  platformName: string;
  url: string;
  icon?: any;
}

interface FooterProps {
  name?: string;
  socialMediaLinks?: SocialMediaLink[];
}

export default function Footer({ name, socialMediaLinks }: FooterProps) {
  // Get first 2 social media links
  const displayLinks = socialMediaLinks?.slice(0, 2) || [];
  const [isInView, setIsInView] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
        rootMargin: "0px",
      }
    );

    observer.observe(footerElement);

    return () => {
      observer.disconnect();
    };
  }, [isInView]);

  const currentYear = new Date().getFullYear();

  return (
    <footer ref={footerRef} className="relative flex w-full items-start justify-between p-6 md:p-8 min-h-[200px]" style={{ backgroundColor: '#222222' }}>
      {/* Navigation Links - Left Side */}
      <nav className="flex flex-col items-start gap-2 md:gap-4">
        {[
          { href: "/about", label: "About", isLink: true },
          { href: "/video", label: "Videos", isLink: true },
          { href: "/projects", label: "Projects", isLink: true },
          { href: "#", label: "Press", isLink: false },
          { href: "/gallery", label: "Gallery", isLink: true },
        ].map((item, index) => {
          const delay = index * 0.1; // Stagger delay: 0s, 0.1s, 0.2s, 0.3s, 0.4s
          const baseClasses = "text-lg font-medium uppercase text-white drop-shadow-lg transition-all hover:underline md:text-xl lg:text-2xl";
          const style: React.CSSProperties = { 
            opacity: 0,
            ...(isInView && {
              animation: `fadeIn 0.6s ease-out ${delay}s forwards`
            })
          };

          if (item.isLink) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={baseClasses}
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
                className={baseClasses}
                style={style}
              >
                {item.label}
              </a>
            );
          }
        })}
      </nav>

      {/* Name, Social Media, and Copyright - Right Side */}
      <div className="flex flex-col items-end gap-4 h-full justify-between">
        <div className="flex flex-col items-end gap-4">
          {name && (
            <h2 className="text-xl font-semibold text-white drop-shadow-lg md:text-2xl lg:text-3xl">
              {name}
            </h2>
          )}

          {/* Social Media Icons - Right Aligned */}
          {displayLinks.length > 0 && (
            <div className="flex gap-4">
              {displayLinks.map((link) => {
                const iconUrl = link.icon
                  ? urlFor(link.icon).width(32).height(32).url()
                  : null;
                return (
                  <a
                    key={link._id || link.platformName}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                    aria-label={link.platformName}
                  >
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt={link.platformName}
                        width={32}
                        height={32}
                        className="drop-shadow-lg"
                      />
                    ) : (
                      <span className="text-white drop-shadow-lg">
                        {link.platformName}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Copyright Text - Bottom Right */}
        <p className="text-white text-sm">
          © {currentYear} {name || "All rights reserved"}
        </p>
      </div>
    </footer>
  );
}

