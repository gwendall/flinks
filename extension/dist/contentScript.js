/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/contentScript.ts":
/*!******************************!*\
  !*** ./src/contentScript.ts ***!
  \******************************/
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const RENDERING_DOMAIN = "https://flinks.gg";
window.addEventListener('message', function (event) {
    if (event.data.type === 'openNewFlinkUrl') {
        if (!confirm('You are about to be redirected to ' + event.data.url)) {
            return;
        }
        window.open(event.data.url, '_blank');
    }
    else if (event.data.type === 'flinkMint') {
        if (!confirm('Minting through Flinks is coming soon. In the meantime, do it here: ' + event.data.url)) {
            return;
        }
        window.open(event.data.url, '_blank');
    }
    else if (event.data.type === 'flinkTx') {
        if (!confirm('Transactions through Flinks are coming soon. In the meantime, do it here: ' + event.data.url)) {
            return;
        }
        window.open(event.data.url, '_blank');
    }
});
function buildIframe(src, frameLink) {
    const iframe = document.createElement('iframe');
    iframe.classList.add('flinks-iframe');
    iframe.setAttribute('data-url', src);
    iframe.src = src;
    // iframe.allow = 'camera;microphone';
    // iframe.allowusermedia = 'true';
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
    const iframeContainer = document.createElement('div');
    iframeContainer.appendChild(aspectRatioContainer);
    const iframeLink = document.createElement('a');
    iframeLink.classList.add('flinks-iframe-link');
    iframeLink.href = frameLink;
    iframeLink.target = '_blank';
    iframeLink.textContent = new URL(frameLink).hostname;
    iframeContainer.appendChild(iframeLink);
    return iframeContainer;
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
function handleTweet(tweet) {
    const tweetText = tweet.querySelector('[data-testid="tweetText"]');
    // if (!tweetText || processedTweetTexts.has(tweetText)) return;
    if (!tweetText)
        return;
    processedTweetTexts.add(tweetText);
    tweetText.style.overflowX = 'visible';
    tweetText.style.overflowY = 'visible';
    const tweetLinks = extractTweetLinks(tweet);
    tweetLinks.forEach((tweetLink) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const loadingText = document.createElement('div');
        loadingText.classList.add('flinks-checking-text');
        loadingText.textContent = 'Looking for frame...';
        (_a = tweetText === null || tweetText === void 0 ? void 0 : tweetText.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(loadingText);
        yield fetch(RENDERING_DOMAIN + "/api/frames?url=" + encodeURIComponent(tweetLink))
            .then((response) => response.json())
            .then((response) => {
            var _a, _b, _c, _d;
            const existingIframe = tweetText === null || tweetText === void 0 ? void 0 : tweetText.querySelector(`iframe.flinks-iframe[data-url="${tweetLink}"]`);
            if (((_a = response.frameData) === null || _a === void 0 ? void 0 : _a.status) === 'success' && ((_b = response.frameData) === null || _b === void 0 ? void 0 : _b.frame) && !existingIframe) {
                const iframe = buildIframe(RENDERING_DOMAIN + "/frames?url=" + encodeURIComponent(tweetLink), response.url);
                (_c = tweetText === null || tweetText === void 0 ? void 0 : tweetText.parentElement) === null || _c === void 0 ? void 0 : _c.appendChild(iframe);
            }
            const alreadyInjectedText = tweet.querySelector('.flinks-checking-text');
            if (alreadyInjectedText) {
                (_d = alreadyInjectedText.remove) === null || _d === void 0 ? void 0 : _d.call(alreadyInjectedText);
            }
        })
            .catch(() => {
            var _a;
            const alreadyInjectedText = tweet.querySelector('.flinks-checking-text');
            if (alreadyInjectedText) {
                (_a = alreadyInjectedText.remove) === null || _a === void 0 ? void 0 : _a.call(alreadyInjectedText);
            }
        });
    }));
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
// function replaceDOMElements() {
//     console.log('Replacing DOM elements...');
//     const tweets = document.querySelectorAll('[data-testid="tweet"]');
//     tweets.forEach((tweet) => {
//         handleTweet(tweet);
//     });
// }
// // Ensure the function is called on DOMContentLoaded
// document.addEventListener('DOMContentLoaded', replaceDOMElements);
// // Observe changes in the DOM and replace elements dynamically
// const observer = new MutationObserver(replaceDOMElements);
// // Start observing the document body for changes
// observer.observe(document.body, { childList: true, subtree: true });
function handleNewTweets(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Ensure the added node is an element
                    const element = node;
                    if (element.matches('[data-testid="tweet"]') && !element.hasAttribute('data-processed')) {
                        handleTweet(element);
                        element.setAttribute('data-processed', 'true');
                    }
                    // Check for any tweet elements within the added subtree
                    element.querySelectorAll('[data-testid="tweet"]:not([data-processed])').forEach(tweetNode => {
                        handleTweet(tweetNode);
                        tweetNode.setAttribute('data-processed', 'true');
                    });
                    // Handle new card wrapper elements within the document
                    element.querySelectorAll('[data-testid="card.wrapper"]').forEach(cardNode => {
                        const parentTweet = cardNode.closest('[data-testid="tweet"]');
                        if (parentTweet && !parentTweet.hasAttribute('data-processed')) {
                            handleTweet(parentTweet);
                            parentTweet.setAttribute('data-processed', 'true');
                        }
                    });
                }
            });
        }
    }
}
// Create an observer instance linked to the callback function
const observer = new MutationObserver(handleNewTweets);
// Start observing the document body for added nodes
observer.observe(document.body, { childList: true, subtree: true });
// document.addEventListener('DOMContentLoaded', () => {
//     document.querySelectorAll('[data-testid="tweet"]').forEach(tweetNode => {
//         handleTweet(tweetNode);
//     });
// });


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/contentScript.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=contentScript.js.map