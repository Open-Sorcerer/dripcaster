'use client';

import './globals.css';
import {Navbar} from '@/components';
import Providers from './providers';
import {Toaster} from 'react-hot-toast';
// import {DynamicContextProvider} from '@dynamic-labs/sdk-react-core';
// import {EthereumWalletConnectors} from '@dynamic-labs/ethereum';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import config from '../../utils/wagmi';
// import {WagmiProvider} from 'wagmi';
// import {ConnectKitProvider} from 'connectkit';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen bg-gradient-radial from-[#1b4142] via-[#0e302b] to-[#0E0E0E]">
        {/* <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider theme="retro"> */}
        <Providers>
          <Navbar />
          {/* <DynamicContextProvider
                  settings={{
                    environmentId: process.env.NEXT_PUBLIC_DYNAMIC_APP_KEY as string,
                    walletConnectors: [EthereumWalletConnectors],
                  }}
                > */}
          {children}
          {/* </DynamicContextProvider> */}
        </Providers>
        {/* </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider> */}
        <Toaster />
      </body>
    </html>
  );
}
