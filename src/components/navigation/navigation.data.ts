export const navigations = [
  { label: "Explore", path: "/explore" },
  { label: "Offers", path: "/offers" },
  { label: "History", path: "/history" },
  { label: "Language", path: "/language" }
];

export const chainIdToName: Record<string, string> = {
  "1": "Ethereum",
  "5": "Goerli",
  "56": "BSC",
  "11155111": "Sepolia",
  "137": "Polygon",
  "10": "Optimism",
  "8453": "Base",
};

const nativeSymbols: Record<string, string> = {
  '1': "ETH",
  '5': "ETH",
  '8453': "ETH",
  '11155111': "ETH",
  '137': "MATIC",
  '80001': "MATIC",
  '56': "BNB",
  '10': "ETH",
  '43114': "AVAX",
  '250': "FTM",
};


export const getNativeTokenSymbol = (chainId: string): string => {
  return nativeSymbols[chainId] || "ETH";
};
