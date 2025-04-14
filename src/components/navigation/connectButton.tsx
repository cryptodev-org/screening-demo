import Box from "@mui/material/Box"
import { useEffect, useState } from "react";
import { chainIdToName } from "./navigation.data";
import { ethers } from "ethers";

const ConnectButton = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask не установлен!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const ensName = await provider.lookupAddress(address);
      const network = await provider.getNetwork();

      setWalletAddress(ensName || address);
      setNetworkName(chainIdToName[network.chainId.toString()] || `Chain ${network.chainId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setNetworkName(null);
  };

  const toggleWalletConnection = () => {
    if (walletAddress) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  useEffect(() => {
    if (!walletAddress) return

    const handleChainChanged = async () => {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setNetworkName(chainIdToName[network.chainId.toString()] || `Chain ${network.chainId}`);
    };

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWalletAddress(accounts[0]);
      }
    };

    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      if (!window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [walletAddress]);

  return <Box
    onClick={toggleWalletConnection}
    sx={{
      position: "relative",
      color: "white",
      cursor: "pointer",
      textDecoration: "none",
      textTransform: "uppercase",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      px: { xs: 0, lg: 3 },
      mb: { xs: 3, lg: 0 },
      fontSize: "18px",
      width: "324px",
      height: "45px",
      borderRadius: "6px",
      backgroundColor: walletAddress ? "#ff5252" : "#00dbe3",
      flexDirection: "column",
      textAlign: "center",
      transition: "0.3s all ease-in-out"
    }}
  >
    {walletAddress
      ? `Disconnect (${walletAddress.includes(".eth") ? walletAddress : `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`})`
      : "Connect Wallet"}
    {networkName && (
      <Box sx={{ fontSize: "12px", color: "#fff", fontWeight: 500, mt: 0.5 }}>
        {networkName}
      </Box>
    )}
  </Box>

}

export default ConnectButton;