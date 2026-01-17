"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";

interface SocialMediaLink {
  _id: string;
  platformName: string;
  url: string;
  icon?: any;
}

interface NavbarProps {
  name?: string;
  socialMediaLinks?: SocialMediaLink[];
}

export default function Navbar({ name, socialMediaLinks }: NavbarProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const navLinks = [
    { href: "/", label: "About", isLink: true },
    { href: "/selected-works", label: "Selected Works", isLink: true },
    { href: "/gallery", label: "Gallery", isLink: true },
    { href: "/contact", label: "Contact", isLink: true },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex w-full items-start justify-between p-6 md:p-8">
        {/* Name, + Icon, and Nav Links - Top Left */}
        {name && (
          <div className={`flex ${isOverlayOpen && !isHomePage ? 'flex-col items-start' : 'flex-row items-center'} md:flex-row md:items-center gap-3`}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-1">
              <Link href="/">
                <h1 className="text-2xl font-semibold text-white transition-opacity hover:opacity-80 md:text-3xl lg:text-4xl">
                  {name}
                </h1>
              </Link>
              {!isHomePage && (
                <button
                  type="button"
                  onClick={() => setIsOverlayOpen(!isOverlayOpen)}
                  className="text-white text-4xl md:text-5xl lg:text-5xl font-light hover:opacity-80 transition-all duration-300 cursor-pointer relative z-10 p-0 flex items-start md:items-center justify-start md:justify-center w-auto h-auto md:w-14 md:h-14 lg:w-16 lg:h-16 mt-2 md:mt-0 md:ml-1"
                  aria-label="Toggle menu"
                >
                  <span className="transition-opacity duration-300">
                    {isOverlayOpen ? '×' : '+'}
                  </span>
                </button>
              )}
            </div>
            {!isHomePage && isOverlayOpen && (
              <nav className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 relative z-[100]">
                {navLinks.map((item) => {
                  const baseClasses = "text-lg font-medium uppercase text-white drop-shadow-lg transition-all hover:underline md:text-xl lg:text-2xl";
                  
                  if (item.isLink) {
                    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                      if (item.href === "/" && item.label === "About") {
                        e.preventDefault();
                        setIsOverlayOpen(false);
                        
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
                      } else {
                        setIsOverlayOpen(false);
                      }
                    };

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={baseClasses}
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
                      >
                        {item.label}
                      </a>
                    );
                  }
                })}
              </nav>
            )}
          </div>
        )}

      {/* Social Media Icons - Top Right */}
      {socialMediaLinks && socialMediaLinks.length > 0 && (
        <div className="flex gap-4">
          {socialMediaLinks.map((link) => {
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
                    className="w-5 h-5 md:w-8 md:h-8"
                  />
                ) : (
                  <span className="text-white">
                    {link.platformName}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}
      </nav>

      {/* Overlay Background */}
      {isOverlayOpen && (
        <div
          className="fixed top-0 left-0 h-screen z-[90]"
          style={{
            width: '100vw',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
          onClick={() => setIsOverlayOpen(false)}
        />
      )}
    </>
  );
}

