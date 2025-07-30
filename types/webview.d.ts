import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      webview: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLWebViewElement> & {
          src: string;
          partition: string;
          preload?: string;
          allowpopups?: boolean;
          autosize?: string;
          enableblinkfeatures?: string;
          frameborder?: string;
        },
        HTMLWebViewElement
      >;
    }
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
}
