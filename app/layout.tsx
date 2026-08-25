import type { Metadata } from "next";
import Image from "next/image";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Tech & Career Talk 0.1 — Registration",
  description:
    "Register for Tech & Career Talk 0.1 — a one-day gathering for developers, designers, and builders working across the stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-body bg-ink text-paper antialiased">
        <header className="mx-auto max-w-5xl px-6 pt-6 sm:px-8">
          <Image
            src="/Logo.png"
            alt="Tech & Career Talk 0.1"
            width={220}
            height={80}
            priority
            className="h-auto w-48 object-contain"
          />
        </header>
        {children}
      </body>
    </html>
  );
}
