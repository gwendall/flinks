"use client";

import { createGlobalStyle } from "styled-components"

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

export default GlobalStyle;