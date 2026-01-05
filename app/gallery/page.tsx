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
      <main className="min-h-screen bg-white px-6 py-24 md:px-12 lg:px-24">
        <h1 className="mb-12 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">
          Gallery
        </h1>
        <GalleryTabs photos={photos} categories={categories} />
      </main>
      <Footer name={biography?.name} socialMediaLinks={socialMediaLinks} />
    </>
  );
}

