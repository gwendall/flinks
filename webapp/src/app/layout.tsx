"use client";

import { Inter } from "next/font/google";
import { NeynarContextProvider, Theme } from "@neynar/react";
import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyle from "@/components/GlobalStyle";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import "./globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NeynarContextProvider
          settings={{
            clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
            defaultTheme: Theme.Dark,
            eventsCallbacks: {
              onAuthSuccess: (...args) => {
                console.log("Auth success", args);
              },
              onSignout(...args) {
                console.log("Signout", args);
              },
            },
          }}
        >
          <ReactQueryProvider>
            <StyledComponentsRegistry>
              <GlobalStyle />
              <React.Suspense fallback={null}>
                {children}
              </React.Suspense>
            </StyledComponentsRegistry>
          </ReactQueryProvider>
        </NeynarContextProvider>
      </body>
    </html>
  );
}
