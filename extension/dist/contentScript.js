/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./src/contentScript.ts ***!
  \******************************/

const CORS_PROXY = 'https://punkcam-cors-anywhere-99a09af4e7c4.herokuapp.com/';
const PUNKCAM_LINK = "https://labs.punk.cam/embed?url=https%3A%2F%2Fpunkmaker.xyz%2Fapi%2Fog%3Fp%3D002-061-048-050%26mode%3Drender%26background%3D0";
const RENDERING_DOMAIN = "https://flinks-amber.vercel.app";
function buildIframe(src) {
    const iframe = document.createElement('iframe');
    iframe.classList.add('flinks-iframe');
    iframe.src = src;
    iframe.allow = 'camera;microphone';
    // @ts-ignore
    iframe.allowusermedia = 'true';
    iframe.addEventListener('load', () => {
        iframe.style.opacity = '1'; // Fade in
    });
    const aspectRatioContainer = document.createElement('div');
    aspectRatioContainer.classList.add('flinks-aspect-ratio-container');
    const loadingContainer = document.createElement('div');
    loadingContainer.classList.add('flinks-loading-container');
    loadingContainer.textContent = 'Loading frame...';
    aspectRatioContainer.appendChild(loadingContainer);
    aspectRatioContainer.appendChild(iframe);
    return aspectRatioContainer;
}
function extractTweetLinks(tweet) {
    // 1. Fetch links within text
    const tweetText = tweet.querySelector('[data-testid="tweetText"]');
    const tweetTextLinks = Array.from((tweetText === null || tweetText === void 0 ? void 0 : tweetText.querySelectorAll('a[href]')) || [])
        .map((el) => el.getAttribute('href'))
        .filter((link) => link === null || link === void 0 ? void 0 : link.startsWith("https://"))
        .filter(Boolean) || [];
    // 2. Fetch links within cards
    const tweetCardsLinks = Array.from(tweet.querySelectorAll('[data-testid="card.wrapper"]'))
        .map(el => { var _a; return (_a = el.querySelector('a[href]')) === null || _a === void 0 ? void 0 : _a.getAttribute('href'); })
        .filter((link) => link === null || link === void 0 ? void 0 : link.startsWith("https://"))
        .filter(Boolean) || [];
    return [...new Set([...tweetTextLinks, ...tweetCardsLinks])].filter(Boolean);
}
function findFirstParentWithAttribute(element, attribute) {
    while (element) {
        if (element.hasAttribute(attribute)) {
            return element;
        }
        element = element.parentElement;
    }
    return null; // Return null if no parent with the attribute is found
}
const processedTweetTexts = new Set();
function replaceDOMElements() {
    const tweets = document.querySelectorAll('[data-testid="tweet"]');
    tweets.forEach((tweet) => {
        const tweetText = tweet.querySelector('[data-testid="tweetText"]');
        if (tweetText && !processedTweetTexts.has(tweetText)) {
            processedTweetTexts.add(tweetText);
            tweetText.style.overflowX = 'visible';
            tweetText.style.overflowY = 'visible';
            const tweetLinks = extractTweetLinks(tweet);
            tweetLinks.forEach((tweetLink) => {
                var _a;
                const iframe = buildIframe(RENDERING_DOMAIN + "/frame?url=" + encodeURIComponent(tweetLink));
                (_a = tweetText === null || tweetText === void 0 ? void 0 : tweetText.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(iframe);
                // fetch(RENDERING_DOMAIN + "/api/frames?url=" + encodeURIComponent(tweetLink))
                //     .then((response) => response.json())
                //     .then((response) => {
                //         console.log("is frame?", { tweetLink, response });
                //         // const iframe = buildIframe(RENDERING_DOMAIN + "/frame?url=" + encodeURIComponent(tweetLink));
                //         // tweetText?.parentElement?.appendChild(iframe);
                //     });
            });
            // 3. Remove photos and cards
            /*
            if (tweetLinks.length > 0) {
                const tweetCards = tweet.querySelectorAll('[data-testid="card.wrapper"]');
                tweetCards.forEach(tweetCard => {
                    tweetCard.remove?.();
                });
                const tweetPhotos = tweet.querySelectorAll('[data-testid="tweetPhoto"]');
                tweetPhotos.forEach(tweetPhoto => {
                    const photoContainer = findFirstParentWithAttribute(tweetPhoto as HTMLElement, "aria-labelledby");
                    photoContainer?.remove?.();
                });
            }
            */
        }
    });
}
// Ensure the function is called on DOMContentLoaded
document.addEventListener('DOMContentLoaded', replaceDOMElements);
// Also listen to the window load event to handle additional cases
window.addEventListener('load', replaceDOMElements);
// Observe changes in the DOM and replace elements dynamically
const observer = new MutationObserver(replaceDOMElements);
// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

/******/ })()
;
//# sourceMappingURL=contentScript.js.map