"use client";

import { NeynarAuthButton } from "@neynar/react";
import { useRouter } from "next/navigation";
import React from "react"
import styled from "styled-components";

const LandingBackground = styled.div`
    position: absolute;
    border-radius: inherit;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: 100.00px auto;
    background-image: url(https://framerusercontent.com/images/6VvZoi0nDuDWS0DpB89uJy853W8.png);
    border: 0;
    background-repeat: repeat;
    background-position: left top;
    z-index: -1;
    pointer-events: none;
`;

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
        <>
            <LandingBackground />
            <div>
                <h1>Flinks</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={input} onChange={handleChange} placeholder="Enter a frame url" />
                    <button type="submit">Submit</button>
                </form>
                <NeynarAuthButton />
            </div>
        </>
    )
}