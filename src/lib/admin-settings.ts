import "server-only";

import { Redis } from "@upstash/redis";
import { revalidatePath, revalidateTag } from "next/cache";
import type {
  AboutContent,
  CPPlatform,
  CTA,
  Experience,
  Project,
  SectionId,
} from "@/types";
import { about } from "@/data/about";
import { competitive } from "@/data/competitive";
import { experiences } from "@/data/experience";
import { hero } from "@/data/hero";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/config";
import { profileSyncConfig } from "@/data/profile-sync";

export const ADMIN_SETTINGS_KEY = "portfolio:admin-settings:v1";
export const ADMIN_SETTINGS_UPDATED_KEY = "portfolio:admin-settings:last-updated";
export const ADMIN_SYNC_LAST_RUN_KEY = "portfolio:sync:last-run";

export interface AdminSettings {
  version: 1;
  visibility: {
    blogEnabled: boolean;
    competitiveEnabled: boolean;
    devProfileEnabled: boolean;
    dedicationEnabled: boolean;
    sections: SectionId[];
  };
  hero: {
    eyebrow: string;
    name: string;
    roles: string[];
    tagline: string;
    ctas: CTA[];
  };
  about: Pick<
    AboutContent,
    "heading" | "subheading" | "availability" | "location" | "paragraphs" | "resumeUrl"
  >;
  profiles: {
    competitive: Array<Pick<CPPlatform, "id" | "name" | "handle" | "url"> & { enabled: boolean }>;
  };
  portfolio: {
    projects: Array<
      Pick<Project, "id" | "title" | "description" | "liveUrl" | "repoUrl" | "featured"> & {
        hidden?: boolean;
        order: number;
      }
    >;
    experiences: Array<
      Pick<Experience, "role" | "company" | "period" | "current"> & {
        id: string;
        hidden?: boolean;
        order: number;
      }
    >;
  };
  theme: {
    accentColor: string;
    heroSceneEnabled: boolean;
    heroParticleDensity: "low" | "balanced" | "high";
  };
}

export interface AdminHealth {
  configured: boolean;
  ok: boolean;
  lastUpdated?: string;
  lastSync?: Record<string, string>;
  error?: string;
}

function redis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function defaultAdminSettings(): AdminSettings {
  return {
    version: 1,
    visibility: {
      blogEnabled: siteConfig.blogEnabled,
      competitiveEnabled: siteConfig.competitiveEnabled,
      devProfileEnabled: siteConfig.devProfileEnabled,
      dedicationEnabled: siteConfig.dedicationEnabled,
      sections: siteConfig.sections,
    },
    hero: {
      eyebrow: hero.eyebrow,
      name: hero.name,
      roles: hero.roles,
      tagline: hero.tagline,
      ctas: hero.ctas,
    },
    about: {
      heading: about.heading,
      subheading: about.subheading,
      availability: about.availability,
      location: about.location,
      paragraphs: about.paragraphs,
      resumeUrl: about.resumeUrl,
    },
    profiles: {
      competitive: competitive.platforms.map((platform) => ({
        id: platform.id,
        name: platform.name,
        handle: platform.handle,
        url: platform.url,
        enabled: true,
      })),
    },
    portfolio: {
      projects: projects.map((project, order) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        liveUrl: project.liveUrl,
        repoUrl: project.repoUrl,
        featured: project.featured,
        hidden: false,
        order,
      })),
      experiences: experiences.map((experience, order) => ({
        id: `${experience.company}-${experience.role}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        role: experience.role,
        company: experience.company,
        period: experience.period,
        current: experience.current,
        hidden: false,
        order,
      })),
    },
    theme: {
      accentColor: "#ff004f",
      heroSceneEnabled: true,
      heroParticleDensity: "balanced",
    },
  };
}

function mergeSettings(value: Partial<AdminSettings> | null | undefined): AdminSettings {
  const base = defaultAdminSettings();
  if (!value || value.version !== 1) return base;
  return {
    ...base,
    ...value,
    visibility: { ...base.visibility, ...value.visibility },
    hero: { ...base.hero, ...value.hero },
    about: { ...base.about, ...value.about },
    profiles: { ...base.profiles, ...value.profiles },
    portfolio: { ...base.portfolio, ...value.portfolio },
    theme: { ...base.theme, ...value.theme },
  };
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const client = redis();
  if (!client) return defaultAdminSettings();
  try {
    const stored = await client.get<Partial<AdminSettings>>(ADMIN_SETTINGS_KEY);
    return mergeSettings(stored);
  } catch {
    return defaultAdminSettings();
  }
}

export async function saveAdminSettings(settings: AdminSettings) {
  const client = redis();
  if (!client) throw new Error("Upstash Redis is not configured.");
  const normalized = mergeSettings(settings);
  const updatedAt = new Date().toISOString();
  await client.set(ADMIN_SETTINGS_KEY, normalized);
  await client.set(ADMIN_SETTINGS_UPDATED_KEY, updatedAt);
  await revalidateAdminSurfaces();
  return { settings: normalized, updatedAt };
}

export async function resetAdminSettings() {
  const client = redis();
  if (!client) throw new Error("Upstash Redis is not configured.");
  await client.del(ADMIN_SETTINGS_KEY);
  const updatedAt = new Date().toISOString();
  await client.set(ADMIN_SETTINGS_UPDATED_KEY, updatedAt);
  await revalidateAdminSurfaces();
  return { settings: defaultAdminSettings(), updatedAt };
}

export async function getAdminHealth(): Promise<AdminHealth> {
  const client = redis();
  if (!client) return { configured: false, ok: false, error: "Upstash Redis env vars are missing." };
  try {
    const [lastUpdated, lastSync] = await Promise.all([
      client.get<string>(ADMIN_SETTINGS_UPDATED_KEY),
      client.get<Record<string, string>>(ADMIN_SYNC_LAST_RUN_KEY),
    ]);
    return {
      configured: true,
      ok: true,
      lastUpdated: lastUpdated ?? undefined,
      lastSync: lastSync ?? undefined,
    };
  } catch (err) {
    return {
      configured: true,
      ok: false,
      error: err instanceof Error ? err.message : "Unable to reach Upstash Redis.",
    };
  }
}

export async function recordSyncRun(target: string) {
  const client = redis();
  if (!client) return;
  const current = (await client.get<Record<string, string>>(ADMIN_SYNC_LAST_RUN_KEY)) ?? {};
  await client.set(ADMIN_SYNC_LAST_RUN_KEY, {
    ...current,
    [target]: new Date().toISOString(),
  });
}

export async function revalidateAdminSurfaces() {
  for (const path of ["/", "/dev", "/competitive", "/dedication", "/owner"]) {
    revalidatePath(path);
  }
  for (const target of Object.values(profileSyncConfig.targets)) {
    for (const tag of target.tags) revalidateTag(tag);
  }
}

export function mergeSiteConfig(settings: AdminSettings) {
  return {
    ...siteConfig,
    blogEnabled: settings.visibility.blogEnabled,
    competitiveEnabled: settings.visibility.competitiveEnabled,
    devProfileEnabled: settings.visibility.devProfileEnabled,
    dedicationEnabled: settings.visibility.dedicationEnabled,
    sections: settings.visibility.sections,
  };
}

export function mergeHero(settings: AdminSettings) {
  return { ...hero, ...settings.hero };
}

export function mergeAbout(settings: AdminSettings): AboutContent {
  return { ...about, ...settings.about };
}

export function mergeCompetitive(settings: AdminSettings) {
  const configured = new Map(settings.profiles.competitive.map((platform) => [platform.id, platform]));
  return {
    ...competitive,
    platforms: competitive.platforms
      .map((platform) => {
        const override = configured.get(platform.id);
        if (!override?.enabled) return null;
        return {
          ...platform,
          handle: override.handle || platform.handle,
          url: override.url || platform.url,
        };
      })
      .filter((platform): platform is CPPlatform => platform != null),
  };
}

export function mergeProjects(settings: AdminSettings) {
  const configured = new Map(settings.portfolio.projects.map((project) => [project.id, project]));
  return projects
    .flatMap((project) => {
      const override = configured.get(project.id);
      if (override?.hidden) return [];
      return [{
        ...project,
        title: override?.title ?? project.title,
        description: override?.description ?? project.description,
        liveUrl: override?.liveUrl ?? project.liveUrl,
        repoUrl: override?.repoUrl ?? project.repoUrl,
        featured: override?.featured ?? project.featured,
        order: override?.order ?? 999,
      }];
    })
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...project }) => project);
}

export function mergeExperiences(settings: AdminSettings) {
  const configured = new Map(settings.portfolio.experiences.map((experience) => [experience.id, experience]));
  return experiences
    .flatMap((experience, index) => {
      const id = `${experience.company}-${experience.role}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const override = configured.get(id);
      if (override?.hidden) return [];
      return [{
        ...experience,
        role: override?.role ?? experience.role,
        company: override?.company ?? experience.company,
        period: override?.period ?? experience.period,
        current: override?.current ?? experience.current,
        order: override?.order ?? index,
      }];
    })
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...experience }) => experience);
}
