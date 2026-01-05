import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface SocialMediaLink {
  _id: string;
  platformName: string;
  url: string;
  icon?: any;
}

interface NavbarProps {
  name?: string;
  socialMediaLinks?: SocialMediaLink[];
}

export default function Navbar({ name, socialMediaLinks }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-between p-6 md:p-8">
      {/* Name - Top Left */}
      {name && (
        <h1 className="text-2xl font-semibold text-white drop-shadow-lg md:text-3xl lg:text-4xl">
          {name}
        </h1>
      )}

      {/* Social Media Icons - Top Right */}
      {socialMediaLinks && socialMediaLinks.length > 0 && (
        <div className="flex gap-4">
          {socialMediaLinks.map((link) => {
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
    </nav>
  );
}

