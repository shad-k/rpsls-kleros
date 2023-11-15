'use client';

import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const ConnectWalletButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const btnClass =
    'bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg';
  return (
    <div>
      {isConnected ? (
        <div className={btnClass}>{address?.substring(0, 8)}...</div>
      ) : (
        <button className={btnClass} onClick={() => connect()}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
