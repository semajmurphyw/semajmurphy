import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactForm from "./components/ContactForm";

async function getBiography() {
  const biography = await client.fetch(
    `*[_type == "biography" && _id == "biography"][0]{
      name,
      contactImage
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
    title: `Contact | ${name}`,
    description: `Contact ${name}`,
  };
}

export default async function ContactPage() {
  const biography = await getBiography();
  const socialMediaLinks = await getSocialMediaLinks();

  const contactImageUrl = biography?.contactImage
    ? urlFor(biography.contactImage).width(1200).height(1800).url()
    : null;

  return (
    <>
      <Navbar name={biography?.name} socialMediaLinks={socialMediaLinks} />
      <main className="min-h-screen pb-24" style={{ backgroundColor: "#222222" }}>
        <div className="w-full flex">
          {/* Left Side - Content (67vw) */}
          <div className="w-full md:w-[67vw] flex-shrink-0 pt-48 pb-48 px-6 md:px-12 lg:px-24">
            <h1 className="text-white text-4xl md:text-6xl leading-tight lg:text-7xl font-bold mb-12">
              Contact
            </h1>

            <ContactForm />
          </div>

          {/* Right Side - Sticky Contact Image (33vw, 100vh) */}
          {contactImageUrl ? (
            <div
              className="hidden md:block w-[33vw] flex-shrink-0 sticky top-0"
              style={{ height: "100vh" }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={contactImageUrl}
                  alt="Contact"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="hidden md:block w-[33vw] flex-shrink-0" />
          )}
        </div>
      </main>
      <Footer name={biography?.name} socialMediaLinks={socialMediaLinks} />
    </>
  );
}
