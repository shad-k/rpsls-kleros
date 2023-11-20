'use client';

import ConnectWalletButton from '@/components/common/ConnectWalletButton';
import Link from 'next/link';
import { sepolia, useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import SwitchNetworkButton from '../common/SwitchNetworkButton';

const CreateGameButton = () => {
  const { isConnected } = useAccount();

  const { chain } = useNetwork();

  let button;

  if (isConnected) {
    if (chain?.id !== sepolia.id) {
      button = <SwitchNetworkButton />;
    } else {
      button = (
        <Link
          href="/create"
          className="bg-blue-500 hover:bg-blue-700 text-white text-base font-semibold py-2 px-4 rounded-lg"
        >
          Create a Game
        </Link>
      );
    }
  } else {
    button = <ConnectWalletButton />;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {button}
    </div>
  );
};
export default CreateGameButton;
