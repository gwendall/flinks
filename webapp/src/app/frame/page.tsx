/* eslint-disable @next/next/no-img-element */
"use client";

import EmbedPageContainer from "@/components/EmbedPageContainer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Frame } from "frames.js";
import { useSearchParams } from "next/navigation";
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

export default function FramePage() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url') as string;
    const { data, isLoading } = useQuery({
        queryKey: ["frame", url],
        queryFn: async () => {
            const response = await axios.get('/api/frames', {
                params: {
                    url
                }
            });
            return response.data as {
                status: string;
                frame: Frame;
            };
        },
        enabled: !!url,
    });
    return (
        <EmbedPageContainer>
            {/* <pre>{JSON.stringify({ url, data, isLoading }, null, 2)}</pre> */}
            {isLoading ? (
                <p>Loading...</p>
            ) : !data || data?.status !== 'success' ? (
                <div>This is not a valid frame</div>
            ) : data.frame ? (
                <>
                    <ImageContainer>
                        <img src={data.frame.image} alt="frame-img" />
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
                <div>Link data not found</div>
            )}
        </EmbedPageContainer>
    );
}