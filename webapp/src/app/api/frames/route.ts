import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getFrame } from "frames.js";
import getFrameFromWarpcast from "@/utils/getFrameFromWarpcast";
import getRedirectUrl from "@/utils/getRedirectUrl";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const queryParams = requestUrl.searchParams;
    const { url } = Object.fromEntries(queryParams.entries());
    console.log("Fetching frame for url: ", url);
    const redirectUrl = await getRedirectUrl(url);
    if (redirectUrl.startsWith("https://warpcast.com")) {
        const warpcastFrame = await getFrameFromWarpcast(redirectUrl);
        if (warpcastFrame) {
            return NextResponse.json(warpcastFrame);
        }
    }
    const response = await axios.get(redirectUrl);
    const htmlString = response.data;
    const frame = await getFrame({ htmlString, url: redirectUrl });
    return NextResponse.json({
        url: redirectUrl,
        frameData: frame
    });
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin')
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    })
}