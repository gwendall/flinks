"use client";

import styled, { createGlobalStyle } from "styled-components";
import { useSearchParams } from "next/navigation";
import { FarcasterSigner, fallbackFrameContext, signFrameAction } from "@frames.js/render";
import { useFrame } from "@frames.js/render/use-frame";
import { FrameImageNext } from "@frames.js/render/next";
import { FrameRenderer, StatusText } from "@/components/FrameRenderer";
import EmbedPageContainer from "@/components/EmbedPageContainer";
import useFrameUrl from "@/hooks/useFrameUrl";
import { isInIframe } from "@/utils/misc";
import parseMintTarget from "@/utils/parseMintTarget";

const FrameContainer = styled(EmbedPageContainer)``;

function FramePageInner({ url }: Readonly<{
    url: string;
}>) {
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
        // onMint({ target = '', ...args }) {
        //     try {
        //         const { eip, chain, contract, tokenId } = parseMintTarget(target);
        //         console.log("Minting", { target, eip, chain, contract, tokenId, args });
        //     } catch (err) {
        //         console.log('Error parsing asset id', err);
        //     }
        //     if (isInIframe) {
        //         window.parent.postMessage({
        //             type: 'flinkMint',
        //             url,
        //         }, "*");
        //     }
        // },
        onTransaction: async function (...args: any[]) {
            console.log("Transaction", args);
            if (isInIframe) {
                window.parent.postMessage({
                    type: 'flinkTx',
                    url,
                }, "*");
            }
            return null;
        }
    });
    return (
        <FrameRenderer
            frameState={frameState}
            FrameImage={FrameImageNext}
            enableImageDebugging
            allowPartialFrame
        />
    )
}

const FramePageGlobalStyle = createGlobalStyle`
    html, body, #__next {
        height: 100%;
        background-color: black;
    }
`;

export default function FrameClientPage() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url') as string;
    const { data: frameUrl } = useFrameUrl(url);
    return (
        <>
            <FramePageGlobalStyle />
            <FrameContainer>
                {frameUrl ? (
                    <FramePageInner url={frameUrl} />
                ) : (
                    <StatusText>Checking frame</StatusText>
                )}
            </FrameContainer>
        </>
    );
}