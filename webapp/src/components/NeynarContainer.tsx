"use client";

import { NeynarContextProvider, Theme } from "@neynar/react";

export default function NeynarContainer({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NeynarContextProvider
            settings={{
                clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
                defaultTheme: Theme.Dark,
                // eventsCallbacks: {
                //     onAuthSuccess: (...args) => {
                //         console.log("Auth success", args);
                //     },
                //     onSignout(...args) {
                //         console.log("Signout", args);
                //     },
                // },
            }}
        >
            {children}
        </NeynarContextProvider>
    )
}