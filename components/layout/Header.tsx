import React from 'react';
import ConnectWalletButton from '../common/ConnectWalletButton';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="h-16 flex items-center justify-between p-4 w-full bg-zinc-950">
      <Link href="/" className="text-2xl font-bold">
        RPSLSpock
      </Link>
      <ConnectWalletButton />
    </header>
  );
};

export default Header;
