"use client";

import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
    html, body, #__next {
        margin: 0;
        padding: 0;
        width: 100%;
    }
    body {
        display: flex;
        flex-direction: column;
        font-family: "Inter", sans-serif;
        color: black;
        background: white;
    }
    * {
        box-sizing: border-box;
    }
    p {
        margin: 0;
        padding: 0;
    }
`;

export default GlobalStyle;

// font-optical-sizing: auto;
// font-weight: 100;
// font-style: normal;
// font-variation-settings: "slnt" 0;
