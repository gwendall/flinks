const WEBAPP_URL = "https://eminent-pelican-hugely.ngrok-free.app";
// const WEBAPP_URL = "https://flinks.gg";

window.addEventListener('message', function (event) {
    if (event.data.type === 'openNewFlinkUrl') {
        if (!confirm('You are about to be redirected to ' + event.data.url)) {
            return;
        }
        window.open(event.data.url, '_blank');
    } else if (event.data.type === 'flinkMint') {
        if (!confirm('Minting through Flinks is coming soon. In the meantime, you can mint here: ' + event.data.url)) {
            return;
        }
        window.open(event.data.url, '_blank');
    } else if (event.data.type === 'flinkTx') {
        if (!confirm('Transactions through Flinks are coming soon. In the meantime, you can do your transaction here: ' + event.data.url)) {
            return;
        }
        window.open(event.data.url, '_blank');
    }
});

function buildIframe(src: string, frameLink: string) {
    console.log("Building iframe for: " + src);
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

function extractTweetLinks(tweet: Element) {

    // 1. Fetch links within text
    const tweetText = tweet.querySelector('[data-testid="tweetText"]') as HTMLElement;
    const tweetTextLinks = Array.from(tweetText?.querySelectorAll('a[href]') || [])
        .map((el) => el.getAttribute('href'))
        .filter((link) => link?.startsWith("https://"))
        .filter(Boolean) as string[] || [];

    // 2. Fetch links within cards
    const tweetCardsLinks = Array.from(tweet.querySelectorAll('[data-testid="card.wrapper"]'))
        .map(el => el.querySelector('a[href]')?.getAttribute('href'))
        .filter((link) => link?.startsWith("https://"))
        .filter(Boolean) as string[] || [];

    return [...new Set([...tweetTextLinks, ...tweetCardsLinks])].filter(Boolean);
}

function findFirstParentWithAttribute(element: HTMLElement | null, attribute: string) {
    while (element) {
        if (element.hasAttribute(attribute)) {
            return element;
        }
        element = element.parentElement;
    }
    return null; // Return null if no parent with the attribute is found
}

const processedTweetTexts = new Set<Element>();

function handleTweet(tweet: Element) {
    // (tweet as HTMLElement).style.backgroundColor = 'red';
    const tweetText = tweet.querySelector('[data-testid="tweetText"]') as HTMLElement;

    // if (!tweetText || processedTweetTexts.has(tweetText)) return;
    if (!tweetText) return;

    processedTweetTexts.add(tweetText);
    tweetText.style.overflowX = 'visible';
    tweetText.style.overflowY = 'visible';

    const tweetLinks = extractTweetLinks(tweet);
    tweetLinks.forEach(async (tweetLink) => {

        const loadingText = document.createElement('div');
        loadingText.classList.add('flinks-checking-text');
        loadingText.textContent = 'Looking for frame...';
        tweetText?.parentElement?.appendChild(loadingText);

        const fetchFrameUrl = WEBAPP_URL + "/api/frames?url=" + encodeURIComponent(tweetLink);
        try {
            console.log('Checking for frame: ' + fetchFrameUrl);
            const fetchResponse = await fetch(fetchFrameUrl, {
                method: "GET",
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Frame response: ', fetchFrameUrl, fetchResponse);
            const fetchJSON = await fetchResponse.json();
            console.log('Frame response JSON: ', fetchJSON);
            const existingIframe = tweetText?.querySelector(`iframe.flinks-iframe[data-url="${tweetLink}"]`);
            if (fetchJSON.frameData?.status === 'success' && fetchJSON.frameData?.frame && !existingIframe) {
                const iframe = buildIframe(WEBAPP_URL + "/frames?url=" + encodeURIComponent(tweetLink), fetchJSON.url);
                tweetText?.parentElement?.appendChild(iframe);
            }
            const alreadyInjectedText = tweet.querySelector('.flinks-checking-text');
            if (alreadyInjectedText) {
                alreadyInjectedText.remove?.();
            }
        } catch (err) {
            console.error('Frame not found for: ' + fetchFrameUrl, (err as any).message);
            const alreadyInjectedText = tweet.querySelector('.flinks-checking-text');
            if (alreadyInjectedText) {
                alreadyInjectedText.remove?.();
            }
        }
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

function handleNewTweets(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Ensure the added node is an element
                    const element = node as HTMLElement;

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