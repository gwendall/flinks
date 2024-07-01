
import { POST as framePOST } from "@frames.js/render/next";
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/utils/cors";

export { GET } from "@frames.js/render/next";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("POST request received", JSON.stringify(body, null, 2));

        // Ensure to re-create the request with the original data if necessary
        const newRequest = new NextRequest(request.url, {
            method: request.method,
            body: JSON.stringify(body),
            headers: {
                ...request.headers,
                ...corsHeaders,
            },
        });

        return await framePOST(newRequest);
    } catch (error) {
        console.error("Error processing POST request:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}