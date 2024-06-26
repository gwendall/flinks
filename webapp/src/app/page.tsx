import React from "react"
import type { Metadata } from "next";
import HomePageClient from "./client";

export default function HomePageServer() {
  return <HomePageClient />
}

export const metadata: Metadata = {
  title: "Flinks | Frames across the web",
  description: "Interact with Farcaster Frames, all across the web.",
};
