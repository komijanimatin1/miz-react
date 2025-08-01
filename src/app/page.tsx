'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function RootPage() {
  const router = useRouter();
  const { activeAccount } = useAuthStore();

  useEffect(() => {
    if (activeAccount) {
      // If user is authenticated, redirect to dashboard
      router.replace('/dashboard');
    } else {
      // If user is not authenticated, redirect to auth page
      router.replace('/auth');
    }
  }, [activeAccount, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    </div>
  );
} 