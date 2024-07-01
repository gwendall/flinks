import { NextRequest, NextResponse } from "next/server";
import getFrameFromWarpcast from "@/utils/getFrameFromWarpcast";
import getRedirectUrl from "@/utils/getRedirectUrl";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const queryParams = requestUrl.searchParams;
    const { url } = Object.fromEntries(queryParams.entries());
    const redirectUrl = await getRedirectUrl(url);
    if (redirectUrl.startsWith("https://warpcast.com")) {
        const warpcastFrame = await getFrameFromWarpcast(redirectUrl);
        if (warpcastFrame) {
            return NextResponse.json(warpcastFrame.url);
        } else {
            return NextResponse.json(redirectUrl);
        }
    } else {
        return NextResponse.json(redirectUrl);
    }
}