"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Palette, Zap, Wheat, Landmark, Star, Loader2, Wallet, AlertCircle, ExternalLink } from "lucide-react"
import { useMarketplaceV2 } from "@/hooks/use-marketplace-v2"
import { useMembershipSystem } from "@/hooks/use-membership-system"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { useEffect } from "react"

const assets = [
  {
    id: "1",
    name: "Lisbon Apartment",
    roi: "7.5%",
    verifiedBy: "Particula",
    score: 4,
    price: 500,
    icon: <Home className="h-8 w-8 text-metallic-green" />,
    iconBg: "bg-emerald-100",
  },
  {
    id: "2",
    name: "NFT Art Fund",
    roi: "11.4%",
    verifiedBy: "Particula",
    score: 5,
    price: 300,
    icon: <Palette className="h-8 w-8 text-metallic-green" />,
    iconBg: "bg-emerald-100",
  },
  {
    id: "3",
    name: "Brazil Coffee Loan",
    roi: "6.1%",
    verifiedBy: "Pending",
    score: 3,
    price: 200,
    icon: <Wheat className="h-8 w-8 text-metallic-green" />,
    iconBg: "bg-emerald-100",
  },
  {
    id: "4",
    name: "Green Energy Bond",
    roi: "8.2%",
    verifiedBy: "Particula",
    score: 4,
    price: 1000,
    icon: <Zap className="h-8 w-8 text-metallic-green" />,
    iconBg: "bg-emerald-100",
  },
  {
    id: "5",
    name: "Corporate Debt Fund",
    roi: "9.1%",
    verifiedBy: "Particula",
    score: 4,
    price: 750,
    icon: <Landmark className="h-8 w-8 text-metallic-green" />,
    iconBg: "bg-emerald-100",
  },
]

const StarRating = ({ score }: { score: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < score ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

export default function AssetListing() {
  const { isAuthenticated, address } = useAuth()
  const {
    hasAsset,
    purchaseAsset,
    getFlowScanUrl,
    getAssetTransactionHash,
    isPurchasing,
    purchaseError,
    purchaseSuccess,
    error,
    isLoading,
    allAssets,
    userPortfolio
  } = useMarketplaceV2()
  const { hasMembership, ensureMembership } = useMembershipSystem()

  // Debug: Log contract connection status
  useEffect(() => {
    console.log("=== AssetListing V2 Debug ===")
    console.log("Contract Address:", process.env.NEXT_PUBLIC_MARKETPLACE_V2_CONTRACT_ADDRESS)
    console.log("Is Authenticated:", isAuthenticated)
    console.log("Wallet Address:", address)
    console.log("Hook Error:", error)
    console.log("Is Loading:", isLoading)
    console.log("All Assets:", allAssets)
    console.log("User Portfolio:", userPortfolio)
  }, [isAuthenticated, address, error, isLoading, allAssets, userPortfolio])

  const handleAddToPortfolio = async (assetId: string) => {
    console.log("=== V2 Purchase Attempt ===")
    console.log("Asset ID:", assetId)
    console.log("Is Authenticated:", isAuthenticated)
    console.log("Wallet Address:", address)

    if (!isAuthenticated) {
      console.log("Not authenticated - showing wallet connect message")
      toast.error('Please connect your wallet first')
      return
    }

    if (!process.env.NEXT_PUBLIC_MARKETPLACE_V2_CONTRACT_ADDRESS) {
      console.error("V2 Contract address not configured!")
      toast.error('Marketplace V2 contract not configured. Please check environment variables.')
      return
    }

    try {
      console.log("Initiating V2 purchase...")
      await purchaseAsset(assetId) // V2 automatically handles membership and pricing
      console.log("V2 Purchase initiated successfully")
      toast.success('Asset purchase initiated! Child NFT will be created automatically.')
    } catch (error) {
      console.error('V2 Purchase failed:', error)
      toast.error('Purchase failed. Please try again.')
    }
  }

  // Show success message when purchase is confirmed
  useEffect(() => {
    if (purchaseSuccess) {
      console.log("Purchase confirmed!")
      toast.success('Asset successfully added to your portfolio!')
    }
  }, [purchaseSuccess])

  // Show error message if purchase fails
  useEffect(() => {
    if (purchaseError) {
      console.error("Purchase error:", purchaseError)
      toast.error(`Purchase failed: ${purchaseError}`)
    }
  }, [purchaseError])

  // Show contract connection error
  useEffect(() => {
    if (error) {
      console.error("Contract error:", error)
      toast.error(`Contract error: ${error}`)
    }
  }, [error])

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Asset Marketplace</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover verified tokenized real-world assets with transparent performance metrics and secure investment
          opportunities.
        </p>
        
        {/* Debug info for development */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-left max-w-2xl mx-auto">
          <div className="font-semibold mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            V2 Marketplace Info
          </div>
          <div className="space-y-1 text-xs">
            <div>V2 Contract: {process.env.NEXT_PUBLIC_MARKETPLACE_V2_CONTRACT_ADDRESS || 'Not configured'}</div>
            <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
            <div>Address: {address || 'Not connected'}</div>
            <div>Has Membership: {hasMembership ? 'Yes' : 'No'}</div>
            <div>Assets Loaded: {allAssets.length}</div>
            <div>Portfolio Value: ${userPortfolio?.totalValueUSD || 0}</div>
            <div>Contract Error: {error || 'None'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Use V2 assets if available, fallback to static assets */}
        {(allAssets.length > 0 ? allAssets : assets).map((assetData) => {
          // For V2 assets, use the contract data; for static assets, use local data
          const asset = allAssets.length > 0 ? {
            id: assetData.id,
            name: assetData.name,
            roi: "Dynamic", // V2 doesn't have ROI in this format
            verifiedBy: "Flow Blockchain",
            score: 5, // All V2 assets are verified
            price: assetData.priceUSD,
            icon: assets.find(a => a.id === assetData.id)?.icon || <Home className="h-8 w-8 text-metallic-green" />,
            iconBg: "bg-emerald-100",
          } : assetData
          
          const isOwned = hasAsset(asset.id)
          const flowScanUrl = getFlowScanUrl(asset.id)
          const txHash = getAssetTransactionHash(asset.id)
          
          return (
            <Card
              key={asset.id}
              className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-gray-200 transform hover:-translate-y-1"
            >
              <CardHeader className="items-center text-center">
                <div className={`p-4 rounded-2xl ${asset.iconBg} mb-3 shadow-sm`}>{asset.icon}</div>
                <CardTitle className="text-xl text-gray-800">{asset.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">ROI:</span>
                  <span className="text-metallic-green font-bold">{asset.roi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Verified by:</span>
                  <div className="flex items-center">
                    <span className={asset.verifiedBy === "Pending" ? "text-yellow-600" : "text-metallic-green"}>
                      {asset.verifiedBy}
                    </span>
                    {asset.verifiedBy !== "Pending" && <CheckCircle className="ml-1 h-4 w-4 text-metallic-green" />}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Score:</span>
                  <StarRating score={asset.score} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Price:</span>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">${asset.price.toLocaleString()}</div>
                    {allAssets.length > 0 && assetData.priceFLOW && (
                      <div className="text-xs text-gray-500">{assetData.priceFLOW} FLOW</div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                {!isAuthenticated ? (
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-md"
                    onClick={() => {
                      console.log("Connect wallet button clicked")
                      toast.info('Please connect your wallet to purchase assets')
                    }}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                ) : (
                  <>
                    <Button
                      className={`w-full ${
                        isOwned
                          ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed text-gray-500"
                          : "bg-green-gradient text-white hover:opacity-90 transition-opacity shadow-md"
                      }`}
                      onClick={() => {
                        console.log("Add to Portfolio clicked for asset:", asset.id)
                        if (!isOwned && !isPurchasing) {
                          handleAddToPortfolio(asset.id)
                        }
                      }}
                      disabled={isOwned || isPurchasing}
                    >
                      {isPurchasing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : isOwned ? (
                        "Owned"
                      ) : (
                        "Add to Portfolio"
                      )}
                    </Button>
                    
                    {/* Show transaction link for owned assets */}
                    {isOwned && flowScanUrl && (
                      <div className="w-full">
                        <a
                          href={flowScanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full text-sm text-metallic-green hover:text-emerald-600 transition-colors bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md py-2 px-3"
                        >
                          <ExternalLink className="mr-2 h-3 w-3" />
                          View Transaction
                        </a>
                        {txHash && (
                          <div className="mt-1 text-xs text-gray-500 text-center truncate">
                            TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  )
}