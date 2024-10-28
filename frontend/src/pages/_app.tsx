// pages/_app.tsx
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import config from "../wagmi";
import { config as fontawesomeConfig } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";
import "../styles/Footer.css";
import "../styles/Header.css";
import "../styles/Proposals.css"

import Header from "../components/Header"
import Footer from "../components/Footer";

fontawesomeConfig.autoAddCss = false;
const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={client}>
                <RainbowKitProvider>
                    <Header />
                    <main>
                        <Component {...pageProps} />
                    </main>
                    <Footer />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default MyApp;
