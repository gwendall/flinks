import { Metadata } from "next";
import axios from "axios";
import { apiUrl } from "@/utils/const";
import FrameClientPage from "./client";
import { get } from "lodash";

export default function FrameServerPage() {
    return <FrameClientPage />;
}

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
    const data = await axios.get(frameDataUrl).then(res => res.data).catch(err => {
        console.error(err);
    });
    return {
        title: get(data, "frameData.frame.title") || "Frame Server Page",
        description: "A page that renders a frame on the server",
    }
}