import React from "react";
import "./App.css";
import "./assets/css/globals.css";
// import "./assets/css/react-slick.css";
// import "slick-carousel/slick/slick.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useRoutes } from "react-router-dom";
import Router from "./routes/Router";
import theme from "./theme";
import {WagmiProvider} from "wagmi";
import {wagmiConfig} from "./config/wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

function App() {
  const routing = useRoutes(Router);
  return (
    <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <div className="App">{routing}</div>
            </ThemeProvider>
        </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
