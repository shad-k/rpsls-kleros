import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import Provider from '@/wagmi/Provider';

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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
