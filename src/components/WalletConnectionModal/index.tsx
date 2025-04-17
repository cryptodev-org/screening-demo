import {
    Box,
    Button,
    Typography,
    Modal,
    IconButton,
    Paper,
    Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactComponent as IconCloseTab } from "../../assets/svg/wallet/CloseTab.svg";
import { ReactComponent as IconMetaMask } from "../../assets/svg/wallet/MetaMask.svg";
import { ReactComponent as IconWalletConnect } from "../../assets/svg/wallet/WalletConnect.svg";
import { ReactComponent as IconCoinbase } from "../../assets/svg/wallet/Coinbase.svg";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const errorMessages = {
    UserRejectedRequestError: 'User rejected the request',
    ConnectorNotFoundError: 'Connector not found',
    ProviderNotFoundError: 'Wallet not found, please install it',
}

// Styled components
const WalletIconWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    width: '48px',
    height: '48px',
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(2)
}));

interface WalletButtonProps {
    walletcolor?: string;
}

const WalletButton = styled(Button)<WalletButtonProps>(({ theme, ...props }) => {
    const walletcolor = props.walletcolor || '#FF914D';
    return  {
            width: '100%',
            backgroundColor: walletcolor,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(0.5),
            margin: `${theme.spacing(1)} 0`,
            justifyContent: 'space-between',
            position: 'relative',
            '&:hover': {
                backgroundColor: walletcolor,
                opacity: 0.9
            }
        }
});

const OverlayBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(4px)',
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}));

const modalStyle = {
    position: 'absolute',
    top: '200px',
    left: '50%',
    transform: 'translateX(-50%)',
    outline: 'none'
};

const Wallets = [
    {
        color: "#FF914D",
        icon: <IconMetaMask />,
        name: "MetaMask",
    },
    {
        color: "#3396ffdd",
        icon: <IconWalletConnect />,
        name: "WalletConnect",
    },
    {
        color: "#0052ffdd",
        icon: <IconCoinbase />,
        name: "Coinbase Wallet",
    },
];

const WalletConnectionModal = ({ show, setShow }: { show: boolean, setShow: (v: boolean) => void}) => {
    const { connect, connectors, error, } = useConnect();
    const { connector, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    if (!show) return null;

    return (
        <Modal
            open={true}
            onClose={() => setShow(false)}
            aria-labelledby="wallet-connection-modal"
        >
            <Paper sx={{ ...modalStyle, width: { xs: '90%', md: '550px' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => setShow(false)} sx={{ m: 2 }}>
                        <IconCloseTab />
                    </IconButton>
                </Box>

                <Box sx={{ px: 5, pb: 4 }}>
                    <Typography variant="h4" sx={{  fontWeight: 600, fontSize: '1.5rem' }}>
                        Connect wallet
                    </Typography>

                    <Typography variant="body1" fontFamily="Inter">
                        By connecting your wallet, you agree to{' '}
                        <Link underline="always" color="primary">Terms of Service</Link>
                        {' '}and{' '}
                        <Link underline="always" color="primary">Privacy policy</Link>.
                    </Typography>

                    <Box sx={{ my: 3 }}>
                        {Wallets.map((wallet, i) => (
                            <WalletButton
                                key={wallet.name}
                                walletcolor={wallet.color}
                                onClick={() =>
                                    isConnected && connector?.id === connectors[i].id
                                        ? disconnect()
                                        : connect({ connector: connectors[i] })
                                }
                                disabled={(isConnected && connector?.id !== connectors[i].id)}
                            >
                                {isConnected && connector?.id === connectors[i].id && (
                                    <OverlayBox>
                                        <Typography
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.95)',
                                                fontSize: '1.125rem'
                                            }}
                                        >
                                            Disconnect
                                        </Typography>
                                    </OverlayBox>
                                )}

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <WalletIconWrapper>
                                        {wallet.icon}
                                    </WalletIconWrapper>
                                    <Box>
                                        <Typography
                                            sx={{
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            {wallet.name}
                                        </Typography>
                                    </Box>
                                </Box>

                            </WalletButton>
                        ))}

                        {error && (
                            <Typography
                                sx={{
                                    color: 'error.main',
                                    fontSize: '0.875rem',
                                    textAlign: 'center',
                                    m: 2
                                }}
                            >
                                {error.name in errorMessages
                                    ? errorMessages[error.name as keyof typeof errorMessages]
                                    : error.message}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
};

export default WalletConnectionModal;
