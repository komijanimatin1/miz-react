'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

declare global {
  interface Window {
    sysBunny: any;
  }
}

export default function UnitSelectPage() {
  const router = useRouter();
  const { activeAccount, setActiveUnit, selectAccount } = useAuthStore();
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUnits() {
      if (activeAccount) {
        try {
          const teamsAndApps = await window.sysBunny.getTeamsAndApps();
          setUnits(teamsAndApps);
        } catch (error) {
          console.error('Failed to fetch units:', error);
        }
      }
    }
    fetchUnits();
  }, [activeAccount]);

  const handleSelectUnit = (unit: any) => {
    setActiveUnit(unit);
    router.push('/dashboard');
  };

  const handleSelectAnotherAccount = () => {
    selectAccount();
    router.push('/select-account');
  };

  if (!activeAccount) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No active account. Please select an account first.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">انتخاب واحد</h1>
          <p className="mt-2 text-gray-600">
            لطفا واحدی را که می‌خواهید وارد آن شوید، انتخاب کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <div
              key={unit.id}
              onClick={() => handleSelectUnit(unit)}
              className="flex flex-col items-center p-6 space-y-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <img
                className="w-24 h-24 rounded-full"
                src={unit.logoUrl || '/Images/unit-img.png'}
                alt={unit.name}
              />
              <p className="font-semibold text-lg">{unit.name}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 mt-6 text-center border-t">
          <button
            onClick={handleSelectAnotherAccount}
            className="text-primary hover:underline"
          >
            انتخاب حساب دیگر
          </button>
        </div>
      </div>
    </div>
  );
}
