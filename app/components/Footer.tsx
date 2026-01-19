"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

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
    <footer ref={footerRef} className="relative flex flex-col md:flex-row w-full items-start md:items-end justify-between p-6 md:p-8 min-h-[200px] gap-6 md:gap-0" style={{ backgroundColor: '#222222' }}>
      {/* Navigation Links - Left Side */}
      <nav className="flex flex-col items-start gap-2 md:gap-4">
        {[
          { href: "/", label: "About", isLink: true },
          { href: "/selected-works", label: "Selected Works", isLink: true },
          { href: "/gallery", label: "Gallery", isLink: true },
          { href: "/contact", label: "Contact", isLink: true },
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
            const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (item.href === "/" && item.label === "About") {
                e.preventDefault();
                
                // If on home page, scroll to bio section
                if (isHomePage) {
                  const bioSection = document.querySelector('[data-bio-section]');
                  if (bioSection) {
                    bioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                } else {
                  // If on another page, navigate to home with hash
                  router.push("/#bio");
                }
              }
            };

            return (
              <Link
                key={item.label}
                href={item.href}
                className={baseClasses}
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
      <div className="flex flex-col items-start md:items-end justify-between self-stretch">
        <div className="flex flex-col items-start md:items-end gap-4">
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

        {/* Collaboration Inquiry and Copyright - Bottom Right */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <p className="text-white text-sm text-left md:text-right py-5 md:py-0">
            For aligned inquiries and collborations {" "}
            <a
              href="mailto:semajmurphyw@gmail.com"
              className="underline text-white text-sm"
              style={{ fontFamily: 'var(--font-figtree), sans-serif' }}
            >
              semajmurphyw@gmail.com
            </a>
          </p>
          <p className="text-white text-sm">
            © {currentYear} {name || "All rights reserved"}
          </p>
        </div>
      </div>
    </footer>
  );
}

