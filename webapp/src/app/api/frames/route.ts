import { NextRequest, NextResponse } from "next/server";
import { getFrame } from "frames.js";
import axios from "axios";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const queryParams = requestUrl.searchParams;
    const { url } = Object.fromEntries(queryParams.entries());
    const response = await axios.get(url);
    const htmlString = response.data;
    const frame = await getFrame({ htmlString, url });
    return NextResponse.json(frame);
}