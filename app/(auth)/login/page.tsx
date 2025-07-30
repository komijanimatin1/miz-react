'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { usePathStore } from '@/stores/path-store';

declare global {
  interface Window {
    sysBunny: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const authStore = useAuthStore();
  const pathStore = usePathStore();
  const webviewRef = useRef<HTMLWebViewElement>(null);

  const uuidv4 = () => {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
      (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
    );
  };

  const getLoginPartition = () => {
    let temp = localStorage.getItem('LoginPartition');
    if (!temp) {
      temp = uuidv4();
      localStorage.setItem('LoginPartition', temp);
    }
    return temp;
  };

  const onLoginHappened = async (accessToken: string, refreshToken: string) => {
    if (!localStorage.getItem('LoginPartition')) {
      return;
    }

    const tempPartition = getLoginPartition();
    localStorage.removeItem('LoginPartition');

    if (accessToken && refreshToken) {
      window.sysBunny.token = accessToken;
      window.sysBunny.refreshToken = refreshToken;
      const profile = await window.sysBunny.getProfile();

      const newAccount = {
        firstName: profile.name,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        username: profile.username,
        partition: tempPartition,
        pin: null,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      authStore.addAccount(newAccount);
      authStore.setActiveAccount(newAccount);

      router.replace('/unit-select');
    }
  };

  useEffect(() => {
    const webview = webviewRef.current;
    if (webview) {
      const handleMessage = (event: any) => {
        if (event.channel === 'message-from-child') {
          const data = event.args[0];
          if (data.origin === 'mizBunnyApp') {
            onLoginHappened(data.data.token, data.data.refreshToken);
          }
        }
      };

      webview.addEventListener('ipc-message', handleMessage);

      return () => {
        webview.removeEventListener('ipc-message', handleMessage);
      };
    }
  }, [onLoginHappened]);

  return (
    <div className="h-screen">
      <webview
        ref={webviewRef}
        src="https://fanap.mizbunny.com/apps/mizBunny_login"
        partition={`persist:${getLoginPartition()}`}
        preload={`file://${pathStore.getBasicPath()}/preload.js`}
        className="w-full h-full"
      />
    </div>
  );
}
