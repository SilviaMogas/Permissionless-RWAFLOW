'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useAccount, useBalance } from 'wagmi'
import { flowTestnet } from '@/providers/wagmi-config'

export function useAuth() {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
  
  // During build time or when Privy is not configured, return mock data
  if (!appId || appId === 'dummy-build-value') {
    return {
      // Privy auth state
      isAuthenticated: false,
      user: null,
      login: () => {},
      logout: () => {},
      
      // Wallet state
      address: undefined,
      isConnected: false,
      balance: undefined,
      
      // Chain info
      chainId: flowTestnet.id,
      chainName: flowTestnet.name,
    }
  }

  const { authenticated, user, login, logout } = usePrivy()
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address || undefined,
    chainId: flowTestnet.id,
  })

  return {
    // Privy auth state
    isAuthenticated: authenticated,
    user,
    login,
    logout,
    
    // Wallet state
    address,
    isConnected,
    balance,
    
    // Chain info
    chainId: flowTestnet.id,
    chainName: flowTestnet.name,
  }
}