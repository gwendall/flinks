/* eslint-disable @next/next/no-img-element */
"use client";

import styled, { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
    html, body, #__next {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
    }
    body {
        display: flex;
        flex-direction: column;
    }
    * {
        box-sizing: border-box;
    }
`;

const PageContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100svh;
    width: 100vw;
    background-color: black;
    color: white;
`;

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

const ButtonsInner = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 10px;
    gap: 10px;
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
`;

const FRAME_IMG = "https://proxy.wrpcd.net/?url=https%3A%2F%2Fhighlight-creator-assets.highlight.xyz%2Fmain%2Fimage%2F085fb994-dc1d-4bc3-9c9e-7ab06c024935.gif%3Fd%3D1000x1000&s=5ee5ebc08a5bcf2111c4684a113795152579ca047ea387d816bb2c7226df0e23";

export default function FramePage() {
    return (
        <>
            <GlobalStyle />
            <PageContainer>
                <ImageContainer>
                    <img src={FRAME_IMG} alt="frame-img" />
                </ImageContainer>
                <ButtonsContainer>
                    <ButtonsInner>
                        <Button>Mint</Button>
                        <Button>Explore</Button>
                        <Button>Eat</Button>
                    </ButtonsInner>
                </ButtonsContainer>
            </PageContainer>
        </>
    )
}