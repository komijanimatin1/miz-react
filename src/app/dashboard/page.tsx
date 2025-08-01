'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { activeAccount, activeUnit, logout } = useAuthStore();

  useEffect(() => {
    if (!activeAccount) {
      router.push('/');
    }
  }, [activeAccount, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!activeAccount) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">میزکار فناپ</h1>
                <p className="text-gray-600">
                  خوش آمدید {activeAccount.firstName} {activeAccount.lastName}
                </p>
                {activeUnit && (
                  <p className="text-gray-500">واحد: {activeUnit.name}</p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                خروج
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">اطلاعات حساب</h3>
                <p>شماره تلفن: {activeAccount.phoneNumber}</p>
                <p>نام کاربری: {activeAccount.username}</p>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">وضعیت اتصال</h3>
                <p className="text-green-600">متصل</p>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">آخرین ورود</h3>
                <p>{new Date().toLocaleDateString('fa-IR')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 