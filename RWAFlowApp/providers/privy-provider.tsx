'use client'

import { PrivyProvider, PrivyClientConfig } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig, flowTestnet } from './wagmi-config'

const queryClient = new QueryClient()

// Privy configuration
const privyConfig: PrivyClientConfig = {
  loginMethods: ['email', 'wallet', 'google', 'twitter'],
  appearance: {
    theme: 'light',
    accentColor: '#10B981', // emerald-500 to match your theme
    logo: '/flow-passport-logo.png',
    showWalletLoginFirst: true,
  },
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: false,
  },
  defaultChain: flowTestnet,
  supportedChains: [flowTestnet],
}

interface PrivyWagmiProviderProps {
  children: React.ReactNode
}

export function PrivyWagmiProvider({ children }: PrivyWagmiProviderProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}