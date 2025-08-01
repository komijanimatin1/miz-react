'use client';

import { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useLockStore } from '@/stores/lock-store';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

export default function LockScreen() {
  const router = useRouter();
  const { verifyPassword, unlockApp } = useLockStore();
  const { logout, selectAccount } = useAuthStore();
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (index < 3) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleUnlock = () => {
    const enteredPin = pin.join('');
    if (verifyPassword(enteredPin)) {
      unlockApp();
    } else {
      setError('رمز عبور نامعتبر است');
      setPin(['', '', '', '']);
      inputsRef.current[0]?.focus();
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleSelectAccount = () => {
    selectAccount();
    router.push('/select-account');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-full max-w-sm p-8 space-y-8 text-center bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img src="/Images/logo.svg" alt="Logo" className="w-16 h-16 mb-4" />
          <h1 className="text-2xl font-bold">برنامه قفل است</h1>
          <p className="mt-2 text-gray-600">برای باز کردن قفل، رمز عبور خود را وارد کنید.</p>
        </div>

        <div className="flex justify-center space-x-2" dir="ltr">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-2xl text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleUnlock}
          className="w-full px-4 py-3 text-white bg-primary rounded-lg hover:bg-primary-dark"
        >
          باز کردن قفل
        </button>

        <div className="flex justify-between pt-4">
          <button onClick={handleLogout} className="text-sm text-gray-600 hover:underline">
            خروج از حساب
          </button>
          <button onClick={handleSelectAccount} className="text-sm text-gray-600 hover:underline">
            انتخاب حساب دیگر
          </button>
        </div>
      </div>
    </div>
  );
}
