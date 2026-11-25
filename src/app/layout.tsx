import type { Metadata, Viewport } from "next";
import { Anton, Archivo, Yellowtail } from "next/font/google";
import { site } from "@/content";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });
const yellowtail = Yellowtail({ variable: "--font-yellowtail", subsets: ["latin"], weight: "400" });

const title = `${site.name} — ${site.tagline[0]}`;

export const metadata: Metadata = {
  title,
  description: site.intro,
  openGraph: { title, description: site.intro, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#060a1c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable} ${yellowtail.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
