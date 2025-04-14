import Box from "@mui/material/Box"
import { useEffect, useState } from "react";
import { chainIdToName, getNativeTokenSymbol, IS_WALLET_CONNECTED } from "./navigation.data";
import { ethers, isAddress } from "ethers";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from '@mui/icons-material/Logout';

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
      localStorage.setItem(IS_WALLET_CONNECTED, 'true');

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setChainId(null);
    localStorage.removeItem(IS_WALLET_CONNECTED);
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

    if (JSON.parse(localStorage.getItem(IS_WALLET_CONNECTED) || 'false')) {
      connectWallet()
    }

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!walletAddress || !chainId) return

    handleGetBalance(walletAddress)

  }, [walletAddress, chainId])


  return <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center', gap: 1.2, width: "324px" }}>
    {walletAddress && chainId && balance && <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
      <Box sx={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
        {walletAddress.includes(".eth")
          ? walletAddress
          : `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
      </Box>
      <Box sx={{ display: "flex", gap: 2, fontSize: "13px", fontWeight: 500 }}>
        <Box
          sx={{
            background: "#ffffff22",
            px: 2,
            py: 0.5,
            borderRadius: "6px",
            color: "#fff",
          }}
        >
          {chainIdToName[chainId] || `${chainId}`}
        </Box>
        <Box
          sx={{
            background: "#ffffff22",
            px: 2,
            py: 0.5,
            borderRadius: "6px",
            color: "#fff",
          }}
        >
          {+parseFloat(balance).toFixed(5)} {getNativeTokenSymbol(chainId)}
        </Box>
      </Box>

    </Box>}
    <Box
      onClick={toggleWalletConnection}
      sx={{
        color: "white",
        cursor: "pointer",
        textDecoration: "none",
        textTransform: "uppercase",
        fontWeight: 600,
        fontSize: "18px",
        width: walletAddress ? "48px" : '100%',
        padding: "10px",
        borderRadius: "10px",
        background: walletAddress ? "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)" : "linear-gradient(270deg, #00dbde, #fc00ff, #ff4b2b, #00dbde)",
        backgroundSize: walletAddress ? undefined : "600% 600%",
        animation: walletAddress ? undefined : "gradientShift 5s ease infinite",
        boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
        },
      }}
    >
      {walletAddress ? (
        <LogoutIcon />
      ) : (
        <>
          <AccountBalanceWalletIcon sx={{ mr: 1 }} />
          Connect Wallet
        </>
      )}
    </Box>
  </Box>

}

export default ConnectButton;