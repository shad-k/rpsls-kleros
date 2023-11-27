import React from 'react';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import { moves } from '@/utils/constants';
import RPSAbi from '@/contracts/RPS.json';
import Spinner from '../common/Spinner';
import { GameState } from '@/types';
import getTimeLeft from '@/utils/getTimeLeft';
import ContractCallButton from '../common/ContractCallButton';

type Player1GameDisplay = {
  gameContract: `0x${string}`;
  player2Move: number;
  timeout: number;
  lastAction: number;
  gameState: GameState;
  refetch: () => void;
};

const Player1GameDisplay: React.FC<Player1GameDisplay> = ({
  gameContract,
  player2Move,
  timeout,
  lastAction,
  gameState,
  refetch,
}) => {
  const {
    hasGameTimedOut,
    hasPlayer2Moved,
    hasPlayer2ClaimedStake,
    hasPlayer1Revealed,
    canPlayer1ClaimStake,
  } = gameState;

  const [showSpinner, setShowSpinner] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(
    getTimeLeft(timeout, lastAction)
  );

  const [waitForSolveTxHash, setWaitForSolveTxHash] =
    React.useState<`0x${string}`>();

  const { data: waitForSolveTxData } = useWaitForTransaction({
    hash: waitForSolveTxHash,
    confirmations: 1,
  });

  const [waitForClaimTxHash, setWaitForClaimTxHash] =
    React.useState<`0x${string}`>();

  const { data: waitForClaimTxData } = useWaitForTransaction({
    hash: waitForClaimTxHash,
    confirmations: 1,
  });

  const getPlayer1Move = React.useCallback(() => {
    const gameData = localStorage.getItem(`game-${gameContract}`);
    if (gameData) {
      const parsedGameData = JSON.parse(gameData);
      return moves[parsedGameData.move];
    }
    return null;
  }, [gameContract]);

  const getPlayer1Salt = React.useCallback(() => {
    const gameData = localStorage.getItem(`game-${gameContract}`);
    if (gameData) {
      const parsedGameData = JSON.parse(gameData);
      return parsedGameData.salt;
    }
    return null;
  }, [gameContract]);

  // reveal move contract call
  const { config: revealMoveConfig } = usePrepareContractWrite({
    address: gameState.hasPlayer2Moved ? gameContract : undefined,
    abi: RPSAbi,
    functionName: 'solve',
    args: [
      moves.indexOf(getPlayer1Move() as string) + 1,
      BigInt(getPlayer1Salt()),
    ],
    onError(error) {
      alert((error.cause as any)?.shortMessage ?? error.message);
      setShowSpinner(false);
    },
  });

  const { write: revealMove } = useContractWrite({
    ...revealMoveConfig,
    onSettled(data, error) {
      if (error) {
        alert((error.cause as any)?.shortMessage ?? error.message);
        setShowSpinner(false);
        return;
      }
      setWaitForSolveTxHash(data?.hash);
    },
  });

  // claim stake contract call
  const { config } = usePrepareContractWrite({
    address: gameState.canPlayer1ClaimStake ? gameContract : undefined,
    abi: RPSAbi,
    functionName: 'j2Timeout',
    onError(error) {
      alert((error.cause as any)?.shortMessage ?? error.message);
      setShowSpinner(false);
    },
  });

  const { write: claimStake } = useContractWrite({
    ...config,
    onSettled(data, error) {
      if (error) {
        alert((error.cause as any)?.shortMessage ?? error.message);
        setShowSpinner(false);
        return;
      }
      setWaitForClaimTxHash(data?.hash);
    },
  });

  React.useEffect(() => {
    if (waitForSolveTxData || waitForClaimTxData) {
      refetch();
      setShowSpinner(false);
    }
  }, [waitForSolveTxData, refetch, waitForClaimTxData]);

  React.useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(getTimeLeft(timeout, lastAction));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, timeout, lastAction]);

  const handleClaimStake = React.useCallback(async () => {
    setShowSpinner(true);
    await claimStake?.();
  }, [claimStake]);

  const handleRevealMove = React.useCallback(async () => {
    setShowSpinner(true);
    await revealMove?.();
  }, [revealMove]);

  return (
    <div className="w-2/3 my-8 border border-gray-900 p-4 flex flex-col justify-between space-y-4">
      <div className="text-xl">
        <span className="font-light">Your move: </span>
        <span className="font-bold italic">{getPlayer1Move()}</span>
      </div>
      {(!hasGameTimedOut || hasPlayer1Revealed) && (
        <div className="text-xl">
          <span className="font-light">Player 2&apos;s move: </span>
          <span className="font-bold italic">
            {Boolean(player2Move)
              ? moves[player2Move - 1]
              : 'Waiting for player 2 to move'}
          </span>
        </div>
      )}

      {!hasPlayer2Moved && (
        <div className="text-xl">
          <span className="font-light">Time left for player 2: </span>
          <span className="font-bold">
            {timeLeft > 0 ? (
              `${Math.floor(timeLeft / 1000 / 60)}:${
                Math.floor(timeLeft / 1000) % 60
              }`
            ) : (
              <div className="inline-flex items-center space-x-4">
                <span>Time is up!</span>
                {canPlayer1ClaimStake && (
                  <ContractCallButton
                    disabled={!canPlayer1ClaimStake || showSpinner}
                    onClick={handleClaimStake}
                  >
                    {showSpinner ? <Spinner /> : 'Claim Stake'}
                  </ContractCallButton>
                )}
              </div>
            )}
          </span>
          {!hasPlayer2Moved && timeLeft <= 0 && (
            <p className="text-xs w-full">
              (please refresh if you don&apos;t see the button to claim stake)
            </p>
          )}
        </div>
      )}
      {hasPlayer2Moved && !hasPlayer1Revealed && (
        <>
          <div className="text-xl">
            <span className="font-light">Time left to reveal: </span>
            <span className="font-bold">
              {timeLeft > 0 ? (
                `${Math.floor(timeLeft / 1000 / 60)}:${
                  Math.floor(timeLeft / 1000) % 60
                }`
              ) : (
                <div className="inline-flex items-center space-x-4">
                  <span>
                    Time is up!{' '}
                    {hasPlayer2ClaimedStake
                      ? 'Player 2 has reclaimed stake'
                      : 'But you can still reveal your move'}
                  </span>
                </div>
              )}
            </span>
          </div>
          {!hasPlayer2ClaimedStake && (
            <div>
              <ContractCallButton
                onClick={() => handleRevealMove()}
                className="mx-auto"
                disabled={showSpinner}
              >
                {showSpinner ? <Spinner /> : 'Reveal Move'}
              </ContractCallButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Player1GameDisplay;
