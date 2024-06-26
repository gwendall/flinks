import { NextRequest, NextResponse } from "next/server";
import { getFrame } from "frames.js";
import axios from "axios";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const queryParams = requestUrl.searchParams;
    const { url } = Object.fromEntries(queryParams.entries());
    // console.log('GETTING URL', url);
    const response = await axios.get(url);
    const htmlString = response.data;
    // console.log('HTML STRING', htmlString);
    const frame = await getFrame({ htmlString, url });
    // console.log('Frame?', { url, frame })
    return NextResponse.json(frame);
}