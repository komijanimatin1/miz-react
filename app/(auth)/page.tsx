'use client';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSelectAccount = () => {
    router.push('/select-account');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">به میزکار فناپ خوش آمدید</h1>
        <p className="text-lg text-gray-600 mb-8">
          برای ورود یا انتخاب حساب کاربری خود، یکی از گزینه‌های زیر را انتخاب کنید.
        </p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors"
        >
          ورود به حساب کاربری
        </button>
        <button
          onClick={handleSelectAccount}
          className="px-6 py-3 bg-white text-primary rounded-lg shadow-md hover:bg-gray-200 transition-colors"
        >
          انتخاب حساب
        </button>
      </div>
    </div>
  );
}
