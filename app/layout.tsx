import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://omololuhospital.com"),
  title: {
    default: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES | Ibadan, Oyo State",
    template: "%s | OMOLOLU HOSPITAL",
  },
  description:
    "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES in Ibadan, Oyo State, Nigeria. Medical consultation, medical care, laboratory services and convenient hospital app access.",
  keywords: [
    "Omololu Hospital",
    "Omololu Hospital Ibadan",
    "Omololu Hospital and Diagnostic Services",
    "hospital in Ibadan",
    "hospital in Oyo State",
    "medical services Ibadan",
    "laboratory services Ibadan",
    "medical consultation Ibadan",
  ],
  applicationName: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES",
  authors: [{ name: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES" }],
  creator: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES",
  publisher: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES",
  alternates: {
    canonical: "https://omololuhospital.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://omololuhospital.com",
    siteName: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES",
    title: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES | Ibadan, Oyo State",
    description:
      "Quality healthcare, made simple. OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES in Ibadan, Oyo State, Nigeria.",
    images: [
      {
        url: "/photo_2026-09-26_02-25-49.jpg",
        width: 1200,
        height: 630,
        alt: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES | Ibadan, Oyo State",
    description:
      "Quality healthcare, made simple. OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES in Ibadan, Oyo State, Nigeria.",
    images: ["/photo_2026-09-26_02-25-49.jpg"],
  },
  icons: { icon: "/photo_2026-09-26_02-25-49.jpg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}