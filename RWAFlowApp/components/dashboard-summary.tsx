import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, TrendingUp, Wallet, Target, Award, Star } from "lucide-react"
import { useMarketplaceV2 } from "@/hooks/use-marketplace-v2"
import { useMembershipSystem } from "@/hooks/use-membership-system"
import { useAuth } from "@/hooks/use-auth"

const dashboardData = {
  totalInvested: 500,
  expectedROI: 5.2,
  assetsCount: 1,
  status: "Safe Explorer",
  kycVerified: true,
  portfolioDiversification: "80% Agriculture, 20% Real Estate",
  assetsStaked: [
    {
      id: "1",
      name: "Lisbon Apartment",
      roi: 7.5,
      icon: <Home className="h-6 w-6 text-metallic-green" />,
      amount: 500,
    },
  ],
}

export default function DashboardSummary() {
  const { isAuthenticated } = useAuth()
  const { userPortfolio, getTotalPortfolioValue, getPortfolioDistribution } = useMarketplaceV2()
  const { userProfile, hasMembership, getReputationLevel } = useMembershipSystem()

  // Use V2 data if available, fallback to static data
  const portfolioValue = getTotalPortfolioValue()
  const totalInvested = portfolioValue.usd || dashboardData.totalInvested
  const assetsCount = userPortfolio?.totalAssets || dashboardData.assetsCount
  const reputationLevel = getReputationLevel()
  const reputationScore = userProfile?.reputationScore || 0
  const distribution = getPortfolioDistribution()

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Investment Dashboard</h1>
        <div className="flex gap-2">
          {hasMembership && (
            <Badge variant="outline" className="border-blue-300 text-blue-600 bg-blue-50">
              <Award className="mr-1 h-4 w-4" />
              Member
            </Badge>
          )}
          {isAuthenticated && (
            <Badge variant="outline" className="border-purple-300 text-purple-600 bg-purple-50">
              <Star className="mr-1 h-4 w-4" />
              {reputationLevel}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-lg border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Invested</p>
                <p className="text-3xl font-bold text-gray-800">${totalInvested.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-metallic-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Reputation Score</p>
                <p className="text-3xl font-bold text-metallic-green">{reputationScore}</p>
              </div>
              <Star className="h-8 w-8 text-metallic-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Assets</p>
                <p className="text-3xl font-bold text-gray-800">{assetsCount}</p>
              </div>
              <Target className="h-8 w-8 text-metallic-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Membership</p>
                <p className="text-xl font-semibold text-gray-700">{hasMembership ? 'Active' : 'Not Active'}</p>
              </div>
              <Award className="h-8 w-8 text-metallic-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-lg bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-gray-800">
              <div className="w-2 h-2 bg-metallic-green rounded-full mr-2"></div>
              Portfolio Diversification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{dashboardData.portfolioDiversification}</p>
            <div className="mt-4 flex space-x-2 items-center">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-4/5 h-full bg-metallic-green rounded-full"></div>
              </div>
              <span className="text-xs text-gray-500">80%</span>
            </div>
            <div className="mt-2 flex space-x-2 items-center">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-1/5 h-full bg-purple-500 rounded-full"></div>{" "}
                {/* Keeping purple for variety here or change to another shade of green */}
              </div>
              <span className="text-xs text-gray-500">20%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-gray-800">
              <div className="w-2 h-2 bg-metallic-green rounded-full mr-2"></div>
              Assets Staked
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.assetsStaked.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg mr-3">{asset.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-700">{asset.name}</p>
                    <p className="text-xs text-gray-500">{asset.roi}% ROI</p>
                  </div>
                </div>
                <p className="font-semibold text-metallic-green">${asset.amount.toLocaleString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </section>
  )
}
