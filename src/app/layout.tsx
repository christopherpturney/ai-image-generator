import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Image Generator",
  description: "Generate amazing images with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
