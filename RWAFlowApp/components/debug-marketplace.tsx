"use client"

import { useAuth } from "@/hooks/use-auth"
import { useAssetMarketplace } from "@/hooks/use-asset-marketplace"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function DebugMarketplace() {
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
    purchaseTransactions,
  } = useAssetMarketplace()

  const handleTestPurchase = async () => {
    console.log("=== TEST PURCHASE CLICKED ===")
    console.log("Contract Address:", process.env.NEXT_PUBLIC_ASSET_MARKETPLACE_CONTRACT_ADDRESS)
    console.log("Is Authenticated:", isAuthenticated)
    console.log("Address:", address)
    console.log("Error:", error)
    
    toast.info("Test purchase clicked! Check console for details.")
    
    if (!isAuthenticated) {
      toast.error("Not authenticated")
      return
    }
    
    try {
      await purchaseAsset("1", 500)
      toast.success("Purchase initiated")
    } catch (err) {
      console.error("Purchase error:", err)
      toast.error("Purchase failed")
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Debug Marketplace</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Contract:</strong> {process.env.NEXT_PUBLIC_ASSET_MARKETPLACE_CONTRACT_ADDRESS || 'Not set'}
          </div>
          <div>
            <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Address:</strong> {address || 'None'}
          </div>
          <div>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Error:</strong> {error || 'None'}
          </div>
          <div>
            <strong>Purchase Error:</strong> {purchaseError || 'None'}
          </div>
          <div>
            <strong>Purchase Success:</strong> {purchaseSuccess ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Is Purchasing:</strong> {isPurchasing ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Asset 1 Owned:</strong> {hasAsset("1") ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Asset 1 Price (FLOW):</strong> {getAssetPriceInFLOW("1") || 'None'}
          </div>
          <div>
            <strong>Asset 1 TX Hash:</strong> {getAssetTransactionHash("1") || 'None'}
          </div>
          <div>
            <strong>Asset 1 FlowScan URL:</strong> {getFlowScanUrl("1") ? 'Available' : 'None'}
          </div>
          <div>
            <strong>Total Transactions:</strong> {purchaseTransactions.length}
          </div>
        </div>
        
        <Button 
          onClick={handleTestPurchase}
          disabled={isPurchasing}
          className="w-full"
        >
          {isPurchasing ? 'Processing...' : 'Test Purchase Asset 1'}
        </Button>
        
        <Button 
          onClick={() => {
            console.log("=== TOAST TEST ===")
            toast.success("Toast test successful!")
          }}
          variant="outline"
          className="w-full"
        >
          Test Toast
        </Button>
      </CardContent>
    </Card>
  )
}