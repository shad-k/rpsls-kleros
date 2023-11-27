'use client';
import React from 'react';
import { sepolia, useAccount, useNetwork, useWalletClient } from 'wagmi';
import { encodePacked, formatEther, keccak256, parseEther, toHex } from 'viem';

import Button from '@/components/common/Button';
import ConnectWalletButton from '@/components/common/ConnectWalletButton';
import RPSAbi from '@/contracts/RPS.json';
import bytecode from '@/contracts/RPS-bytecode';
import SwitchNetworkButton from '@/components/common/SwitchNetworkButton';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import { moves } from '@/utils/constants';
import generateSalt from '@/utils/generateSalt';

function CreatePage() {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const router = useRouter();

  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { chain } = useNetwork();

  const labelClassName = 'w-full flex items-center justify-between font-bold';
  const inputClassName =
    'text-black rounded border-none bg-white h-10 font-normal px-3';
  const radioLabelClassName =
    'border border-gray-500 rounded-lg p-2 text-sm peer-checked:bg-white peer-checked:text-black cursor-pointer';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const player2 = formData.get('player2');
    const stake = formData.get('stake');
    const move = formData.get('move');

    const salt = generateSalt(16);

    if (!stake || !player2 || !move) {
      alert('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (stake && Number(stake) <= 0) {
      alert('Stake must be greater than 0');
      setIsSubmitting(false);
      return;
    }

    if (address === player2) {
      alert('Player 2 cannot be the same as Player 1');
      setIsSubmitting(false);
      return;
    }

    const moveIndex = moves.indexOf(move?.toString() ?? '');

    const hash = keccak256(
      encodePacked(['uint8', 'uint256'], [moveIndex + 1, BigInt(salt)])
    );

    const txHash = await walletClient?.deployContract({
      abi: RPSAbi,
      account: address,
      args: [hash, player2],
      bytecode,
      value: parseEther(stake?.toString() ?? '0'),
      chain: sepolia,
    });

    // store salt and move in local storage
    localStorage.setItem(
      `waiting-room-${txHash}`,
      JSON.stringify({ salt: BigInt(salt).toString(), move: moveIndex })
    );

    router.push(`/waiting-room/${txHash}`);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col pt-20 items-center justify-center space-y-8">
        <h1 className="text-2xl font-bold">Connect wallet to continue</h1>
        <ConnectWalletButton />
      </div>
    );
  }

  if (chain?.id !== sepolia.id) {
    return (
      <div className="flex flex-col pt-20 items-center justify-center space-y-8">
        <h1 className="text-2xl font-bold">Switch Network to continue</h1>
        <SwitchNetworkButton />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center space-y-8 border border-gray-800 rounded-lg p-8 max-w-xl mx-auto mt-20"
    >
      <h1 className="text-2xl font-bold">Create Game</h1>
      <label className={labelClassName}>
        Player 2 Ethereum Address:
        <input
          className={inputClassName}
          type="text"
          name="player2"
          id="player2"
        />
      </label>
      <label className={labelClassName}>
        Stake Value in Eth:
        <input
          className={inputClassName}
          type="number"
          step="any"
          min={formatEther(BigInt(1))}
          max={1}
          name="stake"
          id="stake"
        />
      </label>
      <label className={labelClassName}>
        Selected Move:
        <div className="flex space-x-2">
          {moves.map((move) => {
            return (
              <div key={move}>
                <input
                  type="radio"
                  id={move}
                  name="move"
                  value={move}
                  className="peer appearance-none"
                />
                <label htmlFor={move} className={radioLabelClassName}>
                  {move}
                </label>
              </div>
            );
          })}
        </div>
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Spinner /> : 'Submit'}
      </Button>
    </form>
  );
}

export default CreatePage;
