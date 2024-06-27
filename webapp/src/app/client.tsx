"use client";

import { Button } from "@/components/FrameRenderer";
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

const PageContainer = styled.div`
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 15px;
    min-height: 100svh;
`;

const Title = styled.h1`
    font-size: 4rem;
    margin: 0;
    font-weight: bold;
    white-space: normal;
    overflow-wrap: normal;
    background-image: linear-gradient(90deg, #ffbf66, #00b4fb, #ff00ff, #000000);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: white;
    background-size: 200% 200%;
    animation: animateTextColor 5s ease infinite;
    width: fit-content;
`;

function FrameNavForm() {
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
        <form onSubmit={handleSubmit}>
            <input type="text" value={input} onChange={handleChange} placeholder="Enter a frame url" />
            <button type="submit">Submit</button>
        </form>
    );
}

export default function HomePageClient() {
    return (
        <>
            <LandingBackground />
            <PageContainer>
                <Title>flinks</Title>
                <div style={{
                    fontWeight: 'bold',
                    marginBottom: 15,
                }}>
                    Farcaster Frames, across the web.
                </div>
                {/* <NeynarAuthButton /> */}
                <Button style={{
                    backgroundColor: '#ff00ff',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    flex: 0,
                    paddingLeft: 15,
                    paddingRight: 15,
                }}>
                    Install Flinks for Chrome
                </Button>
            </PageContainer>
        </>
    )
}