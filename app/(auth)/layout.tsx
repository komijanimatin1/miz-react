import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="h-screen bg-gray-100">{children}</div>;
}
