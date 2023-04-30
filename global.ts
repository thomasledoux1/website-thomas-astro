declare global {
  interface Window {
    dataLayer: any;
  }
}

window.dataLayer = window.dataLayer || {};

export {};
