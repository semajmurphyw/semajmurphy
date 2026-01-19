"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Photo {
  _id: string;
  title: string;
  image: any;
  date: string;
  videoUrl?: string;
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

// Individual image/video component
function GalleryImage({ item, imageUrl, videoUrl }: { item: GridItem; imageUrl: string | null; videoUrl?: string | null }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Calculate sizes for images (full height)
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!videoUrl) {
      // For images: full viewport height
      const updateImageSize = () => {
        const viewportHeight = window.innerHeight;
        const calculatedHeight = viewportHeight;
        const calculatedWidth = calculatedHeight * item.aspectRatio;
        
        setImageHeight(calculatedHeight);
        setImageWidth(calculatedWidth);
      };

      updateImageSize();
      window.addEventListener("resize", updateImageSize);
      return () => window.removeEventListener("resize", updateImageSize);
    }
  }, [item.aspectRatio, videoUrl]);

  const containerWidth = videoUrl 
    ? undefined // Let video container size itself
    : (imageWidth > 0 ? imageWidth : undefined);

  return (
    <div
      className={`group flex flex-shrink-0 items-center md:items-start ${videoUrl ? 'flex-col md:flex-row' : 'flex-col'} w-full md:w-auto`}
      style={{
        zIndex: isHovered ? 50 : 10,
        ...(containerWidth && !isMobile && { width: `${containerWidth}px` }),
        ...(isMobile && { width: '100vw' }),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image or Video */}
      {videoUrl ? (
        (() => {
          // Extract YouTube video ID
          const getYouTubeVideoId = (url: string): string | null => {
            if (!url) return null;
            const patterns = [
              /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
              /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
            ];
            for (const pattern of patterns) {
              const match = url.match(pattern);
              if (match && match[1]) {
                return match[1];
              }
            }
            return null;
          };

          // Extract Vimeo video ID
          const getVimeoVideoId = (url: string): string | null => {
            if (!url) return null;
            const patterns = [
              /(?:vimeo\.com\/)(\d+)/,
              /(?:player\.vimeo\.com\/video\/)(\d+)/,
            ];
            for (const pattern of patterns) {
              const match = url.match(pattern);
              if (match && match[1]) {
                return match[1];
              }
            }
            return null;
          };

          const youtubeId = getYouTubeVideoId(videoUrl);
          const vimeoId = getVimeoVideoId(videoUrl);

          return (
            <>
              {/* Block 1: Title and Date - centered on mobile, right aligned on desktop */}
              <div className="flex-shrink-0 flex flex-col justify-center items-center md:items-end self-center w-full md:w-auto px-4 md:px-0" style={{ 
                minWidth: isMobile ? 'auto' : '600px', 
                color: 'white', 
                textAlign: isMobile ? 'center' : 'right',
                paddingTop: isMobile ? '120px' : '0',
                marginBottom: isMobile ? '20px' : '0'
              }}>
                <h3 className="text-2xl font-semibold" style={{ color: 'white', display: 'block', width: isMobile ? 'auto' : '60%' }}>
                  {item.photo.title || ''}
                </h3>
                {item.photo.date && (
                  <p className="text-sm mt-1" style={{ color: 'white', display: 'block' }}>
                    {new Date(item.photo.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
              
              {/* Block 2: Video */}
              <div className="flex-shrink-0 w-full md:w-auto flex justify-center" style={{ 
                marginLeft: isMobile ? '0' : '40px', 
                marginRight: isMobile ? '0' : '400px', 
                paddingTop: isMobile ? '0' : '400px', 
                paddingBottom: isMobile ? '120px' : '400px' 
              }}>
                <div style={{ width: isMobile ? '90%' : '50vw', minWidth: isMobile ? 'auto' : '300px', aspectRatio: '16 / 9' }}>
                  {youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title={item.photo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ 
                        border: 'none',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  ) : vimeoId ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${vimeoId}`}
                      title={item.photo.title}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{ 
                        border: 'none',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  ) : (
                    <video
                      src={videoUrl}
                      controls
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            </>
          );
        })()
      ) : imageUrl && imageHeight > 0 && imageWidth > 0 ? (
        // Image - full height on desktop, 100vw on mobile
        <div className="relative overflow-hidden cursor-pointer flex-shrink-0 w-full md:w-auto" style={{ 
          width: isMobile ? '100vw' : `${imageWidth}px`, 
          height: isMobile ? 'auto' : `${imageHeight}px` 
        }}>
          <Image
            src={imageUrl}
            alt={item.photo.title}
            width={imageWidth}
            height={imageHeight}
            className="object-cover"
            style={{ width: '100%', height: isMobile ? 'auto' : '100%' }}
          />
        </div>
      ) : null}
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
              imageUrl={imageUrl}
              videoUrl={item.photo.videoUrl}
            />
          );
        })}
      </div>
    </div>
  );
}

