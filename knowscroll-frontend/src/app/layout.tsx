
import { WalletProvider } from '@/context/WalletContext';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KnowScroll - Transform Your Scrolling Habit',
  description: 'Turn mindless scrolling into enlightening moments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#121218] text-white`}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}