import React from 'react';

type ExplorerLinkProps = {
  hashOrAddress: string;
  isAddress?: boolean;
};

const ExplorerLink: React.FC<ExplorerLinkProps> = ({
  hashOrAddress,
  isAddress = false,
}) => {
  const baseUrl = 'https://sepolia.etherscan.com';

  const link = !isAddress
    ? `${baseUrl}/tx/${hashOrAddress}`
    : `${baseUrl}/address/${hashOrAddress}`;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {hashOrAddress}
    </a>
  );
};

export default ExplorerLink;
