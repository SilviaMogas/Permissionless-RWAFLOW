'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { toast } from 'sonner'
import { useMembershipSystem } from './use-membership-system'

// AssetMarketplaceV2 Contract ABI
const MARKETPLACE_V2_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "assetId", "type": "string"}],
    "name": "purchaseAsset",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "string", "name": "assetId", "type": "string"}
    ],
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
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserAssetCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
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
    "inputs": [{"internalType": "string", "name": "assetId", "type": "string"}],
    "name": "getAssetDetails",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "uint256", "name": "priceUSD", "type": "uint256"},
          {"internalType": "bool", "name": "exists", "type": "bool"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "string", "name": "category", "type": "string"},
          {"internalType": "string", "name": "metadata", "type": "string"}
        ],
        "internalType": "struct AssetMarketplaceV2.Asset",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "assetId", "type": "string"}],
    "name": "getAssetPurchaseCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllAssetIds",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllAssetsWithDetails",
    "outputs": [
      {"internalType": "string[]", "name": "assetIds", "type": "string[]"},
      {"internalType": "string[]", "name": "names", "type": "string[]"},
      {"internalType": "uint256[]", "name": "pricesUSD", "type": "uint256[]"},
      {"internalType": "uint256[]", "name": "pricesFLOW", "type": "uint256[]"},
      {"internalType": "string[]", "name": "categories", "type": "string[]"},
      {"internalType": "uint256[]", "name": "purchaseCounts", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "string", "name": "category", "type": "string"}
    ],
    "name": "getUserAssetsByCategory",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getTotalValueOfUserAssets",
    "outputs": [
      {"internalType": "uint256", "name": "totalUSD", "type": "uint256"},
      {"internalType": "uint256", "name": "totalFLOW", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string[]", "name": "assetIds", "type": "string[]"}],
    "name": "batchPurchaseAssets",
    "outputs": [],
    "stateMutability": "payable",
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
      {"indexed": false, "internalType": "uint256", "name": "priceFLOW", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "membershipTokenId", "type": "uint256"}
    ],
    "name": "AssetPurchased",
    "type": "event"
  }
] as const

// Contract address
const MARKETPLACE_V2_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_V2_CONTRACT_ADDRESS as `0x${string}`

// Asset information (matches contract data)
export const ASSET_INFO = {
  '1': { name: 'Lisbon Apartment', category: 'Real Estate', description: 'Prime European real estate exposure' },
  '2': { name: 'NFT Art Fund', category: 'Digital Assets', description: 'Curated blue-chip NFT collection' },
  '3': { name: 'Brazil Coffee Loan', category: 'Commodities', description: 'Agricultural commodity financing' },
  '4': { name: 'Green Energy Bond', category: 'ESG Investment', description: 'Sustainable energy infrastructure' },
  '5': { name: 'Corporate Debt Fund', category: 'Fixed Income', description: 'Diversified corporate credit exposure' }
}

// Types
interface AssetDetails {
  name: string
  priceUSD: number
  exists: boolean
  description: string
  category: string
  metadata: string
}

interface AssetWithStats {
  id: string
  name: string
  priceUSD: number
  priceFLOW: number
  category: string
  purchaseCount: number
  description: string
  metadata: any
}

interface PurchaseTransaction {
  assetId: string
  txHash: string
  timestamp: number
  priceUSD: number
  priceFLOW: string
  membershipTokenId?: number
}

interface UserPortfolio {
  totalAssets: number
  totalValueUSD: number
  totalValueFLOW: number
  assetsByCategory: Record<string, string[]>
  assets: string[]
}

interface UseMarketplaceV2Return {
  // State
  isLoading: boolean
  error: string | null
  userAssets: string[]
  allAssets: AssetWithStats[]
  userPortfolio: UserPortfolio | null
  
  // Functions
  hasAsset: (assetId: string) => boolean
  purchaseAsset: (assetId: string) => Promise<void>
  batchPurchaseAssets: (assetIds: string[]) => Promise<void>
  getAssetDetails: (assetId: string) => AssetDetails | null
  refreshUserAssets: () => void
  getAssetTransactionHash: (assetId: string) => string | null
  getFlowScanUrl: (assetId: string) => string | null
  
  // Portfolio functions
  getUserAssetsByCategory: (category: string) => string[]
  getTotalPortfolioValue: () => { usd: number; flow: number }
  getPortfolioDistribution: () => Record<string, number>
  
  // Transaction state
  isPurchasing: boolean
  purchaseError: string | null
  purchaseSuccess: boolean
  purchaseTransactions: PurchaseTransaction[]
  currentPurchaseAssetId: string | null
}

export function useMarketplaceV2(): UseMarketplaceV2Return {
  const { address, isConnected } = useAccount()
  const [userAssets, setUserAssets] = useState<string[]>([])
  const [allAssets, setAllAssets] = useState<AssetWithStats[]>([])
  const [userPortfolio, setUserPortfolio] = useState<UserPortfolio | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [purchaseTransactions, setPurchaseTransactions] = useState<PurchaseTransaction[]>([])
  const [currentPurchaseAssetId, setCurrentPurchaseAssetId] = useState<string | null>(null)
  const { ensureMembership, refreshProfile } = useMembershipSystem()

  // Contract interaction hooks
  const { writeContract, data: purchaseHash, isPending: isWritePending } = useWriteContract()
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: purchaseHash,
  })

  // Read user assets from contract
  const { data: contractUserAssets, refetch: refetchUserAssets } = useReadContract({
    address: MARKETPLACE_V2_CONTRACT_ADDRESS,
    abi: MARKETPLACE_V2_ABI,
    functionName: 'getUserAssets',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!MARKETPLACE_V2_CONTRACT_ADDRESS,
  })

  // Read all assets with details
  const { data: allAssetsData, refetch: refetchAllAssets } = useReadContract({
    address: MARKETPLACE_V2_CONTRACT_ADDRESS,
    abi: MARKETPLACE_V2_ABI,
    functionName: 'getAllAssetsWithDetails',
    enabled: !!MARKETPLACE_V2_CONTRACT_ADDRESS,
  })

  // Read user portfolio value
  const { data: portfolioValue, refetch: refetchPortfolioValue } = useReadContract({
    address: MARKETPLACE_V2_CONTRACT_ADDRESS,
    abi: MARKETPLACE_V2_ABI,
    functionName: 'getTotalValueOfUserAssets',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!MARKETPLACE_V2_CONTRACT_ADDRESS,
  })

  // Read USD to FLOW conversion rate
  const { data: conversionRate } = useReadContract({
    address: MARKETPLACE_V2_CONTRACT_ADDRESS,
    abi: MARKETPLACE_V2_ABI,
    functionName: 'usdToFlowRate',
    enabled: !!MARKETPLACE_V2_CONTRACT_ADDRESS,
  })

  // Update user assets when contract data changes
  useEffect(() => {
    if (contractUserAssets) {
      setUserAssets(contractUserAssets as string[])
    }
  }, [contractUserAssets])

  // Update all assets when contract data changes
  useEffect(() => {
    if (allAssetsData && Array.isArray(allAssetsData) && allAssetsData.length === 6) {
      const [assetIds, names, pricesUSD, pricesFLOW, categories, purchaseCounts] = allAssetsData
      
      const assets: AssetWithStats[] = assetIds.map((id: string, index: number) => {
        const metadata = ASSET_INFO[id as keyof typeof ASSET_INFO]
        return {
          id,
          name: names[index],
          priceUSD: Number(pricesUSD[index]),
          priceFLOW: Number(pricesFLOW[index]),
          category: categories[index],
          purchaseCount: Number(purchaseCounts[index]),
          description: metadata?.description || '',
          metadata: {}
        }
      })
      
      setAllAssets(assets)
    }
  }, [allAssetsData])

  // Update user portfolio
  useEffect(() => {
    if (contractUserAssets && portfolioValue && allAssets.length > 0) {
      const assetsByCategory: Record<string, string[]> = {}
      
      // Group assets by category
      contractUserAssets.forEach((assetId: string) => {
        const asset = allAssets.find(a => a.id === assetId)
        if (asset) {
          if (!assetsByCategory[asset.category]) {
            assetsByCategory[asset.category] = []
          }
          assetsByCategory[asset.category].push(assetId)
        }
      })
      
      setUserPortfolio({
        totalAssets: contractUserAssets.length,
        totalValueUSD: Number(portfolioValue[0]),
        totalValueFLOW: Number(portfolioValue[1]),
        assetsByCategory,
        assets: contractUserAssets as string[]
      })
    }
  }, [contractUserAssets, portfolioValue, allAssets])

  // Store current purchase info for when transaction confirms
  const [currentPurchase, setCurrentPurchase] = useState<{assetId: string} | null>(null)

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && purchaseHash && currentPurchase) {
      const asset = allAssets.find(a => a.id === currentPurchase.assetId)
      
      // Store transaction record
      const transaction: PurchaseTransaction = {
        assetId: currentPurchase.assetId,
        txHash: purchaseHash,
        timestamp: Date.now(),
        priceUSD: asset?.priceUSD || 0,
        priceFLOW: asset ? (asset.priceUSD * Number(conversionRate || 0)).toString() : '0'
      }
      
      setPurchaseTransactions(prev => [...prev, transaction])
      
      // Store in localStorage for persistence
      const storageKey = `asset_transactions_v2_${address}`
      const existingTransactions = JSON.parse(localStorage.getItem(storageKey) || '[]')
      localStorage.setItem(storageKey, JSON.stringify([...existingTransactions, transaction]))
      
      setPurchaseSuccess(true)
      setIsPurchasing(false)
      setPurchaseError(null)
      setCurrentPurchase(null)
      setCurrentPurchaseAssetId(null)
      
      // Refresh data after successful purchase
      refetchUserAssets()
      refetchAllAssets()
      refetchPortfolioValue()
      refreshProfile() // Refresh membership profile to get updated counts
      
      toast.success(`${asset?.name || 'Asset'} purchased successfully! Asset ownership recorded.`)
      
      // Reset success state after 3 seconds
      setTimeout(() => setPurchaseSuccess(false), 3000)
    }
  }, [isConfirmed, purchaseHash, currentPurchase, address, conversionRate, allAssets, refetchUserAssets, refetchAllAssets, refetchPortfolioValue, refreshProfile])

  // Load transaction history from localStorage when address changes
  useEffect(() => {
    if (address) {
      const storageKey = `asset_transactions_v2_${address}`
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

  const getAssetDetails = (assetId: string): AssetDetails | null => {
    const asset = allAssets.find(a => a.id === assetId)
    if (!asset) return null
    
    return {
      name: asset.name,
      priceUSD: asset.priceUSD,
      exists: true,
      description: asset.description,
      category: asset.category,
      metadata: JSON.stringify(asset.metadata)
    }
  }

  const purchaseAsset = async (assetId: string): Promise<void> => {
    if (!isConnected || !address) {
      setPurchaseError('Please connect your wallet')
      toast.error('Please connect your wallet')
      return
    }

    if (!MARKETPLACE_V2_CONTRACT_ADDRESS) {
      setPurchaseError('Marketplace V2 contract not configured')
      toast.error('Marketplace V2 contract not configured')
      return
    }

    const asset = allAssets.find(a => a.id === assetId)
    if (!asset) {
      setPurchaseError('Asset not found')
      toast.error('Asset not found')
      return
    }

    if (hasAsset(assetId)) {
      setPurchaseError('You already own this asset')
      toast.error('You already own this asset')
      return
    }

    try {
      setPurchaseError(null)
      setPurchaseSuccess(false)
      setCurrentPurchaseAssetId(assetId)
      
      // Ensure user has membership before purchase
      await ensureMembership()
      
      // Store current purchase info for transaction confirmation
      setCurrentPurchase({ assetId })
      
      // Calculate price in wei
      const priceInWei = parseEther(asset.priceFLOW.toString())

      // Execute the purchase transaction
      writeContract({
        address: MARKETPLACE_V2_CONTRACT_ADDRESS,
        abi: MARKETPLACE_V2_ABI,
        functionName: 'purchaseAsset',
        args: [assetId],
        value: priceInWei,
      })
    } catch (err) {
      console.error('Purchase error:', err)
      setPurchaseError(err instanceof Error ? err.message : 'Purchase failed')
      setIsPurchasing(false)
      setCurrentPurchase(null)
      setCurrentPurchaseAssetId(null)
      toast.error('Purchase failed')
    }
  }

  const batchPurchaseAssets = async (assetIds: string[]): Promise<void> => {
    if (!isConnected || !address) {
      setPurchaseError('Please connect your wallet')
      toast.error('Please connect your wallet')
      return
    }

    if (!MARKETPLACE_V2_CONTRACT_ADDRESS) {
      setPurchaseError('Marketplace V2 contract not configured')
      toast.error('Marketplace V2 contract not configured')
      return
    }

    const validAssets = assetIds.filter(id => {
      const asset = allAssets.find(a => a.id === id)
      return asset && !hasAsset(id)
    })

    if (validAssets.length === 0) {
      setPurchaseError('No valid assets to purchase')
      toast.error('No valid assets to purchase')
      return
    }

    try {
      setPurchaseError(null)
      setPurchaseSuccess(false)
      
      // Ensure user has membership before purchase
      await ensureMembership()
      
      // Calculate total price
      const totalPrice = validAssets.reduce((sum, assetId) => {
        const asset = allAssets.find(a => a.id === assetId)
        return sum + (asset?.priceFLOW || 0)
      }, 0)
      
      const totalPriceInWei = parseEther(totalPrice.toString())

      // Execute the batch purchase transaction
      writeContract({
        address: MARKETPLACE_V2_CONTRACT_ADDRESS,
        abi: MARKETPLACE_V2_ABI,
        functionName: 'batchPurchaseAssets',
        args: [validAssets],
        value: totalPriceInWei,
      })
    } catch (err) {
      console.error('Batch purchase error:', err)
      setPurchaseError(err instanceof Error ? err.message : 'Batch purchase failed')
      setIsPurchasing(false)
      toast.error('Batch purchase failed')
    }
  }

  const refreshUserAssets = () => {
    refetchUserAssets()
    refetchAllAssets()
    refetchPortfolioValue()
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

  const getUserAssetsByCategory = (category: string): string[] => {
    return userPortfolio?.assetsByCategory[category] || []
  }

  const getTotalPortfolioValue = (): { usd: number; flow: number } => {
    return {
      usd: userPortfolio?.totalValueUSD || 0,
      flow: userPortfolio?.totalValueFLOW || 0
    }
  }

  const getPortfolioDistribution = (): Record<string, number> => {
    if (!userPortfolio) return {}
    
    const distribution: Record<string, number> = {}
    const totalValue = userPortfolio.totalValueUSD
    
    Object.entries(userPortfolio.assetsByCategory).forEach(([category, assetIds]) => {
      const categoryValue = assetIds.reduce((sum, assetId) => {
        const asset = allAssets.find(a => a.id === assetId)
        return sum + (asset?.priceUSD || 0)
      }, 0)
      
      distribution[category] = totalValue > 0 ? (categoryValue / totalValue) * 100 : 0
    })
    
    return distribution
  }

  return {
    isLoading,
    error,
    userAssets,
    allAssets,
    userPortfolio,
    hasAsset,
    purchaseAsset,
    batchPurchaseAssets,
    getAssetDetails,
    refreshUserAssets,
    getAssetTransactionHash,
    getFlowScanUrl,
    getUserAssetsByCategory,
    getTotalPortfolioValue,
    getPortfolioDistribution,
    isPurchasing,
    purchaseError,
    purchaseSuccess,
    purchaseTransactions,
    currentPurchaseAssetId,
  }
}