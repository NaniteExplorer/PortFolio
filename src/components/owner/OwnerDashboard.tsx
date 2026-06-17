"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BadgeCheck,
  Brush,
  Code2,
  Eye,
  Github,
  LayoutDashboard,
  ListRestart,
  LogOut,
  Palette,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { AdminHealth, AdminSettings } from "@/lib/admin-settings";
import { ProfileRefreshButton } from "@/components/analytics/ProfileRefreshButton";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface OwnerDashboardProps {
  owner: {
    email: string;
    name?: string;
    picture?: string;
  };
  initialSettings: AdminSettings;
  health: AdminHealth;
}

type TabId = "overview" | "sync" | "visibility" | "profiles" | "content" | "portfolio" | "theme";

const TABS: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "sync", label: "Sync", icon: Activity },
  { id: "visibility", label: "Visibility", icon: Eye },
  { id: "profiles", label: "Profiles", icon: Code2 },
  { id: "content", label: "Content", icon: Sparkles },
  { id: "portfolio", label: "Portfolio", icon: BadgeCheck },
  { id: "theme", label: "Theme", icon: Palette },
];

export function OwnerDashboard({ owner, initialSettings, health }: OwnerDashboardProps) {
  const [active, setActive] = useState<TabId>("overview");
  const [settings, setSettings] = useState(initialSettings);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(next: AdminSettings) {
    setSettings(next);
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/owner/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Unable to save settings.");
      setSettings(body.settings);
      setDirty(false);
      setStatus("Saved changes and refreshed public pages.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/owner/settings/reset", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Unable to reset settings.");
      setSettings(body.settings);
      setDirty(false);
      setStatus("Reset to static defaults.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Unable to reset settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
      <aside className="space-y-5">
        <Card className="overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <div className="flex items-start gap-4">
            {owner.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={owner.picture}
                alt={owner.name ?? owner.email}
                className="h-14 w-14 rounded-2xl border border-border object-cover"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent">
                <ShieldCheck size={24} />
              </span>
            )}
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                <ShieldCheck size={13} />
                Owner
              </p>
              <h2 className="mt-3 truncate font-bold">{owner.name ?? "Portfolio Owner"}</h2>
              <p className="truncate text-xs text-muted">{owner.email}</p>
            </div>
          </div>
          <form action="/api/owner/auth/logout" method="post" className="mt-5">
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent">
              <LogOut size={15} />
              Sign out
            </button>
          </form>
        </Card>

        <nav className="rounded-2xl border border-border bg-surface p-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors last:mb-0",
                  active === tab.id
                    ? "bg-accent text-white"
                    : "text-muted hover:bg-surface-2 hover:text-fg"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Control Room
            </p>
            <h2 className="mt-1 text-xl font-bold">{TABS.find((tab) => tab.id === active)?.label}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {dirty && (
              <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300">
                Unsaved changes
              </span>
            )}
            <button
              onClick={reset}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
            >
              <ListRestart size={15} />
              Reset
            </button>
            <button
              onClick={save}
              disabled={saving || !dirty}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-2 disabled:opacity-60"
            >
              <Save size={15} />
              {saving ? "Saving" : "Save changes"}
            </button>
          </div>
        </div>

        {status && (
          <div className="rounded-2xl border border-border bg-surface-2/60 p-3 text-sm text-muted">
            {status}
          </div>
        )}

        {active === "overview" && <OverviewPanel health={health} settings={settings} />}
        {active === "sync" && <SyncPanel health={health} />}
        {active === "visibility" && <VisibilityPanel settings={settings} update={update} />}
        {active === "profiles" && <ProfilesPanel settings={settings} update={update} />}
        {active === "content" && <ContentPanel settings={settings} update={update} />}
        {active === "portfolio" && <PortfolioPanel settings={settings} update={update} />}
        {active === "theme" && <ThemePanel settings={settings} update={update} />}
      </section>
    </div>
  );
}

function OverviewPanel({ health, settings }: { health: AdminHealth; settings: AdminSettings }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <MetricCard icon={<Settings2 size={18} />} label="Database" value={health.ok ? "Connected" : "Fallback"} />
      <MetricCard icon={<Eye size={18} />} label="Sections" value={`${settings.visibility.sections.length} active`} />
      <MetricCard icon={<Brush size={18} />} label="Accent" value={settings.theme.accentColor} />
      <Card className="lg:col-span-3">
        <h3 className="font-bold">Runtime safety</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          Public pages merge Redis settings over static TypeScript data. If Redis is missing or down,
          the portfolio continues to render from the checked-in defaults.
        </p>
      </Card>
    </div>
  );
}

function SyncPanel({ health }: { health: AdminHealth }) {
  const lastSync = health.lastSync ?? {};
  const syncTotal = 10;
  const devProgress = lastSync.dev ? 10 : 1;
  const competitiveProgress = lastSync.competitive ? 10 : 1;
  const allProgress = lastSync.dev && lastSync.competitive ? 10 : lastSync.dev || lastSync.competitive ? 5 : 1;
  const [syncingAll, setSyncingAll] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function syncAll() {
    setSyncingAll(true);
    setMessage(null);
    try {
      for (const target of ["dev", "competitive"] as const) {
        const res = await fetch("/api/profile-sync/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target }),
        });
        if (!res.ok) throw new Error(`Unable to refresh ${target}.`);
      }
      setMessage("Dev and CP caches refreshed.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to sync all.");
    } finally {
      setSyncingAll(false);
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      <SyncCard title="Developer" target="dev" last={lastSync.dev} progress={`${devProgress}/${syncTotal}`} icon={<Github size={20} />} />
      <SyncCard title="Competitive" target="competitive" last={lastSync.competitive} progress={`${competitiveProgress}/${syncTotal}`} icon={<Code2 size={20} />} />
      <Card>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold">Sync All</h3>
          <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs font-semibold text-accent">
            sync {allProgress}/{syncTotal}
          </span>
        </div>
        <p className="mt-2 min-h-[3rem] text-sm text-muted">Refresh both profile caches and the dedication graph.</p>
        {message && <p className="mt-3 text-xs text-muted">{message}</p>}
        <button
          onClick={syncAll}
          disabled={syncingAll}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-2 disabled:opacity-60"
        >
          <Activity size={15} />
          {syncingAll ? "Syncing" : "Sync all"}
        </button>
      </Card>
    </div>
  );
}

function VisibilityPanel({ settings, update }: PanelProps) {
  const allSections = ["hero", "about", "skills", "competitive", "dedication", "experience", "projects", "contact"] as const;
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <h3 className="mb-4 font-bold">Routes</h3>
        <Toggle label="Blog" checked={settings.visibility.blogEnabled} onChange={(checked) => update({ ...settings, visibility: { ...settings.visibility, blogEnabled: checked } })} />
        <Toggle label="Competitive" checked={settings.visibility.competitiveEnabled} onChange={(checked) => update({ ...settings, visibility: { ...settings.visibility, competitiveEnabled: checked } })} />
        <Toggle label="Developer Profile" checked={settings.visibility.devProfileEnabled} onChange={(checked) => update({ ...settings, visibility: { ...settings.visibility, devProfileEnabled: checked } })} />
        <Toggle label="Dedication" checked={settings.visibility.dedicationEnabled} onChange={(checked) => update({ ...settings, visibility: { ...settings.visibility, dedicationEnabled: checked } })} />
      </Card>
      <Card>
        <h3 className="mb-4 font-bold">Homepage sections</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {allSections.map((section) => (
            <Toggle
              key={section}
              label={section}
              checked={settings.visibility.sections.includes(section)}
              onChange={(checked) => {
                const sections = checked
                  ? [...settings.visibility.sections, section]
                  : settings.visibility.sections.filter((item) => item !== section);
                update({ ...settings, visibility: { ...settings.visibility, sections } });
              }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function ProfilesPanel({ settings, update }: PanelProps) {
  return (
    <Card>
      <h3 className="mb-4 font-bold">Competitive platforms</h3>
      <div className="grid gap-3">
        {settings.profiles.competitive.map((platform, index) => (
          <div key={platform.id} className="grid gap-3 rounded-2xl border border-border bg-surface-2/40 p-4 lg:grid-cols-[120px_1fr_1fr_auto] lg:items-center">
            <Toggle
              label={platform.name}
              checked={platform.enabled}
              onChange={(enabled) => {
                const next = [...settings.profiles.competitive];
                next[index] = { ...platform, enabled };
                update({ ...settings, profiles: { ...settings.profiles, competitive: next } });
              }}
            />
            <Input value={platform.handle} onChange={(handle) => {
              const next = [...settings.profiles.competitive];
              next[index] = { ...platform, handle };
              update({ ...settings, profiles: { ...settings.profiles, competitive: next } });
            }} placeholder="Handle" />
            <Input value={platform.url} onChange={(url) => {
              const next = [...settings.profiles.competitive];
              next[index] = { ...platform, url };
              update({ ...settings, profiles: { ...settings.profiles, competitive: next } });
            }} placeholder="Profile URL" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function ContentPanel({ settings, update }: PanelProps) {
  const availabilityOptions = [
    "Open to work",
    "Available for freelance",
    "Available for new opportunities",
    "Busy, but open to selective work",
    "Not available right now",
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <h3 className="mb-4 font-bold">Hero</h3>
        <Input label="Eyebrow" value={settings.hero.eyebrow} onChange={(eyebrow) => update({ ...settings, hero: { ...settings.hero, eyebrow } })} />
        <Input label="Name" value={settings.hero.name} onChange={(name) => update({ ...settings, hero: { ...settings.hero, name } })} />
        <Textarea label="Roles, one per line" value={settings.hero.roles.join("\n")} onChange={(value) => update({ ...settings, hero: { ...settings.hero, roles: value.split("\n").map((role) => role.trim()).filter(Boolean) } })} />
        <Textarea label="Tagline" value={settings.hero.tagline} onChange={(tagline) => update({ ...settings, hero: { ...settings.hero, tagline } })} />
      </Card>
      <Card>
        <h3 className="mb-4 font-bold">About</h3>
        <Input label="Heading" value={settings.about.heading} onChange={(heading) => update({ ...settings, about: { ...settings.about, heading } })} />
        <Input label="Subheading" value={settings.about.subheading ?? ""} onChange={(subheading) => update({ ...settings, about: { ...settings.about, subheading } })} />
        <label className="mb-3 block text-sm font-semibold">
          Current status
          <select
            value={settings.about.availability ?? ""}
            onChange={(event) => update({ ...settings, about: { ...settings.about, availability: event.target.value } })}
            className="mt-2 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none focus:border-accent"
          >
            {availabilityOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <Input label="Custom status" value={settings.about.availability ?? ""} onChange={(availability) => update({ ...settings, about: { ...settings.about, availability } })} />
        <Input label="Location" value={settings.about.location ?? ""} onChange={(location) => update({ ...settings, about: { ...settings.about, location } })} />
        <Input label="Resume URL" value={settings.about.resumeUrl ?? ""} onChange={(resumeUrl) => update({ ...settings, about: { ...settings.about, resumeUrl } })} />
        <Textarea label="Paragraphs, separated by blank lines" value={settings.about.paragraphs.join("\n\n")} onChange={(value) => update({ ...settings, about: { ...settings.about, paragraphs: value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean) } })} />
      </Card>
    </div>
  );
}

function PortfolioPanel({ settings, update }: PanelProps) {
  return (
    <div className="grid gap-5">
      <Card>
        <h3 className="mb-4 font-bold">Projects</h3>
        <div className="grid gap-3">
          {settings.portfolio.projects.map((project, index) => (
            <CompactPortfolioRow
              key={project.id}
              title={project.title}
              hidden={project.hidden}
              featured={project.featured}
              order={project.order}
              onChange={(patch) => {
                const next = [...settings.portfolio.projects];
                next[index] = { ...project, ...patch };
                update({ ...settings, portfolio: { ...settings.portfolio, projects: next } });
              }}
            />
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 font-bold">Experience</h3>
        <div className="grid gap-3">
          {settings.portfolio.experiences.map((experience, index) => (
            <CompactPortfolioRow
              key={experience.id}
              title={`${experience.role} - ${experience.company}`}
              hidden={experience.hidden}
              featured={experience.current}
              featuredLabel="Current"
              order={experience.order}
              onChange={(patch) => {
                const next = [...settings.portfolio.experiences];
                next[index] = { ...experience, current: patch.featured ?? experience.current, hidden: patch.hidden, order: patch.order ?? experience.order };
                update({ ...settings, portfolio: { ...settings.portfolio, experiences: next } });
              }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function ThemePanel({ settings, update }: PanelProps) {
  return (
    <Card>
      <h3 className="mb-4 font-bold">Theme controls</h3>
      <Input label="Accent color" value={settings.theme.accentColor} onChange={(accentColor) => update({ ...settings, theme: { ...settings.theme, accentColor } })} />
      <Toggle label="Hero 3D scene" checked={settings.theme.heroSceneEnabled} onChange={(heroSceneEnabled) => update({ ...settings, theme: { ...settings.theme, heroSceneEnabled } })} />
      <label className="mt-4 block text-sm font-semibold">
        Hero density
        <select
          value={settings.theme.heroParticleDensity}
          onChange={(event) => update({ ...settings, theme: { ...settings.theme, heroParticleDensity: event.target.value as AdminSettings["theme"]["heroParticleDensity"] } })}
          className="mt-2 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none focus:border-accent"
        >
          <option value="low">Low</option>
          <option value="balanced">Balanced</option>
          <option value="high">High</option>
        </select>
      </label>
    </Card>
  );
}

interface PanelProps {
  settings: AdminSettings;
  update: (settings: AdminSettings) => void;
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        {icon}
      </div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </Card>
  );
}

function SyncCard({ title, target, last, progress, icon }: { title: string; target: "dev" | "competitive"; last?: string; progress: string; icon: React.ReactNode }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
          {icon}
        </div>
        <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs font-semibold text-accent">
          sync {progress}
        </span>
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 min-h-[3rem] text-sm text-muted">
        {last ? `Last refreshed ${new Date(last).toLocaleString()}` : "No manual refresh recorded yet."}
      </p>
      <div className="mt-5">
        <ProfileRefreshButton target={target} alwaysVisible />
      </div>
    </Card>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked?: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-2/50 px-3 py-2 text-sm">
      <span className="font-medium capitalize">{label}</span>
      <input type="checkbox" checked={!!checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[rgb(var(--accent))]" />
    </label>
  );
}

function Input({ label, value, onChange, placeholder }: { label?: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="mb-3 block text-sm font-semibold">
      {label && <span>{label}</span>}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none focus:border-accent" />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mb-3 block text-sm font-semibold">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm leading-6 text-fg outline-none focus:border-accent" />
    </label>
  );
}

function CompactPortfolioRow({
  title,
  hidden,
  featured,
  featuredLabel = "Featured",
  order,
  onChange,
}: {
  title: string;
  hidden?: boolean;
  featured?: boolean;
  featuredLabel?: string;
  order: number;
  onChange: (patch: { hidden?: boolean; featured?: boolean; order?: number }) => void;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-surface-2/40 p-3 sm:grid-cols-[1fr_auto_auto_90px] sm:items-center">
      <p className="font-semibold">{title}</p>
      <Toggle label="Hidden" checked={hidden} onChange={(checked) => onChange({ hidden: checked })} />
      <Toggle label={featuredLabel} checked={featured} onChange={(checked) => onChange({ featured: checked })} />
      <input type="number" value={order} onChange={(event) => onChange({ order: Number(event.target.value) })} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-accent" />
    </div>
  );
}
