import { NextRequest, NextResponse } from "next/server";
import getFrameFromWarpcast from "@/utils/getFrameFromWarpcast";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const queryParams = requestUrl.searchParams;
    const { url } = Object.fromEntries(queryParams.entries());
    // #TODO handle case where url is redirect
    if (url.startsWith("https://warpcast.com")) {
        const warpcastFrame = await getFrameFromWarpcast(url);
        if (warpcastFrame) {
            return NextResponse.json(warpcastFrame.url);
        } else {
            return NextResponse.json(url);
        }
    } else {
        return NextResponse.json(url);
    }
}