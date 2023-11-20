'use client';
import React from 'react';
import {
  sepolia,
  useAccount,
  useNetwork,
  useWaitForTransaction,
  useWalletClient,
} from 'wagmi';
import { formatEther, keccak256, parseEther, toHex } from 'viem';

import Button from '@/components/common/Button';
import ConnectWalletButton from '@/components/common/ConnectWalletButton';
import RPSAbi from '@/contracts/RPS.json';
import bytecode from '@/contracts/RPS-bytecode';
import SwitchNetworkButton from '@/components/common/SwitchNetworkButton';
import { useRouter } from 'next/navigation';

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
    const password = formData.get('password');
    const move = formData.get('move');

    const hash = keccak256(toHex(`${move?.toString()}${password?.toString()}`));
    console.log(parseEther(stake?.toString() ?? '0'));

    const txHash = await walletClient?.deployContract({
      abi: RPSAbi,
      account: address,
      args: [hash, player2],
      bytecode,
      value: parseEther(stake?.toString() ?? '0'),
      chain: sepolia,
    });

    // store password and move in local storage
    localStorage.setItem(
      `waiting-room-${txHash}`,
      JSON.stringify({ password, move })
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
        Enter a password:
        <input
          className={inputClassName}
          type="password"
          name="password"
          id="password"
        />
      </label>
      <label className={labelClassName}>
        Selected Move:
        <div className="flex space-x-2">
          <div>
            <input
              type="radio"
              id="rock"
              name="move"
              value="rock"
              className="peer appearance-none"
            />
            <label htmlFor="rock" className={radioLabelClassName}>
              Rock
            </label>
          </div>

          <div>
            <input
              type="radio"
              id="paper"
              name="move"
              value="paper"
              className="peer appearance-none"
            />
            <label htmlFor="paper" className={radioLabelClassName}>
              Paper
            </label>
          </div>

          <div>
            <input
              type="radio"
              id="scissors"
              name="move"
              value="scissors"
              className="peer appearance-none"
            />
            <label htmlFor="scissors" className={radioLabelClassName}>
              Scissors
            </label>
          </div>

          <div>
            <input
              type="radio"
              id="lizard"
              name="move"
              value="lizard"
              className="peer appearance-none"
            />
            <label htmlFor="lizard" className={radioLabelClassName}>
              Lizard
            </label>
          </div>

          <div>
            <input
              type="radio"
              id="spock"
              name="move"
              value="spock"
              className="peer appearance-none"
            />
            <label htmlFor="spock" className={radioLabelClassName}>
              Spock
            </label>
          </div>
        </div>
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          'Submit'
        )}
      </Button>
    </form>
  );
}

export default CreatePage;
