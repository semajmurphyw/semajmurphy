import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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

export default async function Home() {
  const biography = await getBiography();
  const socialMediaLinks = await getSocialMediaLinks();

  const backgroundImageUrl = biography?.backgroundImage
    ? urlFor(biography.backgroundImage).width(1920).height(1080).url()
    : null;

  return (
    <>
      {/* Hero Section - 100vh */}
      <div className="relative h-screen w-screen overflow-hidden">
        {/* Background Image */}
        {backgroundImageUrl && (
          <div className="absolute inset-0">
            <Image
              src={backgroundImageUrl}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Navbar */}
        <Navbar name={biography?.name} socialMediaLinks={socialMediaLinks} />

        {/* Navigation Links - Bottom Right */}
        <nav className="absolute bottom-0 right-0 z-10 flex flex-col items-end gap-4 p-6 md:p-8">
          <a
            href="#"
            className="text-2xl font-medium uppercase text-white drop-shadow-lg transition-all hover:underline md:text-3xl"
          >
            About
          </a>
          <a
            href="#"
            className="text-2xl font-medium uppercase text-white drop-shadow-lg transition-all hover:underline md:text-3xl"
          >
            Videos
          </a>
          <a
            href="#"
            className="text-2xl font-medium uppercase text-white drop-shadow-lg transition-all hover:underline md:text-3xl"
          >
            Projects
          </a>
          <a
            href="#"
            className="text-2xl font-medium uppercase text-white drop-shadow-lg transition-all hover:underline md:text-3xl"
          >
            Press
          </a>
          <Link
            href="/gallery"
            className="text-2xl font-medium uppercase text-white drop-shadow-lg transition-all hover:underline md:text-3xl"
          >
            Gallery
          </Link>
        </nav>
      </div>

      {/* Footer - Below hero section */}
      <Footer name={biography?.name} socialMediaLinks={socialMediaLinks} />
    </>
  );
}
