import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { notFound } from "next/navigation";

async function getBiography() {
  const biography = await client.fetch(
    `*[_type == "biography" && _id == "biography"][0]{
      name,
      backgroundImage
    }`
  );
  return biography;
}

async function getSocialMediaLinks() {
  const links = await client.fetch(
    `*[_type == "socialMediaLink"] | order(platformName asc){
      _id,
      platformName,
      url,
      icon
    }`
  );
  return links;
}

async function getProject(slug: string) {
  const project = await client.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      category,
      date,
      releaseInfo,
      credits,
      mainImage,
      collaborators[]{
        title,
        image,
        description
      }
    }`,
    { slug }
  );
  return project;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const biography = await getBiography();
  const project = await getProject(slug);
  const name = biography?.name || "";
  
  if (!project) {
    return {
      title: `Project | ${name}`,
    };
  }
  
  return {
    title: `${project.title} | ${name}`,
    description: `Project: ${project.title} by ${name}`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const biography = await getBiography();
  const socialMediaLinks = await getSocialMediaLinks();
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  // Function to extract YouTube video ID from URL
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

  // Custom components for PortableText
  const portableTextComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) {
          return null;
        }
        const imageUrl = urlFor(value).width(1200).height(800).url();
        return (
          <div className="my-8">
            <Image
              src={imageUrl}
              alt={value.alt || "Project image"}
              width={1200}
              height={800}
              className="w-full h-auto rounded"
            />
          </div>
        );
      },
      youtubeEmbed: ({ value }: any) => {
        if (!value?.url) {
          return null;
        }
        const videoId = getYouTubeVideoId(value.url);
        if (!videoId) {
          return null;
        }
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <div className="my-8 aspect-video w-full">
            <iframe
              src={embedUrl}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded"
            />
          </div>
        );
      },
    },
  };

  const mainImageUrl = project.mainImage
    ? urlFor(project.mainImage).width(1200).height(1800).url()
    : null;

  return (
    <>
      <Navbar name={biography?.name} socialMediaLinks={socialMediaLinks} />
      <main className="min-h-screen px-6 py-24 md:px-12 lg:px-24" style={{ backgroundColor: '#222222' }}>
        <div className="max-w-full mx-auto w-full flex gap-8">
          {/* Left Side - Content (67vw) */}
          <div className="w-[67vw] flex-shrink-0">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">
              {project.title}
            </h1>
            {project.releaseInfo && (
              <div className="text-white text-lg leading-relaxed [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2">
                <PortableText value={project.releaseInfo} components={portableTextComponents} />
              </div>
            )}

            {/* Collaborators Section */}
            {project.collaborators && project.collaborators.length > 0 && (
              <div className="mt-12">
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-8">Collaborators</h2>
                <div className="flex flex-wrap gap-8">
                  {project.collaborators.map((collaborator: any, index: number) => {
                    const imageUrl = collaborator.image
                      ? urlFor(collaborator.image).width(200).height(200).url()
                      : null;
                    
                    return (
                      <div key={index} className="flex flex-col items-start">
                        {imageUrl ? (
                          <div className="relative w-24 h-24 md:w-32 md:h-32 mb-3">
                            <Image
                              src={imageUrl}
                              alt={collaborator.title || "Collaborator"}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 md:w-32 md:h-32 mb-3 rounded-full bg-gray-600 flex items-center justify-center">
                            <span className="text-white text-2xl font-semibold">
                              {collaborator.title?.[0]?.toUpperCase() || "?"}
                            </span>
                          </div>
                        )}
                        <p className="text-white text-base md:text-lg font-medium">
                          {collaborator.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Sticky Main Image (33vw) */}
          {mainImageUrl && (
            <div className="w-[33vw] sticky top-0 h-screen flex items-center">
              <div className="relative w-full h-full">
                <Image
                  src={mainImageUrl}
                  alt={project.title || "Project image"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer name={biography?.name} socialMediaLinks={socialMediaLinks} />
    </>
  );
}

