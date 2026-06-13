import { siteConfig } from "@/data/config";
import { sectionRegistry } from "@/components/sections/registry";

/**
 * Home page. Renders sections in the order defined by `siteConfig.sections`,
 * so the entire page composition is data-driven — reorder or remove an id in
 * `data/config.ts` to change the page with zero code edits here.
 */
export default function HomePage() {
  return (
    <>
      {siteConfig.sections.map((id) => {
        const SectionComponent = sectionRegistry[id];
        return SectionComponent ? <SectionComponent key={id} /> : null;
      })}
    </>
  );
}
