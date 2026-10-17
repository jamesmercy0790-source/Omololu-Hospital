import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://omololuhospital.com"),
  title: { default: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES | Ibadan, Oyo State", template: "%s | OMOLOLU HOSPITAL" },
  description: "Omololu Hospital and Diagnostic Services provides quality 24-hour healthcare, emergency services, maternity care, surgery, laboratory tests and ultrasound services in Akobo, Ibadan.",
  keywords: ["Omololu Hospital", "hospital in Akobo Ibadan", "24-hour hospital in Ibadan", "emergency hospital Akobo", "maternity hospital Ibadan", "ultrasound scan Ibadan", "medical laboratory Akobo", "private hospital Ibadan", "Omololu Hospital and Diagnostic Services"],
  applicationName: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES",
  authors: [{ name: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES" }],
  creator: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES",
  publisher: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: {
    type: "website", url: "https://omololuhospital.com", siteName: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES",
    title: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES | Ibadan, Oyo State",
    description: "Quality Healthcare for You. 24-hour medical, emergency, maternity and diagnostic services in Akobo, Ibadan.",
    images: [{ url: "/photo_2026-09-26_02-25-49.jpg", width: 1200, height: 630, alt: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES" }]
  },
  twitter: { card: "summary_large_image", title: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES | Ibadan, Oyo State", description: "Quality Healthcare for You. 24-hour medical and diagnostic services in Akobo, Ibadan.", images: ["/photo_2026-09-26_02-25-49.jpg"] },
  icons: { icon: "/photo_2026-09-26_02-25-49.jpg" },
  verification: { google: "LZoXCBzcz-6VpqPaBfJBto71SeSPBWPYyaj8WS2CWtM" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}