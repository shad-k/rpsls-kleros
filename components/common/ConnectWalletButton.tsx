'use client';

import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import Button from './Button';

const ConnectWalletButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <div>
      {isConnected ? (
        <Button>{address?.substring(0, 8)}...</Button>
      ) : (
        <Button onClick={() => connect()}>Connect Wallet</Button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
