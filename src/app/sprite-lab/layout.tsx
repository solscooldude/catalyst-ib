import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sprite review",
  description: "Unlisted sprite review grid for art feedback.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function SpriteLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
