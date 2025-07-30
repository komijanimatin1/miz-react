'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

interface TheHeaderProps {
  actualWebviewZoom: number | null;
  pageTitle: string | null;
  reloadWebview: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  goForward: () => void;
  goBack: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  aiPopupShow: () => void;
}

export default function TheHeader({
  actualWebviewZoom,
  pageTitle,
  reloadWebview,
  canGoBack,
  canGoForward,
  goForward,
  goBack,
  zoomIn,
  zoomOut,
  aiPopupShow,
}: TheHeaderProps) {
  const router = useRouter();
  const { activeAccount, activeUnit, logout, setActiveUnit } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleSetLockPassword = () => {
    // Navigate to set lock password page
    router.push('/set-lock-password');
  };

  const handleUnitChange = (unit: any) => {
    setActiveUnit(unit);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const minimizeWindow = () => window.ipcRenderer.send('minimize');
  const toggleFullscreen = () => window.ipcRenderer.send('toggle-fullscreen');
  const closeWindow = () => window.ipcRenderer.send('close');

  return (
    <header className="flex items-center justify-between p-2 bg-white shadow-md">
      <div className="flex items-center space-x-2">
        <button onClick={goBack} disabled={!canGoBack} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50">
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <button onClick={goForward} disabled={!canGoForward} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50">
          <span className="material-icons-outlined">arrow_forward</span>
        </button>
        <button onClick={reloadWebview} className="p-1 rounded-full hover:bg-gray-200">
          <span className="material-icons-outlined">refresh</span>
        </button>
      </div>

      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold">{pageTitle || 'میزکار فناپ'}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <button onClick={zoomOut} className="p-1 rounded-full hover:bg-gray-200">
            <span className="material-icons-outlined">zoom_out</span>
          </button>
          <span>{actualWebviewZoom ? `${Math.round(actualWebviewZoom * 100)}%` : '100%'}</span>
          <button onClick={zoomIn} className="p-1 rounded-full hover:bg-gray-200">
            <span className="material-icons-outlined">zoom_in</span>
          </button>
        </div>

        <div className="relative">
          <button onClick={toggleMenu} className="flex items-center space-x-2">
            <img
              className="w-8 h-8 rounded-full"
              src="/Images/userImage.png"
              alt={activeAccount?.firstName}
            />
            <span>{activeAccount?.firstName}</span>
            <span className="material-icons-outlined">arrow_drop_down</span>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={handleSetLockPassword}
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  تنظیم رمز عبور
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  خروج
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={minimizeWindow} className="p-1 rounded-full hover:bg-gray-200">
            <span className="material-icons-outlined">remove</span>
          </button>
          <button onClick={toggleFullscreen} className="p-1 rounded-full hover:bg-gray-200">
            <span className="material-icons-outlined">crop_square</span>
          </button>
          <button onClick={closeWindow} className="p-1 rounded-full hover:bg-gray-200">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
      </div>
    </header>
  );
}
