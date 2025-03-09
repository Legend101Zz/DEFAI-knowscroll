
import { WalletProvider } from '@/context/WalletContext';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KnowScroll - Transform Your Scrolling Habit',
  description: 'Turn mindless scrolling into enlightening moments',
};

// Loading component with similar styling to the main component
function Loading() {
  return (
    <div className="min-h-screen bg-[#121218] text-white relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#121218]"></div>
      </div>

      <div className="pt-20 flex justify-center items-center h-[80vh]">
        <div className="w-16 h-16 border-t-2 border-b-2 border-[#37E8FF] rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#121218] text-white`}>
        <WalletProvider>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </WalletProvider>
      </body>
    </html>
  );
}