"use client";

import { Button } from "@/components/FrameRenderer";
// import { NeynarAuthButton } from "@neynar/react";
// import { useRouter } from "next/navigation";
import React from "react"
import styled, { createGlobalStyle } from "styled-components";
// import Video from 'next-video';
import landingVideo from '/videos/landing2.mp4';
// import BackgroundVideo from "next-video/background-video";
import NextVideo from "next-video";
// import { m } from "framer-motion";
import Markdown from "react-markdown";

const LandingBackground = styled.div`
    position: fixed;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100svh;
    padding: 50px 15px;
`;

const PageContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 600px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    padding: 20px;
    padding-bottom: 30px;
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

const PageGlobalStyle = createGlobalStyle`
    .next-video-bg {
        border-radius: 30px;
        overflow: hidden;
    }
`;

const CHROMESTORE_LINK = "https://chromewebstore.google.com/detail/flinks/agmjmokodkbfakfnncbibecaaaojcbmj?authuser=1&hl=en";

const StyledButton = styled(Button)`
    text-decoration: none;
    transition: all 200ms ease;
    @media(hover: hover) {
        &:hover {
            transform: scale(1.05);
        }
    }
`;

const StyledNextVideo = styled(NextVideo)`
    border-radius: 20px;
    margin-bottom: 15px;
`;

const LinksRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 0.9rem;
    a {
        color: rgba(0, 0, 0, 0.5);
        text-decoration: none;
        @media(hover: hover) {
            &:hover {
                text-decoration: underline;
            }
        }
    }
`;

const VideoContainer = styled.div`
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: 16px;
    background-color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    img {
        object-fit: cover;
        object-position: center;
        transform: scale(1.16);
        background-width: 100%;
    }
`;

export default function HomePageClient() {
    return (
        <>
            <PageGlobalStyle />
            <LandingBackground />
            <PageContainer>
                <PageContent>
                    <VideoContainer>
                        <StyledNextVideo
                            src={landingVideo}
                            poster="/poster.png"
                        />
                    </VideoContainer>
                    <Title>Flinks</Title>
                    <div style={{
                        fontWeight: 'bold',
                        marginBottom: 15,
                    }}>
                        Farcaster Frames, right inside Twitter.
                    </div>
                    {/* <NeynarAuthButton /> */}
                    <StyledButton as="a" href={CHROMESTORE_LINK} style={{
                        backgroundColor: '#ff00ff',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        flex: 0,
                        paddingLeft: 15,
                        paddingRight: 15,
                    }}>
                        Install Flinks for Chrome
                    </StyledButton>
                    <LinksRow>
                        <Markdown>
                            {`Made by gwendall ([warpcast](https://warpcast.com/gwendall), [twitter](https://x.com/gwendall))`}
                        </Markdown>
                        <span style={{ margin: "0 5px" }}>-</span>
                        {[
                            // {
                            //     label: 'Privacy',
                            //     href: '/privacy',
                            // },
                            // {
                            //     label: 'Support',
                            //     href: '/support',
                            // },
                            {
                                label: 'Github repo',
                                href: 'https://github.com/gwendall/flinks',
                                external: true,
                            }
                        ].map(({
                            label,
                            href,
                            external
                        }: {
                            label: string;
                            href: string;
                            external?: boolean;
                        }) => (
                            <a
                                key={href}
                                href={href}
                                target={external ? "_blank" : undefined}
                            >
                                {label}
                            </a>
                        ))}
                    </LinksRow>
                </PageContent>
            </PageContainer>
        </>
    )
}