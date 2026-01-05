import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface SocialMediaLink {
  _id: string;
  platformName: string;
  url: string;
  icon?: any;
}

interface FooterProps {
  name?: string;
  socialMediaLinks?: SocialMediaLink[];
}

export default function Footer({ name, socialMediaLinks }: FooterProps) {
  // Get first 2 social media links
  const displayLinks = socialMediaLinks?.slice(0, 2) || [];

  return (
    <footer className="relative flex w-full flex-col items-center justify-center gap-4 bg-black p-6 md:p-8">
      {/* Name - Centered */}
      {name && (
        <h2 className="text-xl font-semibold text-white drop-shadow-lg md:text-2xl lg:text-3xl">
          {name}
        </h2>
      )}

      {/* Social Media Icons - Centered, First 2 */}
      {displayLinks.length > 0 && (
        <div className="flex gap-4">
          {displayLinks.map((link) => {
            const iconUrl = link.icon
              ? urlFor(link.icon).width(32).height(32).url()
              : null;
            return (
              <a
                key={link._id || link.platformName}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
                aria-label={link.platformName}
              >
                {iconUrl ? (
                  <Image
                    src={iconUrl}
                    alt={link.platformName}
                    width={32}
                    height={32}
                    className="drop-shadow-lg"
                  />
                ) : (
                  <span className="text-white drop-shadow-lg">
                    {link.platformName}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </footer>
  );
}

