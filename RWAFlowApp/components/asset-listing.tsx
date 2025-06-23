"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Palette, Zap, Wheat, Landmark, Star, Loader2, Wallet, AlertCircle, ExternalLink } from "lucide-react"
import { useAssetMarketplace } from "@/hooks/use-asset-marketplace"
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
    getAssetPriceInFLOW,
    getFlowScanUrl,
    getAssetTransactionHash,
    isPurchasing,
    purchaseError,
    purchaseSuccess,
    error,
    isLoading,
  } = useAssetMarketplace()

  // Debug: Log contract connection status
  useEffect(() => {
    console.log("=== AssetListing Debug ===")
    console.log("Contract Address:", process.env.NEXT_PUBLIC_ASSET_MARKETPLACE_CONTRACT_ADDRESS)
    console.log("Is Authenticated:", isAuthenticated)
    console.log("Wallet Address:", address)
    console.log("Hook Error:", error)
    console.log("Is Loading:", isLoading)
  }, [isAuthenticated, address, error, isLoading])

  const handleAddToPortfolio = async (assetId: string, priceUSD: number) => {
    console.log("=== Purchase Attempt ===")
    console.log("Asset ID:", assetId)
    console.log("Price USD:", priceUSD)
    console.log("Is Authenticated:", isAuthenticated)
    console.log("Wallet Address:", address)

    if (!isAuthenticated) {
      console.log("Not authenticated - showing wallet connect message")
      toast.error('Please connect your wallet first')
      return
    }

    if (!process.env.NEXT_PUBLIC_ASSET_MARKETPLACE_CONTRACT_ADDRESS) {
      console.error("Contract address not configured!")
      toast.error('Contract not configured. Please check environment variables.')
      return
    }

    try {
      console.log("Initiating purchase...")
      await purchaseAsset(assetId, priceUSD)
      console.log("Purchase initiated successfully")
      toast.success('Asset purchase initiated!')
    } catch (error) {
      console.error('Purchase failed:', error)
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
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-left max-w-2xl mx-auto">
          <div className="font-semibold mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Debug Info
          </div>
          <div className="space-y-1 text-xs">
            <div>Contract: {process.env.NEXT_PUBLIC_ASSET_MARKETPLACE_CONTRACT_ADDRESS || 'Not configured'}</div>
            <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
            <div>Address: {address || 'Not connected'}</div>
            <div>Contract Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div>Contract Error: {error || 'None'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => {
          const isOwned = hasAsset(asset.id)
          const flowPrice = getAssetPriceInFLOW(asset.id)
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
                    {flowPrice && (
                      <div className="text-xs text-gray-500">{flowPrice} FLOW</div>
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
                          handleAddToPortfolio(asset.id, asset.price)
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