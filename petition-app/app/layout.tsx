import type { Metadata } from "next";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-serif",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Petition Your Representatives — Defend AI Safety Standards",
  description:
    "Generate personalized petitions to your congressional representatives urging oversight of the Department of War's actions against Anthropic and AI safety.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${sourceSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
