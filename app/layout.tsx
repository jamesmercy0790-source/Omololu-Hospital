import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES",
  description: "Official website of OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES in Ibadan, Oyo State, Nigeria.",
  icons: { icon: "/omololu_hospital_logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}