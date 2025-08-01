import 'react';

declare global {
  interface Window {
    sysBunny: any;
    ipcRenderer: {
      receiveMessage: (callback: (data: any) => void) => void;
      send: (channel: string, data: any) => void;
    };
  }
}

interface HTMLWebViewElement extends HTMLElement {
  src: string;
  partition: string;
  preload?: string;
  allowpopups?: boolean;
  autosize?: string;
  enableblinkfeatures?: string;
  frameborder?: string;

  getWebContentsId: () => number;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  setZoomFactor: (factor: number) => void;
  getZoomFactor: () => number;
  getTitle: () => string;
  loadURL: (url: string) => void;
  executeJavaScript: (code: string, userGesture?: boolean) => Promise<any>;
  addEventListener(
    type: string,
    listener: (event: any) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: (event: any) => void,
    options?: boolean | EventListenerOptions
  ): void;
  openDevTools: () => void;
  contentWindow: Window;
  send: (channel: string, data: any) => void;
}

declare namespace JSX {
  interface IntrinsicElements {
    webview: React.DetailedHTMLProps<React.HTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement> & {
      src?: string;
      partition?: string;
      preload?: string;
      frameBorder?: string;
      enableBlinkFeatures?: string;
      autoSize?: string;
    };
  }
}

declare module 'react' {
  interface WebViewHTMLAttributes<T> extends HTMLAttributes<T> {
    src?: string;
    partition?: string;
    preload?: string;
    frameBorder?: string;
    enableBlinkFeatures?: string;
    autoSize?: string;
  }
}
