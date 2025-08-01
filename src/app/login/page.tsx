'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const authStore = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      const mockAccount = {
        firstName: 'کاربر',
        lastName: 'تست',
        phoneNumber: '09123456789',
        username: 'testuser',
        partition: 'test-partition',
        pin: null,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      authStore.newAccount(mockAccount);
      authStore.setActiveAccount(mockAccount);
      
      setIsLoading(false);
      router.replace('/unit-select');
    }, 2000);
  };

  const handleBack = () => {
    router.push('/auth');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">ورود به حساب کاربری</h1>
          <p className="mt-2 text-gray-600">برای ورود به سیستم، اطلاعات خود را وارد کنید</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="نام کاربری خود را وارد کنید"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              رمز عبور
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="رمز عبور خود را وارد کنید"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="text-primary hover:text-primary-dark"
            >
              بازگشت
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                در حال ورود...
              </div>
            ) : (
              'ورود'
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            برای تست، روی دکمه ورود کلیک کنید تا با حساب تست وارد شوید
          </p>
        </div>
      </div>
    </div>
  );
}
