import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject, getAdjacentProject } from "@/content/projects";
import { CaseStudy } from "@/components/case-study/case-study";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${project.subtitle}`,
      description: project.summary,
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getAdjacentProject(slug);

  return <CaseStudy project={project} next={next} />;
}
