import Box from "@mui/material/Box"
import { useEffect, useState } from "react";
import { chainIdToName, getNativeTokenSymbol } from "./navigation.data";
import { ethers, isAddress } from "ethers";

const ConnectButton = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>('0');

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWalletAddress(accounts[0]);
    }
  };

  const handleChainChanged = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    setChainId(network.chainId.toString());
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setWalletAddress(address);
      setChainId(network.chainId.toString());

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setChainId(null);
  };

  const toggleWalletConnection = () => {

    if (!window.ethereum) {
      alert("Please install MetaMask to continue.");
      return;
    }

    if (walletAddress) {
      disconnectWallet();
      return
    }

    connectWallet();
  };

  const handleGetBalance = async (address: string) => {
    if (!window.ethereum || !isAddress(address)) {
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const weiBalance = await provider.getBalance(address);
    setBalance(ethers.formatEther(weiBalance));
  }

  useEffect(() => {
    connectWallet()

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=>{
    if(!walletAddress || !chainId) return

    handleGetBalance(walletAddress)

  }, [walletAddress, chainId])


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
    {walletAddress && chainId && balance && (
      <Box sx={{ fontSize: "12px", color: "#fff", fontWeight: 500, mt: 0.5 }}>
        {chainIdToName[chainId] || `Chain ${chainId}`} {balance && `- ${+parseFloat(balance).toFixed(7)} ${getNativeTokenSymbol(chainId)}`}
      </Box>
    )}
  </Box>

}

export default ConnectButton;