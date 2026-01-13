import Image from "next/image";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeNavLinks from "./components/HomeNavLinks";
import BiographySection from "./components/BiographySection";
import OneLinerSection from "./components/OneLinerSection";

async function getBiography() {
  const biography = await client.fetch(
    `*[_type == "biography" && _id == "biography"][0]{
      name,
      oneLiner,
      backgroundImage,
      biography,
      epkDownload{
        asset->{
          url,
          originalFilename
        }
      }
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

export async function generateMetadata(): Promise<Metadata> {
  const biography = await getBiography();
  const name = biography?.name || "";
  
  return {
    title: name,
    description: biography?.oneLiner || `Official website of ${name}`,
  };
}

export default async function Home() {
  const biography = await getBiography();
  const socialMediaLinks = await getSocialMediaLinks();

  const backgroundImageUrl = biography?.backgroundImage
    ? urlFor(biography.backgroundImage).width(1920).height(1080).url()
    : null;

  return (
    <>
      {/* Navbar - Outside hero section for proper z-index stacking */}
      <Navbar name={biography?.name} socialMediaLinks={socialMediaLinks} />

      {/* Hero Section - Fixed/Sticky */}
      <div className="fixed inset-0 h-screen w-screen overflow-hidden z-0">
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

        {/* Navigation Links - Bottom Right */}
        <HomeNavLinks biography={biography} />
      </div>

      {/* One Liner Section - Transparent (50vw x 100vh) */}
      {biography?.oneLiner && (
        <OneLinerSection oneLiner={biography.oneLiner} />
      )}

      {/* Biography Section - Black Rectangle (Scrolls over hero) */}
      {biography?.biography && (
        <BiographySection 
          biography={biography.biography} 
          epkUrl={biography?.epkDownload?.asset?.url || null}
        />
      )}

      {/* Footer - Below biography section */}
      <div className="relative z-10">
        <Footer name={biography?.name} socialMediaLinks={socialMediaLinks} />
      </div>
    </>
  );
}
