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

async function getPhotoGallery() {
  const photos = await client.fetch(
    `*[_type == "photoGallery"] | order(date desc){
      _id,
      title,
      image,
      date,
      category->{
        _id,
        title,
        slug
      }
    }`
  );
  return photos;
}

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
  const photos = await getPhotoGallery();

  // Get unique categories from photos
  const categoryMap = new Map();
  photos.forEach((photo: any) => {
    if (photo.category && !categoryMap.has(photo.category._id)) {
      categoryMap.set(photo.category._id, photo.category);
    }
  });
  const categories = Array.from(categoryMap.values());

  return (
    <>
      <Navbar name={biography?.name} socialMediaLinks={socialMediaLinks} />
      <main className="min-h-screen" style={{ backgroundColor: '#222222' }}>
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <GalleryTabs photos={photos} categories={categories} />
        </Suspense>
      </main>
      <Footer name={biography?.name} socialMediaLinks={socialMediaLinks} />
    </>
  );
}

