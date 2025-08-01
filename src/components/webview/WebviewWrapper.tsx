'use client';

import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { usePathStore } from '@/stores/path-store';

interface WebviewWrapperProps {
  src: string;
  onDidFinishLoad?: () => void;
  onDidNavigateInPage?: (event: any) => void;
}

const WebviewWrapper = forwardRef((props: WebviewWrapperProps, ref) => {
  const { src, onDidFinishLoad, onDidNavigateInPage } = props;
  const { activeAccount } = useAuthStore();
  const pathStore = usePathStore();
  const webviewRef = useRef<HTMLWebViewElement>(null);

  useImperativeHandle(ref, () => webviewRef.current);

  useEffect(() => {
    const webview = webviewRef.current;
    if (webview) {
      const handleContextMenu = (event: any) => {
        if (event.channel === 'context-menu-event') {
          const params = event.args[0];
          const webContentsId = webview.getWebContentsId();
          window.ipcRenderer.send('show-webview-context-menu', {
            ...params,
            webContentsId,
            canGoBack: webview.canGoBack(),
            canGoForward: webview.canGoForward(),
          });
        }
      };

      const handleDidFinishLoad = () => {
        if (onDidFinishLoad) {
          onDidFinishLoad();
        }
      };

      const handleDidNavigateInPage = (event: any) => {
        if (onDidNavigateInPage) {
          onDidNavigateInPage(event);
        }
      };

      webview.addEventListener('ipc-message', handleContextMenu);
      webview.addEventListener('did-finish-load', handleDidFinishLoad);
      webview.addEventListener('did-navigate-in-page', handleDidNavigateInPage);

      return () => {
        webview.removeEventListener('ipc-message', handleContextMenu);
        webview.removeEventListener('did-finish-load', handleDidFinishLoad);
        webview.removeEventListener('did-navigate-in-page', handleDidNavigateInPage);
      };
    }
  }, [onDidFinishLoad, onDidNavigateInPage]);

  return (
    <webview
      ref={webviewRef}
      src={src}
      partition={`persist:${activeAccount?.partition}`}
      preload={`file://${pathStore.getBasicPath()}/preload.js`}
      className="w-full h-full rounded-xl"
      allowpopups
    />
  );
});

WebviewWrapper.displayName = 'WebviewWrapper';

export default WebviewWrapper;
