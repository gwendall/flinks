export const isBrowser = typeof window !== 'undefined';
export const isInIframe = isBrowser && window.self !== window.top;
