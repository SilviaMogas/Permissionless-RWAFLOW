'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useAccount, useBalance } from 'wagmi'
import { flowTestnet } from '@/providers/wagmi-config'

export function useAuth() {
  const { authenticated, user, login, logout } = usePrivy()
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address,
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