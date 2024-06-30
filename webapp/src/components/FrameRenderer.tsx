/* eslint-disable @next/next/no-img-element */
import React from "react";
import styled from "styled-components";
import type { ImgHTMLAttributes } from "react";
import type { Frame, FrameButton } from "frames.js";
import { FrameStackMessage, FrameStackRequestError, FrameState } from "@frames.js/render";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import ExternalLink from "./ExternalLink";
import { AccountId, ChainId } from "caip";
import { isInIframe } from "@/utils/misc";

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
    flex-grow: 1;
    flex-shrink: 0;
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

const FrameImage = styled(LazyLoadImage).attrs({
    loading: "lazy",
    effect: "opacity",
    // decoding: "async",
    // crossOrigin: "anonymous",
})`
    image-rendering: pixelated;
    vertical-align: bottom;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const ButtonsContainer = styled.div`
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

export const Button = styled.button`
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

export const StatusText = styled(motion.div).attrs({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
}) <{ $absolute?: boolean; }>`
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
    z-index: 1;
    pointer-events: none;
    ${({ $absolute }) => $absolute ? `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;        
    ` : ''}
`;

const FrameInputContainer = styled.div`
    width: 100%;
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

const ActionsContainer = styled(motion.div)`
    background-color: rgb(42, 36, 50);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
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
    const currentFrame = frameState.currentFrameStackItem;
    const [isImageError, setIsImageError] = React.useState<boolean>(false);
    const [isImageLoading, setIsImageLoading] = React.useState<boolean>(true);
    const isLoading = currentFrame?.status === "pending" || isImageLoading;
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
    const renderedImage = debugImage ?? frame?.image ?? frame?.ogImage;
    return (
        <>
            <ExternalLink
                href={frameState.homeframeUrl}
                style={{
                    flex: 1,
                    display: 'flex',
                }}
            >
                <ImageContainer
                // key={`image-${frameState.currentFrameStackItem?.url}-${renderedImage}`}
                >
                    {currentFrame.status === "message" ? (
                        <StatusText>{getErrorMessageFromFramesStackItem(currentFrame)}</StatusText>
                    ) : null}
                    <FrameImage
                        src={renderedImage}
                        key={`actions-${frameState.currentFrameStackItem?.url}-${renderedImage}`}
                        alt="Frame image"
                        style={{
                            filter: isImageLoading ? "blur(4px)" : undefined,
                            opacity: !renderedImage || isImageError ? 0 : 1
                        }}
                        onLoadStart={() => {
                            setIsImageLoading(true);
                        }}
                        onLoad={() => {
                            setIsImageLoading(false);
                        }}
                        onError={() => {
                            setIsImageLoading(false);
                            setIsImageError(true);
                        }}
                    />
                    {!!frame && isImageError ? (
                        <StatusText $absolute key={`error-${frame.title}`}>
                            {frame.title}
                        </StatusText>
                    ) : null}
                    {!!frame && isImageLoading ? (
                        <StatusText $absolute key={`img-loading-${frame.title}`}>
                            Loading image
                        </StatusText>
                    ) : null}
                    {currentFrame.status === "pending" ? (
                        <StatusText $absolute key={`next-${frame?.title}`}>
                            Loading frame
                        </StatusText>
                    ) : null}
                </ImageContainer>
            </ExternalLink>
            <ActionsContainer
                // key={`actions-${frameState.currentFrameStackItem?.url}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {frame?.inputText ? (
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
                {!!frame?.buttons && frame.buttons.length > 0 ? (
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
                                        if (isInIframe && frameButton.action === 'link') {
                                            window.parent.postMessage({
                                                type: 'openNewFlinkUrl',
                                                url: frameButton.target,
                                            }, "*");
                                        } else {
                                            Promise.resolve(
                                                frameState.onButtonPress(
                                                    // Partial frame could have enough data to handle button press
                                                    frame as Frame,
                                                    frameButton,
                                                    index
                                                )
                                            ).catch((e: unknown) => {
                                                // eslint-disable-next-line no-console -- provide feedback to the user
                                                console.error('Error clicking button.', e);
                                            });
                                        }
                                    }}
                                    // eslint-disable-next-line react/no-array-index-key -- this is fine
                                    key={`button-${index}`}
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
            </ActionsContainer>
        </>
    );
}