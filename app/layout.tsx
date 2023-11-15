import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import WagmiProvider from '@/wagmi/Provider';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rock Paper Scissors Lizard Spock',
  description: 'Play Rock Paper Scissors Lizard Spock game on the blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black h-full w-full text-white`}>
        <WagmiProvider>
          <Header />
          <main>{children}</main>
        </WagmiProvider>
      </body>
    </html>
  );
}
