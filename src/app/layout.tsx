import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COMBO • Developer Cloud Kits & Agent Utilities (combo.sh)",
  description:
    "High-performance asset storage via presigned URLs, studio voiceover generation, and speech transcription for automated agent workflows.",
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
