import CreateGameButton from '@/components/home/CreateGameButton';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-48 p-24">
      <h1 className="text-6xl font-bold text-center">
        Welcome to Rock Paper Scissors Lizard Spock!
      </h1>

      <CreateGameButton />
    </main>
  );
}
