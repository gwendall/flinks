import { Metadata } from "next";
import FrameClientPage from "./client";
import axios from "axios";
import { Frame } from "frames.js";

export default function FrameServerPage() {
    return <FrameClientPage />;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
console.log("apiUrl: ", apiUrl);

type Props = {
    params: { id: string }
    searchParams: {
        url: string;
    }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { url } = searchParams || {};
    if (!url) {
        return {
            title: "Frame Server Page",
            description: "A page that renders a frame on the server",
        };
    }
    const frameDataUrl = apiUrl + "/frames?url=" + encodeURIComponent(url);
    const frameData: {
        status: string;
        frame: Frame;
    } = await axios.get(frameDataUrl).then(res => res.data).catch(err => {
        console.error(err);
    });
    return {
        title: frameData?.frame?.title || "Frame Server Page",
        description: "A page that renders a frame on the server",
    }
}