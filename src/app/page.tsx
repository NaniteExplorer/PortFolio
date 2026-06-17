import { getAdminSettings, mergeAbout, mergeExperiences, mergeHero, mergeProjects, mergeSiteConfig } from "@/lib/admin-settings";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { sectionRegistry } from "@/components/sections/registry";

/**
 * Home page. Renders sections in the order defined by `siteConfig.sections`,
 * so the entire page composition is data-driven — reorder or remove an id in
 * `data/config.ts` to change the page with zero code edits here.
 */
export default async function HomePage() {
  const settings = await getAdminSettings();
  const config = mergeSiteConfig(settings);
  const heroContent = mergeHero(settings);
  const aboutContent = mergeAbout(settings);
  const projectList = mergeProjects(settings);
  const experienceList = mergeExperiences(settings);

  return (
    <>
      {config.sections.map((id) => {
        if (id === "hero") return <Hero key={id} content={heroContent} settings={settings.theme} />;
        if (id === "about") return <About key={id} content={aboutContent} />;
        if (id === "projects") return <Projects key={id} items={projectList} />;
        if (id === "experience") return <Experience key={id} items={experienceList} />;
        const SectionComponent = sectionRegistry[id];
        return SectionComponent ? <SectionComponent key={id} /> : null;
      })}
    </>
  );
}
