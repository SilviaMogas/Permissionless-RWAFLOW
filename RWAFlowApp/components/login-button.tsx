'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { useAccount, useDisconnect } from 'wagmi'

export function LoginButton() {
  const { login, logout, authenticated, user } = usePrivy()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const handleAuth = () => {
    if (authenticated) {
      logout()
      if (isConnected) {
        disconnect()
      }
    } else {
      login()
    }
  }

  if (authenticated) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">
          {address && (
            <div className="font-medium">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </div>
          )}
          {user?.email?.address && (
            <div className="text-xs text-gray-500">
              {user.email.address}
            </div>
          )}
        </div>
        <Button 
          onClick={handleAuth} 
          variant="outline"
          className="border-metallic-green text-metallic-green hover:bg-emerald-50"
        >
          Logout
        </Button>
      </div>
    )
  }

  return (
    <Button 
      onClick={handleAuth} 
      className="bg-green-gradient text-white hover:opacity-90 transition-opacity"
    >
      Login
    </Button>
  )
}