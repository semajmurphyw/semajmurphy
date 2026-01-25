import { Suspense } from "react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GalleryTabs from "./components/GalleryTabs";

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

async function getCategories() {
  const categories = await client.fetch(
    `*[_type == "category"]{
      _id,
      title,
      slug{
        current
      },
      galleryItems[]->{
        _id,
        title,
        image,
        date,
        videoUrl
      }
    }`
  );
  return categories;
}

// Revalidate every 60 seconds to ensure fresh CMS content
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const biography = await getBiography();
  const name = biography?.name || "";
  
  return {
    title: `Gallery | ${name}`,
    description: `Photo gallery of ${name}`,
  };
}

export default async function GalleryPage() {
  const biography = await getBiography();
  const socialMediaLinks = await getSocialMediaLinks();
  const categories = await getCategories();

  // Filter out categories that have no gallery items
  const categoriesWithItems = categories.filter(
    (category: any) => category.galleryItems && category.galleryItems.length > 0
  );

  return (
    <>
      <Navbar name={biography?.name} socialMediaLinks={socialMediaLinks} />
      <main className="min-h-screen" style={{ backgroundColor: '#222222' }}>
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <GalleryTabs categories={categoriesWithItems} />
        </Suspense>
      </main>
      <Footer name={biography?.name} socialMediaLinks={socialMediaLinks} />
    </>
  );
}

