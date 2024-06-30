import { Inter } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyle from "@/components/GlobalStyle";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import React from "react";
import type { Metadata } from "next";
import { appUrl } from "@/utils/const";
import NeynarContainer from "@/components/NeynarContainer";
import "./globals.css";
import "@neynar/react/dist/style.css";
import ReservoirProvider from "@/components/ReservoirProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NeynarContainer>
          <ReactQueryProvider>
            <ReservoirProvider>
              <StyledComponentsRegistry>
                <GlobalStyle />
                <React.Suspense fallback={null}>
                  {children}
                </React.Suspense>
              </StyledComponentsRegistry>
            </ReservoirProvider>
          </ReactQueryProvider>
        </NeynarContainer>
      </body>
    </html>
  );
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
