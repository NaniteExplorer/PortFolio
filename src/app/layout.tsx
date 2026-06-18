import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/config";
import { getAdminSettings, mergeAbout, mergeSiteConfig } from "@/lib/admin-settings";
import { buildMetadata, personJsonLd, websiteJsonLd } from "@/lib/seo";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata(),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
};

function hexToRgbTriplet(hex: string) {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return undefined;
  const value = Number.parseInt(normalized, 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAdminSettings();
  const mergedConfig = mergeSiteConfig(settings);
  const mergedAbout = mergeAbout(settings);
  const accent = hexToRgbTriplet(settings.theme.accentColor);

  return (
    <html
      lang="en"
      className={`${poppins.variable} dark`}
      style={accent ? ({ "--accent": accent } as React.CSSProperties) : undefined}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <ScrollProgress />
          <Navbar config={mergedConfig} />
          <main>{children}</main>
          <Footer config={mergedConfig} aboutContent={mergedAbout} />
        </ThemeProvider>
      </body>
    </html>
  );
}
