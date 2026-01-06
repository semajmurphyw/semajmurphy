import Image from "next/image";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DownloadEPKButton from "./components/DownloadEPKButton";

async function getBiography() {
  const biography = await client.fetch(
    `*[_type == "biography" && _id == "biography"][0]{
      name,
      bioImage,
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
    title: `About | ${name}`,
    description: `Learn more about ${name}`,
  };
}

export default async function AboutPage() {
  const biography = await getBiography();
  const socialMediaLinks = await getSocialMediaLinks();

  const bioImageUrl = biography?.bioImage
    ? urlFor(biography.bioImage).width(800).height(1200).url()
    : null;

  const epkUrl = biography?.epkDownload?.asset?.url || null;

  return (
    <>
      <Navbar name={biography?.name} socialMediaLinks={socialMediaLinks} />
      <main className="min-h-screen px-6 py-24 md:px-12 lg:px-24" style={{ backgroundColor: '#222222' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Side - Biography Text */}
            <div className="order-2 lg:order-1">
              {biography?.biography && (
                <div className="text-white text-lg leading-relaxed [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2">
                  <PortableText value={biography.biography} />
                </div>
              )}
            </div>

            {/* Right Side - Sticky Bio Image and Download Button */}
            <div className="order-1 lg:order-2">
              <div className="sticky flex flex-col" style={{ top: '7.5vh', height: '100vh' }}>
                {bioImageUrl && (
                  <div className="relative w-full flex-shrink-0" style={{ height: '85vh', marginBottom: '7.5vh' }}>
                    <Image
                      src={bioImageUrl}
                      alt={biography?.name || "Bio"}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                {epkUrl && (
                  <div className="flex-shrink-0">
                    <DownloadEPKButton epkUrl={epkUrl} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer name={biography?.name} socialMediaLinks={socialMediaLinks} />
    </>
  );
}

