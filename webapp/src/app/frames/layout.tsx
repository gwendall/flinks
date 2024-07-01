import { Inter } from "next/font/google";
import React from "react";
import NeynarContainer from "@/components/NeynarContainer";
import ReservoirProvider from "@/components/ReservoirProvider";
import "@neynar/react/dist/style.css";

const inter = Inter({ subsets: ["latin"] });

export default function FrameLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NeynarContainer>
            <ReservoirProvider>
                <React.Suspense fallback={null}>
                    {children}
                </React.Suspense>
            </ReservoirProvider>
        </NeynarContainer>
    );
}