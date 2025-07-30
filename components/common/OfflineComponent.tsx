'use client';

import { useOnlineStatus } from '@/hooks/use-online-status';

export default function OfflineComponent() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="text-center">
        <img src="/Images/net-err.svg" alt="Offline" className="w-48 h-48 mx-auto mb-8" />
        <h1 className="text-3xl font-bold">شما آفلاین هستید</h1>
        <p className="mt-4 text-lg text-gray-600">
          لطفا اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.
        </p>
      </div>
    </div>
  );
}
