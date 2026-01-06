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

export default function GalleryGrid({ photos }: GalleryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [columns, setColumns] = useState(12);

  // Calculate aspect ratios and generate layout
  useEffect(() => {
    if (photos.length === 0) return;

    const calculateAspectRatio = (image: any): number => {
      if (!image?.asset) return 1;
      const { width, height } = image.asset.metadata?.dimensions || {};
      if (width && height) return width / height;
      return 1;
    };

    // Generate layout with better space filling
    const generateLayout = (): GridItem[] => {
      const items: GridItem[] = [];
      
      // Calculate optimal spans based on aspect ratio
      photos.forEach((photo, index) => {
        const aspectRatio = calculateAspectRatio(photo.image);
        
        // Start with a base size and adjust based on aspect ratio
        // Use a variety of sizes but optimize for space filling
        let colSpan: number;
        let rowSpan: number;
        
        // Determine base size pattern (creates variety)
        const patternType = index % 6;
        
        if (aspectRatio > 1.5) {
          // Very wide images
          colSpan = patternType < 2 ? 5 : patternType < 4 ? 4 : 6;
          rowSpan = patternType < 2 ? 2 : patternType < 4 ? 3 : 2;
        } else if (aspectRatio > 1.2) {
          // Wide images
          colSpan = patternType < 2 ? 4 : patternType < 4 ? 3 : 5;
          rowSpan = patternType < 2 ? 3 : patternType < 4 ? 2 : 3;
        } else if (aspectRatio < 0.7) {
          // Very tall images
          colSpan = patternType < 2 ? 2 : patternType < 4 ? 3 : 2;
          rowSpan = patternType < 2 ? 5 : patternType < 4 ? 4 : 6;
        } else if (aspectRatio < 0.85) {
          // Tall images
          colSpan = patternType < 2 ? 3 : patternType < 4 ? 2 : 3;
          rowSpan = patternType < 2 ? 4 : patternType < 4 ? 5 : 4;
        } else {
          // Square-ish images
          colSpan = patternType < 2 ? 3 : patternType < 4 ? 4 : 2;
          rowSpan = patternType < 2 ? 3 : patternType < 4 ? 4 : 2;
        }
        
        // Fine-tune to better match aspect ratio
        const currentRatio = colSpan / rowSpan;
        const ratioDiff = Math.abs(aspectRatio - currentRatio);
        
        // If the ratio is significantly off, adjust
        if (ratioDiff > 0.3) {
          if (aspectRatio > currentRatio) {
            // Need wider - increase colSpan or decrease rowSpan
            if (colSpan < 6) colSpan++;
            else if (rowSpan > 1) rowSpan--;
          } else {
            // Need taller - increase rowSpan or decrease colSpan
            if (rowSpan < 6) rowSpan++;
            else if (colSpan > 1) colSpan--;
          }
        }
        
        // Ensure reasonable bounds
        colSpan = Math.max(1, Math.min(colSpan, 6));
        rowSpan = Math.max(1, Math.min(rowSpan, 6));

        items.push({
          photo,
          colSpan,
          rowSpan,
          aspectRatio,
        });
      });

      return items;
    };

    setGridItems(generateLayout());
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

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="grid items-start"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridAutoRows: "minmax(100px, auto)",
          rowGap: "4px",
          columnGap: "8px",
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

          // Calculate height to better preserve aspect ratio
          // Use container width to calculate proper height
          const baseCellHeight = 100;
          // Calculate based on aspect ratio - this helps preserve proportions
          // The width will be (colSpan / columns) * containerWidth
          // Height should be width / aspectRatio
          // For grid, we approximate using base cell size
          const approximateWidth = baseCellHeight * item.colSpan;
          const calculatedHeight = approximateWidth / item.aspectRatio;
          // Ensure minimum height based on row span
          const minHeight = Math.max(calculatedHeight, baseCellHeight * item.rowSpan);

          return (
            <div
              key={item.photo._id}
              className="group relative w-full overflow-hidden cursor-pointer"
              style={{
                gridColumn: `span ${item.colSpan}`,
                gridRow: `span ${item.rowSpan}`,
                height: `${minHeight}px`,
              }}
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={item.photo.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes={`(max-width: 640px) ${(item.colSpan / 4) * 100}vw, (max-width: 1024px) ${(item.colSpan / 8) * 100}vw, ${(item.colSpan / 12) * 100}vw`}
                />
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transform -translate-x-1/4 group-hover:translate-x-0 transition-all duration-150 ease-out">
                <h3 className="text-white text-lg font-semibold mb-1">
                  {item.photo.title}
                </h3>
                {item.photo.date && (
                  <p className="text-white/90 text-sm">
                    {new Date(item.photo.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

