"use client";

import Link from "next/link";
import { PortableText } from "@portabletext/react";

interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  category: string;
  date: string;
  releaseInfo: any;
  credits: any;
}

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        No projects found in this category.
      </p>
    );
  }

  return (
    <div className="w-full space-y-24">
      {projects.map((project) => {
        return (
          <div key={project._id} className="w-full">
            <Link href={`/projects/${project.slug.current}`}>
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-6 hover:underline transition-all cursor-pointer">
                {project.title}
              </h2>
            </Link>
            {project.credits && (
              <div className="text-white text-lg leading-relaxed [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2">
                <PortableText value={project.credits} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

