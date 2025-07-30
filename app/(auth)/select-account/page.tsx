'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

export default function SelectAccountPage() {
  const router = useRouter();
  const { accounts, setActiveAccount, addNewAccount } = useAuthStore();

  const handleSelectAccount = (account: any) => {
    setActiveAccount(account);
    router.push('/unit-select');
  };

  const handleAddNewAccount = () => {
    addNewAccount();
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">انتخاب حساب کاربری</h1>
          <p className="mt-2 text-gray-600">یکی از حساب‌های کاربری زیر را انتخاب کنید.</p>
        </div>

        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.phoneNumber}
              onClick={() => handleSelectAccount(account)}
              className="flex items-center p-4 space-x-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <img
                className="w-12 h-12 rounded-full"
                src="/Images/userImage.png"
                alt={`${account.firstName} ${account.lastName}`}
              />
              <div className="flex-1">
                <p className="font-semibold">{`${account.firstName} ${account.lastName}`}</p>
                <p className="text-sm text-gray-500">{account.phoneNumber}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={handleAddNewAccount}
            className="w-full px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark"
          >
            افزودن حساب کاربری جدید
          </button>
        </div>
      </div>
    </div>
  );
}
