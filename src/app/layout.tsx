import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/content";
import { THEMES } from "@/components/themes";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = `${site.name} — ${site.tagline[0]}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.intro,
  openGraph: { title, description: site.intro, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#060a1c",
};

// Apply the saved theme before first paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(${JSON.stringify(
  THEMES.map((t) => t.id),
)}.indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="gold" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
