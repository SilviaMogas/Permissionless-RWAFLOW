'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { flowTestnet } from '@/providers/wagmi-config'

// Asset Marketplace Contract ABI (simplified for the functions we need)
const ASSET_MARKETPLACE_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "assetId", "type": "string"}],
    "name": "purchaseAsset",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}, {"internalType": "string", "name": "assetId", "type": "string"}],
    "name": "hasAsset",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserAssets",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "assetId", "type": "string"}],
    "name": "getAssetPriceInFLOW",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "assetId", "type": "string"}],
    "name": "getAssetPriceInUSD",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "usdToFlowRate",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "string", "name": "assetId", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "priceUSD", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "priceFLOW", "type": "uint256"}
    ],
    "name": "AssetPurchased",
    "type": "event"
  }
] as const

// Contract address - this will be updated after deployment
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ASSET_MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`

interface PurchaseTransaction {
  assetId: string
  txHash: string
  timestamp: number
  priceUSD: number
  priceFLOW: string
}

interface UseAssetMarketplaceReturn {
  // State
  isLoading: boolean
  error: string | null
  userAssets: string[]
  
  // Functions
  hasAsset: (assetId: string) => boolean
  purchaseAsset: (assetId: string, priceUSD: number) => Promise<void>
  getAssetPriceInFLOW: (assetId: string) => string | null
  refreshUserAssets: () => void
  getAssetTransactionHash: (assetId: string) => string | null
  getFlowScanUrl: (assetId: string) => string | null
  
  // Transaction state
  isPurchasing: boolean
  purchaseError: string | null
  purchaseSuccess: boolean
  purchaseTransactions: PurchaseTransaction[]
}

export function useAssetMarketplace(): UseAssetMarketplaceReturn {
  const { address, isConnected } = useAccount()
  const [userAssets, setUserAssets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [purchaseTransactions, setPurchaseTransactions] = useState<PurchaseTransaction[]>([])

  // Contract interaction hooks
  const { writeContract, data: purchaseHash, isPending: isWritePending } = useWriteContract()
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: purchaseHash,
  })

  // Read user assets from contract
  const { data: contractUserAssets, refetch: refetchUserAssets } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ASSET_MARKETPLACE_ABI,
    functionName: 'getUserAssets',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!CONTRACT_ADDRESS,
  })

  // Read USD to FLOW conversion rate
  const { data: conversionRate } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ASSET_MARKETPLACE_ABI,
    functionName: 'usdToFlowRate',
    enabled: !!CONTRACT_ADDRESS,
  })

  // Update user assets when contract data changes
  useEffect(() => {
    if (contractUserAssets) {
      setUserAssets(contractUserAssets as string[])
    }
  }, [contractUserAssets])

  // Store current purchase info for when transaction confirms
  const [currentPurchase, setCurrentPurchase] = useState<{assetId: string, priceUSD: number} | null>(null)

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && purchaseHash && currentPurchase) {
      // Store transaction record
      const transaction: PurchaseTransaction = {
        assetId: currentPurchase.assetId,
        txHash: purchaseHash,
        timestamp: Date.now(),
        priceUSD: currentPurchase.priceUSD,
        priceFLOW: (currentPurchase.priceUSD * Number(conversionRate || 0)).toString()
      }
      
      setPurchaseTransactions(prev => [...prev, transaction])
      
      // Store in localStorage for persistence
      const storageKey = `asset_transactions_${address}`
      const existingTransactions = JSON.parse(localStorage.getItem(storageKey) || '[]')
      localStorage.setItem(storageKey, JSON.stringify([...existingTransactions, transaction]))
      
      setPurchaseSuccess(true)
      setIsPurchasing(false)
      setPurchaseError(null)
      setCurrentPurchase(null)
      
      // Refresh user assets after successful purchase
      refetchUserAssets()
      
      // Reset success state after 3 seconds
      setTimeout(() => setPurchaseSuccess(false), 3000)
    }
  }, [isConfirmed, purchaseHash, currentPurchase, address, conversionRate, refetchUserAssets])

  // Load transaction history from localStorage when address changes
  useEffect(() => {
    if (address) {
      const storageKey = `asset_transactions_${address}`
      const storedTransactions = JSON.parse(localStorage.getItem(storageKey) || '[]')
      setPurchaseTransactions(storedTransactions)
    } else {
      setPurchaseTransactions([])
    }
  }, [address])

  // Update purchasing state
  useEffect(() => {
    setIsPurchasing(isWritePending || isConfirming)
  }, [isWritePending, isConfirming])

  const hasAsset = (assetId: string): boolean => {
    return userAssets.includes(assetId)
  }

  const getAssetPriceInFLOW = (assetId: string): string | null => {
    if (!conversionRate) return null
    
    // Asset prices in USD (hardcoded as per the contract)
    const assetPrices: Record<string, number> = {
      '1': 500, // Lisbon Apartment
      '2': 300, // NFT Art Fund
      '3': 200, // Brazil Coffee Loan
      '4': 1000, // Green Energy Bond
      '5': 750, // Corporate Debt Fund
    }
    
    const priceUSD = assetPrices[assetId]
    if (!priceUSD) return null
    
    const priceFLOW = priceUSD * Number(conversionRate)
    return priceFLOW.toString()
  }

  const purchaseAsset = async (assetId: string, priceUSD: number): Promise<void> => {
    if (!isConnected || !address) {
      setPurchaseError('Please connect your wallet')
      return
    }

    if (!CONTRACT_ADDRESS) {
      setPurchaseError('Contract address not configured')
      return
    }

    if (!conversionRate) {
      setPurchaseError('Unable to get conversion rate')
      return
    }

    try {
      setPurchaseError(null)
      setPurchaseSuccess(false)
      
      // Store current purchase info for transaction confirmation
      setCurrentPurchase({ assetId, priceUSD })
      
      // Calculate price in FLOW
      const priceFLOW = priceUSD * Number(conversionRate)
      const priceInWei = parseEther(priceFLOW.toString())

      // Execute the purchase transaction
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ASSET_MARKETPLACE_ABI,
        functionName: 'purchaseAsset',
        args: [assetId],
        value: priceInWei,
      })
    } catch (err) {
      console.error('Purchase error:', err)
      setPurchaseError(err instanceof Error ? err.message : 'Purchase failed')
      setIsPurchasing(false)
      setCurrentPurchase(null)
    }
  }

  const refreshUserAssets = () => {
    refetchUserAssets()
  }

  const getAssetTransactionHash = (assetId: string): string | null => {
    const transaction = purchaseTransactions.find(tx => tx.assetId === assetId)
    return transaction?.txHash || null
  }

  const getFlowScanUrl = (assetId: string): string | null => {
    const txHash = getAssetTransactionHash(assetId)
    if (!txHash) return null
    return `https://evm-testnet.flowscan.io/tx/${txHash}`
  }

  return {
    isLoading,
    error,
    userAssets,
    hasAsset,
    purchaseAsset,
    getAssetPriceInFLOW,
    refreshUserAssets,
    getAssetTransactionHash,
    getFlowScanUrl,
    isPurchasing,
    purchaseError,
    purchaseSuccess,
    purchaseTransactions,
  }
}