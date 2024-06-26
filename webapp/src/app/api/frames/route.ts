import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import HTMLParser from "fast-html-parser";

function parseMetaString(metaString: string): { [key: string]: string } {
    if (!metaString) return {};
    // Define a regular expression to match key-value pairs
    const regex = /(\w+)="([^"]+)"/g;
    const result: { [key: string]: string } = {};
    let match;

    // Iterate through all matches
    while ((match = regex.exec(metaString)) !== null) {
        const key = match[1];
        const value = match[2];
        result[key] = value;
    }
    return result;
}

async function fetchMetaTags(src: string) {
    try {
        const response = await axios.get(src);
        const html = response.data;
        const doc = HTMLParser.parse(html);
        const metaElements = doc.querySelectorAll('meta');
        const elements = metaElements?.map((e: any) => parseMetaString(e.rawAttrs)).reduce((acc: any, curr: any) => ({
            ...acc,
            ...(curr.name ? {
                [curr.name]: curr.content
            } : {})
        }), {});
        return elements;
    } catch (error) {
        console.error('Error fetching meta tags:', error);
        return [];
    }
};

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const { url: src } = Object.fromEntries(queryParams.entries());
    const metatags = await fetchMetaTags(src);
    return NextResponse.json(metatags);
}