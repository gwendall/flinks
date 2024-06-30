"use client";

import { reservoirChains } from '@reservoir0x/reservoir-sdk';
import { ReservoirKitProvider, darkTheme } from '@reservoir0x/reservoir-kit-ui';
import { WagmiProvider, http, createConfig } from 'wagmi';
import { base, mainnet, zora, optimism, zkSync, arbitrum, blast, bsc, degen, polygon, sei } from 'wagmi/chains';

const RESERVOIR_API_KEY = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY as string;

const theme = darkTheme({
    // headlineFont: "Sans Serif",
    // font: "Serif",
    headlineFont: '"Inter", sans-serif',
    font: '"Inter", sans-serif',
    primaryColor: "#ff5cff",
    primaryHoverColor: "#ff94ff",
});

const wagmiConfig = createConfig({
    chains: [
        base,
        mainnet,
        zora,
        optimism,
        zkSync,
        arbitrum,
        blast,
        bsc,
        degen,
        polygon,
        sei,
    ],
    transports: {
        [base.id]: http(),
        [mainnet.id]: http(),
        [zora.id]: http(),
        [optimism.id]: http(),
        [zkSync.id]: http(),
        [arbitrum.id]: http(),
        [blast.id]: http(),
        [bsc.id]: http(),
        [degen.id]: http(),
        [polygon.id]: http(),
        [sei.id]: http(),
    },
});

const reservoirConfig = {
    apiKey: RESERVOIR_API_KEY,
    chains: [
        reservoirChains.base,
        reservoirChains.mainnet,
        reservoirChains.zora,
        reservoirChains.optimism,
        reservoirChains.zkSync,
        reservoirChains.arbitrum,
        reservoirChains.blast,
        reservoirChains.bsc,
        reservoirChains.degen,
        reservoirChains.polygon,
        reservoirChains.sei,
    ].map((chain) => ({
        ...chain,
        active: chain.name === "mainnet",
    })),
    source: "flinks.gg"
};

export default function ReservoirProvider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <ReservoirKitProvider
                options={reservoirConfig}
                theme={theme}
            >
                {children}
            </ReservoirKitProvider>
        </WagmiProvider>
    );
}