import {Button} from "@mui/material";
import WalletConnectionModal from "../WalletConnectionModal";
import React from "react";
import {useAccount, useDisconnect, useBalance} from "wagmi";

const WalletConnectionButton = () => {
    const [showModal, setShowModal] = React.useState(false);
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();

    return (
        <>
            <Button
                onClick={() => isConnected ? disconnect() : setShowModal(true) }
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
                    fontSize: isConnected ? "16px" : "24px",
                    lineHeight: "6px",
                    width: "324px",
                    height: "45px",
                    borderRadius: "6px",
                    backgroundColor: "#00dbe3"
                }}
            >
                {isConnected ? `Disconnect ${address?.slice(0,6)}...${address?.slice(-6)}` : "Connect Wallet"}
            </Button>
            {showModal && (
                <WalletConnectionModal show={showModal} setShow={setShowModal} />
            )}
        </>
    )
};

export default WalletConnectionButton;
