'use client';

import Button from '@/components/common/Button';
import ExplorerLink from '@/components/common/ExplorerLink';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useWaitForTransaction } from 'wagmi';

const WaitingPage = ({ params }: { params: { txHash: string } }) => {
  const [showGameLink, setShowGameLink] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [hash, setHash] = useState<`0x${string}`>(
    params.txHash as `0x${string}`
  );
  const { data, isSuccess, isLoading } = useWaitForTransaction({
    confirmations: 1,
    hash: hash,
    onReplaced(response) {
      setHash(response.replacedTransaction.hash);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const gameInMemory = localStorage.getItem(
        `waiting-room-${params.txHash}`
      );

      console.log(gameInMemory);
      if (gameInMemory) {
        localStorage.setItem(
          `game-${data?.contractAddress}`,
          JSON.stringify(gameInMemory)
        );
        localStorage.removeItem(`waiting-room-${params.txHash}`);
      }
      setShowGameLink(true);
    }
  }, [isSuccess, data, params.txHash]);

  // skip server side rendering to avoid hydration errors
  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-8 pt-20">
        <h2 className="text-xl font-bold italic">
          Waiting for transaction confirmation...
        </h2>
        <div className="flex flex-col items-center space-y-4">
          {hash !== params.txHash ? (
            <>
              <h4>
                Initial Transaction:{' '}
                <ExplorerLink hashOrAddress={params.txHash} />
              </h4>
              <h4>
                Replacing Transaction: <ExplorerLink hashOrAddress={hash} />
              </h4>
            </>
          ) : (
            <h4>
              Transaction: <ExplorerLink hashOrAddress={hash} />
            </h4>
          )}
        </div>
      </div>
    );
  } else if (isSuccess && data) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-8 py-20">
        <h2 className="text-xl font-bold italic">
          Your game has been created. Enjoy!
        </h2>
        {showGameLink && (
          <Link href={`/game/${data?.contractAddress}`}>
            <Button>Go to Game</Button>
          </Link>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-8 py-20">
      <h2 className="text-xl font-bold italic">
        Could not find the transaction. Please check and try again!
      </h2>
    </div>
  );
};

export default WaitingPage;
