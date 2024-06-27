import axios from "axios";
import { neynar } from "./neynar";
import { getFrame } from "frames.js";
import { GetFrameResult } from "@frames.js/render";

export default async function getFrameFromWarpcast(url: string): Promise<{
    url: string;
    frameData: GetFrameResult;
} | undefined> {
    const embeds = await neynar.get(`/farcaster/cast`, {
        params: {
            identifier: url,
            type: "url",
        }
    }).then((res) => res.data?.cast?.embeds?.map((e: any) => e?.url).filter(Boolean) || []);
    const frames = await Promise.all<{
        url: string;
        frameData: GetFrameResult;
    }>(embeds.map(async (embedUrl: string) => {
        const response = await axios.get(embedUrl);
        const htmlString = response.data;
        const frameData = await getFrame({ htmlString, url: embedUrl });
        return {
            url: embedUrl,
            frameData,
        };
    }));
    const validFrame = frames.find((frame) => frame?.frameData?.status === "success" && !!frame?.frameData?.frame);
    return validFrame;
}