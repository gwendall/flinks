"use client";

import { NeynarAuthButton } from "@neynar/react";
import { useRouter } from "next/navigation";
import React from "react"

export default function HomePageClient() {
    const router = useRouter();
    const [input, setInput] = React.useState<string>('');
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.push(`/frames?url=${encodeURIComponent(input)}`);
    }
    return (
        <div>
            <h1>Flinks</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={input} onChange={handleChange} placeholder="Enter a frame url" />
                <button type="submit">Submit</button>
            </form>
            <NeynarAuthButton />
        </div>
    )
}