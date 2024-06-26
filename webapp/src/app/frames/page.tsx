"use client";

import EmbedPageContainer from "@/components/EmbedPageContainer";
// import { FrameUI, fallbackFrameContext } from "@frames.js/render";
// import { useFrame } from "@frames.js/render/use-frame";
// import { FrameImageNext } from "@frames.js/render/next";
import { useSearchParams } from "next/navigation";

export default function FramesPage() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url') as string;
    // const frameState = useFrame({
    //     // replace with your frame url
    //     homeframeUrl: url,
    //     // corresponds to the name of the route for POST in step 3
    //     frameActionProxy: "/frames",
    //     // corresponds to the name of the route for GET in step 3
    //     frameGetProxy: "/frames",
    //     frameContext: fallbackFrameContext,
    //     // map to your identity if you have one
    //     signerState: {
    //         // TODO: replace with your signer
    //         // signer: mockFarcasterSigner,
    //         hasSigner: false,
    //         onSignerlessFramePress: () => {
    //             // Implement me
    //             alert("A frame button was pressed without a signer.");
    //         },
    //         // @ts-ignore
    //         signFrameAction: () => {
    //             // alert("implement me.");
    //         },
    //     },
    // });
    return (
        <EmbedPageContainer>
            {/* <FrameUI
                frameState={frameState}
                theme={{}}
                FrameImage={FrameImageNext}
            /> */}
            <pre>{JSON.stringify({ url }, null, 2)}</pre>
        </EmbedPageContainer>
    )
}