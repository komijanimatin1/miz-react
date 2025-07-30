'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import TheHeader from '@/components/dashboard/TheHeader';
import SideBar from '@/components/dashboard/SideBar';
import WebviewWrapper from '@/components/webview/WebviewWrapper';
import LockScreen from '@/components/lock-screen/LockScreen';
import OfflineComponent from '@/components/common/OfflineComponent';
import { useAuthStore } from '@/stores/auth-store';
import { useLockStore } from '@/stores/lock-store';

declare global {
  interface Window {
    sysBunny: any;
  }
}

interface MenuItem {
  title: string;
  icon: string;
  url: string;
  logoUrl?: string;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { activeAccount, activeUnit } = useAuthStore();
  const { isLocked, hasPassword } = useLockStore();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [mainMenuItems, setMainMenuItems] = useState<MenuItem[]>([]);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [actualWebviewZoom, setActualWebviewZoom] = useState<number | null>(1);
  const webviewsRef = useRef<{ [key: string]: HTMLWebViewElement | null }>({});

  useEffect(() => {
    async function fetchMenuItems() {
      if (activeUnit) {
        try {
          const teamApps = await window.sysBunny.getTeamApps(activeUnit.id);
          const newMenuItems = teamApps.map((app: any) => ({
            title: app.displayName || app.name,
            icon: '',
            url: app.type === 'web' ? app.url : `https://fanap.mizbunny.com/apps/${app.name}?appId=${app.appId}&teamId=${activeUnit.id}`,
            logoUrl: `https://fanap.mizbunny.com/store/${app.name}/${app.logo}`,
          }));
          setMenuItems(newMenuItems);
        } catch (error) {
          console.error('Failed to fetch menu items:', error);
        }
      }
    }
    fetchMenuItems();
  }, [activeUnit]);

  const handleMenuItemClicked = (item: MenuItem) => {
    setActiveUrl(item.url);
  };

  const activeWebview = activeUrl ? webviewsRef.current[activeUrl] : null;

  const reloadWebview = () => activeWebview?.reload();
  const goBack = () => activeWebview?.goBack();
  const goForward = () => activeWebview?.goForward();
  const zoomIn = () => {
    if (activeWebview) {
      const currentZoom = activeWebview.getZoomFactor();
      activeWebview.setZoomFactor(currentZoom + 0.1);
      setActualWebviewZoom(currentZoom + 0.1);
    }
  };
  const zoomOut = () => {
    if (activeWebview) {
      const currentZoom = activeWebview.getZoomFactor();
      activeWebview.setZoomFactor(currentZoom - 0.1);
      setActualWebviewZoom(currentZoom - 0.1);
    }
  };

  const handleDidFinishLoad = () => {
    if (activeWebview) {
      setPageTitle(activeWebview.getTitle());
      setCanGoBack(activeWebview.canGoBack());
      setCanGoForward(activeWebview.canGoForward());
      setActualWebviewZoom(activeWebview.getZoomFactor());
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <OfflineComponent />
      {isLocked && hasPassword && <LockScreen />}
      <SideBar
        menuItems={menuItems}
        mainMenuItems={mainMenuItems}
        fullSideBarClicked={false}
        menuItemClicked={handleMenuItemClicked}
        menuSliderShown={() => {}}
        updateHiddenItems={() => {}}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TheHeader
          actualWebviewZoom={actualWebviewZoom}
          pageTitle={pageTitle}
          reloadWebview={reloadWebview}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          goForward={goForward}
          goBack={goBack}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          aiPopupShow={() => {}}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="relative w-full h-full">
            {menuItems.map((item) => (
              <div
                key={item.url}
                className={`absolute inset-0 ${activeUrl === item.url ? 'visible' : 'invisible'}`}
              >
                <WebviewWrapper
                  ref={(el) => (webviewsRef.current[item.url] = el)}
                  src={item.url}
                  onDidFinishLoad={handleDidFinishLoad}
                  onDidNavigateInPage={handleDidFinishLoad}
                />
              </div>
            ))}
            {!activeUrl && (
              <div className="flex items-center justify-center h-full">
                <p>Select an item from the sidebar to get started.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
