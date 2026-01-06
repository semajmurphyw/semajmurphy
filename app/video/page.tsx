import { Suspense } from "react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoTabs from "./components/VideoTabs";

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

async function getVideos() {
  const videos = await client.fetch(
    `*[_type == "video"] | order(date desc){
      _id,
      title,
      youtubeLink,
      date,
      category
    }`
  );
  return videos;
}

export async function generateMetadata(): Promise<Metadata> {
  const biography = await getBiography();
  const name = biography?.name || "";
  
  return {
    title: `Videos | ${name}`,
    description: `Watch videos featuring ${name}`,
  };
}

export default async function VideoPage() {
  const biography = await getBiography();
  const socialMediaLinks = await getSocialMediaLinks();
  const videos = await getVideos();

  return (
    <>
      <Navbar name={biography?.name} socialMediaLinks={socialMediaLinks} />
      <main className="min-h-screen px-6 py-24 md:px-12 lg:px-24" style={{ backgroundColor: '#222222' }}>
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <VideoTabs videos={videos} />
        </Suspense>
      </main>
      <Footer name={biography?.name} socialMediaLinks={socialMediaLinks} />
    </>
  );
}

