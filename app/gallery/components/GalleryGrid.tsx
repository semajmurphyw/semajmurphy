"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Photo {
  _id: string;
  title: string;
  image: any;
  date: string;
  category: any;
}

interface GalleryGridProps {
  photos: Photo[];
}

interface GridItem {
  photo: Photo;
  colSpan: number;
  rowSpan: number;
  aspectRatio: number;
}

// Individual image component with scroll-based scaling
function GalleryImage({ item, baseSize, gap, imageUrl }: { item: GridItem; baseSize: number; gap: number; imageUrl: string | null }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // Mobile: Calculate based on vertical position
        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight / 2;
        const imageCenter = rect.top + rect.height / 2;
        
        // Calculate distance from viewport center
        const distanceFromCenter = Math.abs(imageCenter - viewportCenter);
        
        // Maximum distance for scaling (half of viewport height)
        const maxDistance = viewportHeight * 0.5;
        
        // Scale from 1.5 (center) to 1.0 (far from center)
        const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
        const newScale = 1.5 - (normalizedDistance * 0.5);
        
        setScale(newScale);
      } else {
        // Desktop: Calculate based on horizontal position
        const viewportWidth = window.innerWidth;
        const viewportCenter = viewportWidth / 2;
        const imageCenter = rect.left + rect.width / 2;
        
        // Calculate distance from viewport center
        const distanceFromCenter = Math.abs(imageCenter - viewportCenter);
        
        // Maximum distance for scaling (half of viewport width)
        const maxDistance = viewportWidth * 0.5;
        
        // Scale from 1.5 (center) to 1.0 (far from center)
        const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
        const newScale = 1.5 - (normalizedDistance * 0.5);
        
        setScale(newScale);
      }
    };

    // Initial calculation
    const timeout = setTimeout(handleScroll, 100);
    
    // Find scroll containers
    const horizontalScrollContainer = imageRef.current?.closest('.overflow-x-auto') as HTMLElement;
    const verticalScrollContainer = imageRef.current?.closest('.overflow-y-auto') as HTMLElement;
    
    if (horizontalScrollContainer) {
      horizontalScrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    }
    if (verticalScrollContainer) {
      verticalScrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    }
    
    // Also listen to window scroll
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timeout);
      if (horizontalScrollContainer) {
        horizontalScrollContainer.removeEventListener("scroll", handleScroll);
      }
      if (verticalScrollContainer) {
        verticalScrollContainer.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const sizeVariation = (item.photo._id.charCodeAt(0) % 3) * 50;
  const imageWidth = baseSize + sizeVariation;
  const imageHeight = imageWidth / item.aspectRatio;

  // Calculate z-index based on scale (higher scale = higher z-index)
  // When hovered, set z-index much higher to appear above all others
  const zIndex = isHovered ? 1000 : Math.round(scale * 100);

  return (
    <div
      ref={imageRef}
      className="group flex flex-col flex-shrink-0 items-center md:items-start"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        zIndex: zIndex,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title above image - only visible on hover, hidden on mobile */}
      <div className="hidden md:block text-white text-left mb-2 opacity-0 group-hover:opacity-100 transition-none">
        <h3 className="text-lg font-semibold">
          {item.photo.title}
        </h3>
      </div>
      
      {/* Image */}
      <div className="relative overflow-hidden cursor-pointer max-w-[100vw] md:max-w-none" style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={item.photo.title}
            fill
            className="object-cover"
          />
        )}
      </div>
      
      {/* Date below image - only visible on hover, hidden on mobile */}
      {item.photo.date && (
        <div className="hidden md:block text-white text-left mt-2 opacity-0 group-hover:opacity-100 transition-none">
          <p className="text-sm">
            {new Date(item.photo.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
}

export default function GalleryGrid({ photos }: GalleryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [columns, setColumns] = useState(12);

  // Calculate aspect ratios
  useEffect(() => {
    if (photos.length === 0) return;

    const calculateAspectRatio = (image: any): number => {
      if (!image?.asset) return 1;
      const { width, height } = image.asset.metadata?.dimensions || {};
      if (width && height) return width / height;
      return 1;
    };

    // Generate items with aspect ratios
    const items: GridItem[] = photos.map((photo) => {
      const aspectRatio = calculateAspectRatio(photo.image);
      return {
        photo,
        colSpan: 1, // Not used anymore
        rowSpan: 1, // Not used anymore
        aspectRatio,
      };
    });

    setGridItems(items);
  }, [photos]);

  // Update columns based on container width
  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // Adjust columns based on viewport width
        if (width < 640) {
          setColumns(4);
        } else if (width < 1024) {
          setColumns(8);
        } else {
          setColumns(12);
        }
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  if (photos.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        No photos found in this category.
      </p>
    );
  }

  const [baseSize, setBaseSize] = useState(250); // Base size for images
  const gap = 60; // Gap between images

  // Update base size based on screen size
  useEffect(() => {
    const updateBaseSize = () => {
      if (window.innerWidth < 768) {
        setBaseSize(200); // Smaller on mobile
      } else {
        setBaseSize(250); // Normal on desktop
      }
    };

    updateBaseSize();
    window.addEventListener("resize", updateBaseSize);
    return () => window.removeEventListener("resize", updateBaseSize);
  }, []);

  return (
    <div ref={containerRef} className="h-full md:h-full flex flex-col md:flex-row items-start md:items-center relative md:min-w-max">
      {/* Gallery text in left buffer - Hidden on mobile */}
      <div
        className="hidden md:flex absolute left-0 items-center h-full"
        style={{
          width: '40vw',
          paddingLeft: '6rem',
        }}
      >
        <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          gallery
        </h2>
      </div>
      
      <div
        className="flex flex-col md:flex-row items-center md:items-center h-full md:h-full w-full md:w-max px-6 pt-10 pb-4 md:py-0 gallery-images-desktop"
        style={{
          gap: `${gap}px`,
        }}
      >
        {gridItems.map((item) => {
          const imageUrl = item.photo.image
            ? urlFor(item.photo.image)
                .width(1600)
                .height(1600)
                .fit("max")
                .url()
            : null;

          return (
            <GalleryImage
              key={item.photo._id}
              item={item}
              baseSize={baseSize}
              gap={gap}
              imageUrl={imageUrl}
            />
          );
        })}
      </div>
    </div>
  );
}

