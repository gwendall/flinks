"use client";

import { Inter, Roboto } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyle from "@/components/GlobalStyle";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import React from "react";
import NeynarContainer from "@/components/NeynarContainer";
import "./globals.css";
import "@neynar/react/dist/style.css";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "700"]
});

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
            <StyledComponentsRegistry>
              <GlobalStyle />
              <React.Suspense fallback={null}>
                {children}
              </React.Suspense>
            </StyledComponentsRegistry>
          </ReactQueryProvider>
        </NeynarContainer>
      </body>
    </html>
  );
}
