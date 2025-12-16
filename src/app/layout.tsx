import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TesJor - Discover Hidden Cambodia",
  description:
    "Your gamified companion to explore authentic Cambodian experiences beyond Angkor Wat. Discover hidden villages, local cuisine, and cultural treasures.",
  keywords: [
    "Cambodia travel",
    "hidden gems",
    "Angkor Wat",
    "local experiences",
    "authentic Cambodia",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{ "--font-kantumruy": "Kantumruy Pro" } as React.CSSProperties}
    >
      <body className={`${poppins.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
