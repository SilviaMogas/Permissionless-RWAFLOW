import Header from "@/components/header"
import DashboardSummary from "@/components/dashboard-summary"
import AssetListing from "@/components/asset-listing"

export const dynamic = 'force-dynamic'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* Ensure main content area is on top */}
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-12">
        <DashboardSummary />
        <AssetListing />
      </main>
    </div>
  )
}
