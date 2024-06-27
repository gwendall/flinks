"use client";

import { Button } from "@/components/FrameRenderer";
// import { NeynarAuthButton } from "@neynar/react";
import { useRouter } from "next/navigation";
import React from "react"
import styled, { createGlobalStyle } from "styled-components";
// import Video from 'next-video';
import landingVideo from '/videos/landing.mp4';
import BackgroundVideo from "next-video/background-video";

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
    min-height: 100svh;
`;

const PageContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 1000px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    padding: 20px 30px;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    font-size: 3rem;
    margin: 0;
    font-weight: bold;
    white-space: normal;
    overflow-wrap: normal;
    background-image: linear-gradient(90deg, #00b4fb, #ff00ff, #000000);
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

const PageGlobalStyle = createGlobalStyle`
    body {
        overflow: hidden;
    }
`;

export default function HomePageClient() {
    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
            }}>
                <div style={{
                    margin: 10
                }}>
                    <BackgroundVideo src={landingVideo} />
                </div>
            </div>
            <PageGlobalStyle />
            <LandingBackground />
            <PageContainer>
                <PageContent>
                    <Title>Flinks</Title>
                    <div style={{
                        fontWeight: 'bold',
                        marginBottom: 15,
                    }}>
                        Farcaster Frames, in Twitter.
                    </div>
                    {/* <Video src={landingVideo} autoPlay loop muted playsInline /> */}
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
                    <div style={{
                        marginTop: 10,
                        color: 'rgba(0, 0, 0, 0.5)',
                        fontSize: '0.9rem',
                    }}>
                        or view the codebase
                    </div>
                </PageContent>
            </PageContainer>
        </>
    )
}