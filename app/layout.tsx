import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="stylesheet" href="/Fonts/IranYekanX/Webfonts/style.css" />
        <script src="https://fanap.mizbunny.com/sysBunny.js"></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
