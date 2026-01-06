import { Suspense } from "react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectTabs from "./components/ProjectTabs";

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

async function getProjects() {
  const projects = await client.fetch(
    `*[_type == "project"] | order(date desc){
      _id,
      title,
      slug,
      category,
      date,
      releaseInfo,
      credits
    }`
  );
  return projects;
}

export async function generateMetadata(): Promise<Metadata> {
  const biography = await getBiography();
  const name = biography?.name || "";
  
  return {
    title: `Projects | ${name}`,
    description: `View projects by ${name}`,
  };
}

export default async function ProjectsPage() {
  const biography = await getBiography();
  const socialMediaLinks = await getSocialMediaLinks();
  const projects = await getProjects();

  return (
    <>
      <Navbar name={biography?.name} socialMediaLinks={socialMediaLinks} />
      <main className="min-h-screen px-6 py-24 md:px-12 lg:px-24" style={{ backgroundColor: '#222222' }}>
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <ProjectTabs projects={projects} />
        </Suspense>
      </main>
      <Footer name={biography?.name} socialMediaLinks={socialMediaLinks} />
    </>
  );
}

