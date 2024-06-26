"use client";

import { FarcasterSigner, fallbackFrameContext, signFrameAction } from "@frames.js/render";
import { useFrame } from "@frames.js/render/use-frame";
import { FrameImageNext } from "@frames.js/render/next";
import { useSearchParams } from "next/navigation";
import EmbedPageContainer from "@/components/EmbedPageContainer";
import styled from "styled-components";
import { FrameRenderer } from "@/components/FrameRenderer";

const FrameContainer = styled(EmbedPageContainer)``;

export default function FrameClientPage() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url') as string;
    const farcasterSigner: FarcasterSigner = {
        fid: 1,
        status: 'approved',
        publicKey:
            "0x00000000000000000000000000000000000000000000000000000000000000000",
        privateKey:
            "0x00000000000000000000000000000000000000000000000000000000000000000",
    };
    const frameState = useFrame({
        // replace with your frame url
        homeframeUrl: url,
        // corresponds to the name of the route for POST in step 3
        frameActionProxy: "/api/frames/render",
        connectedAddress: undefined,
        // corresponds to the name of the route for GET in step 3
        frameGetProxy: "/api/frames/render",
        frameContext: fallbackFrameContext,
        // map to your identity if you have one
        signerState: {
            hasSigner: farcasterSigner !== undefined,
            signer: farcasterSigner,
            onSignerlessFramePress: () => {
                // Only run if `hasSigner` is set to `false`
                // This is a good place to throw an error or prompt the user to login
                alert("A frame button was pressed without a signer. Perhaps you want to prompt a login");
            },
            signFrameAction: signFrameAction,
        },
    });
    return (
        <FrameContainer>
            <FrameRenderer
                frameState={frameState}
                FrameImage={FrameImageNext}
                enableImageDebugging
            />
        </FrameContainer>
    )
}