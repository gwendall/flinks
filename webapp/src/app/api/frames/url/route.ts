import { NextRequest, NextResponse } from "next/server";
import getFrameFromWarpcast from "@/utils/getFrameFromWarpcast";
import getRedirectUrl from "@/utils/getRedirectUrl";
import { corsHeaders } from "@/utils/cors";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const queryParams = requestUrl.searchParams;
    const { url } = Object.fromEntries(queryParams.entries());
    const redirectUrl = await getRedirectUrl(url);
    if (redirectUrl.startsWith("https://warpcast.com")) {
        const warpcastFrame = await getFrameFromWarpcast(redirectUrl);
        if (warpcastFrame) {
            return NextResponse.json(warpcastFrame.url, {
                headers: corsHeaders
            });
        } else {
            return NextResponse.json(redirectUrl, {
                headers: corsHeaders
            });
        }
    } else {
        return NextResponse.json(redirectUrl, {
            headers: corsHeaders
        });
    }
}