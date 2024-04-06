'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import {baseSepolia} from 'viem/chains';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
          logo: '/dripcast.png',
        },
        defaultChain: baseSepolia,
        loginMethods: ['farcaster'],
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
