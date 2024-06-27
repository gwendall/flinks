const CORS_PROXY = 'https://punkcam-cors-anywhere-99a09af4e7c4.herokuapp.com/';
const PUNKCAM_LINK = "https://labs.punk.cam/embed?url=https%3A%2F%2Fpunkmaker.xyz%2Fapi%2Fog%3Fp%3D002-061-048-050%26mode%3Drender%26background%3D0";
const RENDERING_DOMAIN = "https://flinks.gg";

window.addEventListener('message', function (event) {
    if (event.data.type === 'openNewFlinkUrl') {
        window.open(event.data.url, '_blank');
    }
});

function buildIframe(src: string) {
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

function replaceDOMElements() {
    const tweets = document.querySelectorAll('[data-testid="tweet"]');
    tweets.forEach((tweet) => {
        const tweetText = tweet.querySelector('[data-testid="tweetText"]') as HTMLElement;
        if (tweetText && !processedTweetTexts.has(tweetText)) {

            processedTweetTexts.add(tweetText);
            tweetText.style.overflowX = 'visible';
            tweetText.style.overflowY = 'visible';

            const tweetLinks = extractTweetLinks(tweet);
            tweetLinks.forEach((tweetLink) => {
                fetch(RENDERING_DOMAIN + "/api/frames?url=" + encodeURIComponent(tweetLink))
                    .then((response) => response.json())
                    .then((response) => {
                        if (response.status === 'success' && response.frame) {
                            const iframe = buildIframe(RENDERING_DOMAIN + "/frames?url=" + encodeURIComponent(tweetLink));
                            tweetText?.parentElement?.appendChild(iframe);
                        }
                    });
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