/* eslint-disable @next/next/no-img-element */
import React from "react";
import styled from "styled-components";
import type { ImgHTMLAttributes } from "react";
import type { Frame, FrameButton } from "frames.js";
import { FrameStackMessage, FrameStackRequestError, FrameState } from "@frames.js/render";

function getErrorMessageFromFramesStackItem(
    item: FrameStackMessage | FrameStackRequestError
): string {
    if (item.status === "message") {
        return item.message;
    }

    if (item.requestError instanceof Error) {
        return item.requestError.message;
    }

    return "An error occurred";
}

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
        transition: filter 200ms ease;
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

const FrameInputContainer = styled.div`
    width: 100%;
    background-color: rgb(42, 36, 50);
    padding: ${buttonsGap}px;
    padding-bottom: 2px;
`;

const FrameInput = styled.input`
    all: unset;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 10px 12px;
    border-radius: 4px;
    width: 100%;
    transition: all 200ms ease;
    border: transparent solid thin;
    color: white;
    &:focus {
        border-color: #ff00ff;
    }
`;

type FrameRendererProps = {
    frameState: FrameState;
    FrameImage?: React.FC<ImgHTMLAttributes<HTMLImageElement> & { src: string }>;
    allowPartialFrame?: boolean;
    /**
     * This option works only with frames created by Frames.js and with debug enabled.
     *
     * @defaultValue false
     */
    enableImageDebugging?: boolean;
};

/** A UI component only, that should be easy for any app to integrate */
export function FrameRenderer({
    frameState,
    // FrameImage,
    allowPartialFrame,
    enableImageDebugging,
}: FrameRendererProps): React.JSX.Element | null {
    const [isImageLoading, setIsImageLoading] = React.useState<boolean>(true);
    const currentFrame = frameState.currentFrameStackItem;
    const isLoading = currentFrame?.status === "pending" || isImageLoading;
    const [imageError, setImageError] = React.useState<boolean>(false);

    if (!frameState.homeframeUrl) {
        return (
            <StatusText>Missing frame url</StatusText>
        );
    }

    if (!currentFrame) {
        return null;
    }

    if (
        currentFrame.status === "done" &&
        currentFrame.frameResult.status === "failure" &&
        !(
            allowPartialFrame &&
            // Need at least image and buttons to render a partial frame
            currentFrame.frameResult.frame.image &&
            currentFrame.frameResult.frame.buttons
        )
    ) {
        return <StatusText>Invalid frame</StatusText>;
    }

    let frame: Frame | Partial<Frame> | undefined;
    let debugImage: string | undefined;

    if (currentFrame.status === "done") {
        frame = currentFrame.frameResult.frame;
        debugImage = enableImageDebugging
            ? currentFrame.frameResult.framesDebugInfo?.image
            : undefined;
    } else if (
        currentFrame.status === "message" ||
        currentFrame.status === "doneRedirect"
    ) {
        frame = currentFrame.request.sourceFrame;
    } else if (currentFrame.status === "requestError") {
        frame =
            "sourceFrame" in currentFrame.request
                ? currentFrame.request.sourceFrame
                : undefined;
    }
    return (
        <>
            <ImageContainer>
                {currentFrame.status === "message" ? (
                    <StatusText>{getErrorMessageFromFramesStackItem(currentFrame)}</StatusText>
                ) : null}
                {!!frame && !!frame.image && (
                    <img
                        src={debugImage ?? frame.image}
                        key={debugImage ?? frame.image}
                        alt="Frame image"
                        style={{
                            filter: isLoading ? "blur(4px)" : undefined,
                            opacity: imageError ? 0 : 1
                        }}
                        onLoadStart={() => {
                            setIsImageLoading(true);
                        }}
                        onLoad={() => {
                            setIsImageLoading(false);
                        }}
                        onError={() => {
                            setIsImageLoading(false);
                            setImageError(true);
                        }}
                    />
                )}
                {!!frame && imageError ? (
                    <StatusText>{frame.title}</StatusText>
                ) : null}
            </ImageContainer>
            {!!frame && frame.inputText ? (
                <FrameInputContainer>
                    <FrameInput
                        value={frameState.inputText}
                        type="text"
                        placeholder={frame.inputText}
                        onChange={(e) => {
                            frameState.setInputText(e.target.value);
                        }}
                    />
                </FrameInputContainer>
            ) : null}
            {!!frame && !!frame.buttons && frame.buttons.length > 0 ? (
                <ButtonsContainer>
                    <ButtonsInner>
                        {frame.buttons.map((frameButton: FrameButton, index: number) => (
                            <Button
                                type="button"
                                disabled={isLoading}
                                style={{
                                    cursor: isLoading ? undefined : "pointer",
                                    opacity: isLoading ? 0.5 : 1,
                                }}
                                onClick={() => {
                                    Promise.resolve(
                                        frameState.onButtonPress(
                                            // Partial frame could have enough data to handle button press
                                            frame as Frame,
                                            frameButton,
                                            index
                                        )
                                    ).catch((e: unknown) => {
                                        // eslint-disable-next-line no-console -- provide feedback to the user
                                        console.error(e);
                                    });
                                }}
                                // eslint-disable-next-line react/no-array-index-key -- this is fine
                                key={index}
                            >
                                {frameButton.action === "mint" ? `⬗ ` : ""}
                                {frameButton.label}
                                {frameButton.action === "tx" ? (
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        role="img"
                                        viewBox="0 0 16 16"
                                        className="ml-1 mb-[2px] text-gray-400 inline-block select-none align-text-middle overflow-visible"
                                        width="12"
                                        height="12"
                                        fill="currentColor"
                                    >
                                        <path d="M9.504.43a1.516 1.516 0 0 1 2.437 1.713L10.415 5.5h2.123c1.57 0 2.346 1.909 1.22 3.004l-7.34 7.142a1.249 1.249 0 0 1-.871.354h-.302a1.25 1.25 0 0 1-1.157-1.723L5.633 10.5H3.462c-1.57 0-2.346-1.909-1.22-3.004L9.503.429Zm1.047 1.074L3.286 8.571A.25.25 0 0 0 3.462 9H6.75a.75.75 0 0 1 .694 1.034l-1.713 4.188 6.982-6.793A.25.25 0 0 0 12.538 7H9.25a.75.75 0 0 1-.683-1.06l2.008-4.418.003-.006a.036.036 0 0 0-.004-.009l-.006-.006-.008-.001c-.003 0-.006.002-.009.004Z" />
                                    </svg>
                                ) : (
                                    ""
                                )}
                                {frameButton.action === "post_redirect" ||
                                    frameButton.action === "link"
                                    ? ` ↗`
                                    : ""}
                            </Button>
                        ))}
                    </ButtonsInner>
                </ButtonsContainer>
            ) : null}
        </>
    );
}