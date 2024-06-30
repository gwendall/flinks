// export { GET, POST } from "@frames.js/render/next";

import { GET as frameGET, POST as framePOST } from "@frames.js/render/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    console.log("GET request received");
    return frameGET(request);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("POST request received", JSON.stringify(body, null, 2));

        // Ensure to re-create the request with the original data if necessary
        const newRequest = new NextRequest(request.url, {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(body),
        });
        return await framePOST(newRequest);
    } catch (error) {
        console.error("Error processing POST request:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}