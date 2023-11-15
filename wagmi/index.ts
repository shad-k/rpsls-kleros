import { createConfig, sepolia } from 'wagmi';
import { createPublicClient, http } from 'viem';

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http(),
  }),
});

export default config;
