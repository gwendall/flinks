import React from "react"
import type { Metadata } from "next";
import HomePageClient from "./client";
import { appUrl } from "@/utils/const";

export default function HomePageServer() {
  return <HomePageClient />
}

export const metadata: Metadata = {
  title: "Flinks | Frames across the web",
  description: "Interact with Farcaster Frames, all across the web.",
  metadataBase: new URL(appUrl),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: '/logo.png',
  },
  twitter: {
    title: "Flinks | Frames across the web",
    description: "Interact with Farcaster Frames, all across the web.",
    images: ['/logo.png'],
    creator: '@gwendall',
    card: 'summary_large_image',
  }

};
