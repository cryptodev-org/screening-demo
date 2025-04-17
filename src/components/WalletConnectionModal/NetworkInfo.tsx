import {useAccount, useBalance,} from "wagmi";
import {Box} from "@mui/material";

const NetworkInfo = () => {
    const { chain, address, isConnected } = useAccount()
    const { data } = useBalance({ address})

    if (!isConnected) return null

    return (
        <Box
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
                fontSize: "16px",
                lineHeight: "6px",
                width: "324px",
                height: "45px",
                borderRadius: "6px",
            }}
        >
            {chain?.name} - {data?.formatted} {data?.symbol}
        </Box>
    )

}

export default NetworkInfo
