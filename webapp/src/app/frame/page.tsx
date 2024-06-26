/* eslint-disable @next/next/no-img-element */
"use client";

import EmbedPageContainer from "@/components/EmbedPageContainer";
import useFrameData from "@/hooks/useFrameData";
import { useSearchParams } from "next/navigation";
import React from "react";
import styled from "styled-components"

const ImageContainer = styled.div`
    flex: 1;
    position: relative;
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const ButtonsContainer = styled.div`
    background-color: rgb(42, 36, 50);
    width: 100%;
`;

const buttonsGap = 10;

const ButtonsInner = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${buttonsGap}px;
    padding: ${buttonsGap}px;
    width: 100%;
`;

const Button = styled.button`
    all: unset;
    box-sizing: border-box;
    padding: 10px;
    text-align: center;
    background-color: #ffffff1a;
    color: white;
    border: 1px solid #4c3a4ec0;
    cursor: pointer;
    border-radius: 10px;
    transition: all 200ms ease;
    font-size: 1rem;  
    @media(hover: hover) {
        &:hover {
            background-color: #ffffff3a;
        }
    }
    flex: 1;
    min-width: calc(50% - ${buttonsGap / 2}px); /* Ensures two buttons fit in a row with a gap */
    &:nth-child(2n+1):last-child {
        flex: 1 1 100%; /* Full width if it's the only button in a row */
    }
`;

const StatusText = styled.div`
    width: 100%;
    height: 100%;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.5);
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    font-size: 1rem;
    font-family: sans-serif;
`;

export default function FramePage() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url') as string;
    const { data, isLoading } = useFrameData(url);
    const [imageError, setImageError] = React.useState<boolean>(false);
    return (
        <EmbedPageContainer>
            {isLoading ? (
                <StatusText>Loading...</StatusText>
            ) : !data || data?.status !== 'success' ? (
                <StatusText>This is not a valid frame</StatusText>
            ) : data.frame ? (
                <>
                    <ImageContainer>
                        <img
                            src={data.frame.image || data.frame.ogImage}
                            alt="frame-img"
                            onError={(e) => setImageError(true)}
                            style={{ opacity: imageError ? 0 : 1 }}
                        />
                        {imageError ? (
                            <StatusText>{data.frame.title}</StatusText>
                        ) : null}
                    </ImageContainer>
                    <ButtonsContainer>
                        <ButtonsInner>
                            {data.frame.buttons?.map((button, index) => (
                                <Button key={`btn-${button.label}-${index}`}>
                                    {button.label}
                                </Button>
                            ))}
                        </ButtonsInner>
                    </ButtonsContainer>
                </>
            ) : (
                <StatusText>Link data not found</StatusText>
            )}
        </EmbedPageContainer>
    );
}