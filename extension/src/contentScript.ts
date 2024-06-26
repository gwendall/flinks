const CORS_PROXY = 'https://punkcam-cors-anywhere-99a09af4e7c4.herokuapp.com/';
const PUNKCAM_LINK = "https://labs.punk.cam/embed?url=https%3A%2F%2Fpunkmaker.xyz%2Fapi%2Fog%3Fp%3D002-061-048-050%26mode%3Drender%26background%3D0";

function parseMetaString(metaString: string): { [key: string]: string } {
    if (!metaString) return {};
    // Define a regular expression to match key-value pairs
    const regex = /(\w+)="([^"]+)"/g;
    const result: { [key: string]: string } = {};
    let match;

    // Iterate through all matches
    while ((match = regex.exec(metaString)) !== null) {
        const key = match[1];
        const value = match[2];
        result[key] = value;
    }

    return result;
}

async function fetchMetatags(src: string) {
    const response = await fetch(src, {
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const htmlText = await response.text();

    // Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Extract meta tags
    const metaElements = Array.from(doc.querySelectorAll('meta'));
    const elements = metaElements?.map((e: any) => parseMetaString(e.rawAttrs)).reduce((acc: any, curr: any) => ({
        ...acc,
        ...(curr.name ? {
            [curr.name]: curr.content
        } : {})
    }), {});
    return elements;
}

function buildIframe(src: string) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.boxSizing = 'border-box';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    iframe.allow = 'camera;microphone';
    // @ts-ignore
    iframe.allowusermedia = 'true';
    iframe.style.opacity = '0';
    iframe.style.transition = 'opacity 300ms ease-in-out';
    iframe.addEventListener('load', () => {
        iframe.style.opacity = '1'; // Fade in
    });

    const aspectRatioContainer = document.createElement('div');
    aspectRatioContainer.style.boxSizing = 'border-box';
    aspectRatioContainer.style.position = 'relative';
    aspectRatioContainer.style.width = '100%';
    aspectRatioContainer.style.paddingTop = '100%';
    // aspectRatioContainer.style.paddingTop = Math.round((12 / 9) * 100) + '%'; // 16:9 aspect ratio (9/16 = 0.5625)
    aspectRatioContainer.style.border = '1px solid rgba(0, 0, 0, 0.1)';
    aspectRatioContainer.style.borderRadius = '16px';
    aspectRatioContainer.style.overflow = 'hidden';
    aspectRatioContainer.style.outline = '#ff94ff solid 1px';
    aspectRatioContainer.style.boxShadow = '0 0 20px #ff5cff';
    aspectRatioContainer.style.marginTop = '15px';
    aspectRatioContainer.style.marginBottom = '5px';

    const loadingContainer = document.createElement('div');
    loadingContainer.style.position = 'absolute';
    loadingContainer.style.top = '0';
    loadingContainer.style.left = '0';
    loadingContainer.style.width = '100%';
    loadingContainer.style.height = '100%';
    loadingContainer.style.display = 'flex';
    loadingContainer.style.flexDirection = 'column';
    loadingContainer.style.alignItems = 'center';
    loadingContainer.style.justifyContent = 'center';
    loadingContainer.style.textTransform = 'uppercase';
    loadingContainer.style.fontSize = '1rem';
    loadingContainer.style.fontWeight = 'bold';
    loadingContainer.style.color = 'rgba(255, 255, 255, 0.5)';
    loadingContainer.textContent = 'Loading frame...';

    aspectRatioContainer.appendChild(loadingContainer);
    aspectRatioContainer.appendChild(iframe);

    return aspectRatioContainer;
}

const processedTweetTexts = new Set<Element>();

function replaceDOMElements() {
    const tweets = document.querySelectorAll('[data-testid="tweet"]');
    tweets.forEach((tweet) => {
        const tweetText = tweet.querySelector('[data-testid="tweetText"]') as HTMLElement;
        if (tweetText && !processedTweetTexts.has(tweetText)) {
            tweetText.style.overflowX = 'visible';
            tweetText.style.overflowY = 'visible';
            processedTweetTexts.add(tweetText);
            // const iframe = buildIframe(PUNKCAM_LINK);
            // tweetText?.appendChild(iframe);
            const tweetTextLinks = tweetText?.textContent?.match(/https?:\/\/[^\s]+/g) || [];
            tweetTextLinks.filter(Boolean).forEach((tweetLink) => {
                console.log('Found tweet link:', tweetLink);
                // fetchMetatags(tweetLink).then((metaTags) => {
                //     console.log('Meta tags:', tweetLink, metaTags);
                // });
                const iframe = buildIframe("https://eminent-pelican-hugely.ngrok-free.app/frame");
                // const iframe = buildIframe(tweetLink);
                // const iframe = buildIframe(PUNKCAM_LINK);
                tweetText?.appendChild(iframe);
            });
            if (tweetTextLinks.length > 0) {
                const tweetPhotos = tweet.querySelectorAll('[data-testid="tweetPhoto"]');
                tweetPhotos.forEach(tweetPhoto => {
                    if (tweetPhoto instanceof HTMLElement) {
                        tweetPhoto.remove();
                    }
                });
            }
            // const tweetCards = tweet.querySelectorAll('[data-testid="card.wrapper"]');
            // tweetCards.forEach(tweetCard => {
            //     if (tweetCard instanceof HTMLElement) {
            //         tweetCard.remove();
            //     }
            // });
        }

        /*
        const tweetCards = tweet.querySelectorAll('[data-testid="card.wrapper"]'); // Select elements with data-testid="card.wrapper"
        tweetCards.forEach(tweetCard => {
            if (tweetCard instanceof HTMLElement) {
                const link = tweetCard.querySelector('a[href]');
                const href = link?.getAttribute('href');
                const img = tweetCard.querySelector('img[src]');
                const src = img?.getAttribute('src');
                if (src && img && href) {
                    while (tweetCard.firstChild) {
                        tweetCard.removeChild(tweetCard.firstChild);
                    }
                    const iframe = buildIframe(PUNKCAM_LINK);
                    tweetCard.style.overflow = 'hidden';
                    tweetCard.appendChild(iframe);
                    console.log('Replaced tweetCard content with iframe:', tweetCard);
                }

            }
        });
        */
    });
}

document.addEventListener('DOMContentLoaded', replaceDOMElements);

// Observe changes in the DOM and replace elements dynamically:
const observer = new MutationObserver(replaceDOMElements);
observer.observe(document.body, { childList: true, subtree: true });
