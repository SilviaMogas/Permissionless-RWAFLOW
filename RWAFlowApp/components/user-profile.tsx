"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Award, 
  Star, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Wallet, 
  ExternalLink,
  Crown,
  Medal,
  Home,
  Trophy
} from "lucide-react"
import { useMembershipSystem } from "@/hooks/use-membership-system"
import { useAcademyV2 } from "@/hooks/use-academy-v2"
import { useMarketplaceV2 } from "@/hooks/use-marketplace-v2"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import Link from "next/link"

interface UserProfileProps {
  className?: string
}

export default function UserProfile({ className = "" }: UserProfileProps) {
  const { isAuthenticated, address } = useAuth()
  const {
    hasMembership,
    membershipInfo,
    userProfile,
    completeProfile,
    createMembership,
    getReputationLevel,
    getReputationProgress,
    getMembershipAge,
    getFlowScanUrl,
    getLeaderboard,
    isCreatingMembership
  } = useMembershipSystem()
  
  const {
    getTotalCertificatesEarned,
    getCompletionPercentage,
    getNextRecommendedModule,
    getModuleName
  } = useAcademyV2()
  
  const {
    userPortfolio,
    getTotalPortfolioValue,
    getPortfolioDistribution
  } = useMarketplaceV2()

  if (!isAuthenticated) {
    return (
      <Card className={`shadow-lg bg-white border-gray-200 ${className}`}>
        <CardContent className="pt-6 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect Wallet</h3>
          <p className="text-gray-600">Connect your wallet to view your profile and access account abstraction features.</p>
        </CardContent>
      </Card>
    )
  }

  if (!hasMembership) {
    return (
      <Card className={`shadow-lg bg-white border-gray-200 ${className}`}>
        <CardContent className="pt-6 text-center">
          <Crown className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Create Membership</h3>
          <p className="text-gray-600 mb-4">
            Create your Flow Passport membership to start your journey with hierarchical NFTs.
          </p>
          <Button
            onClick={createMembership}
            disabled={isCreatingMembership}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isCreatingMembership ? "Creating..." : "Create Membership NFT"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const reputationLevel = getReputationLevel()
  const reputationProgress = getReputationProgress()
  const membershipAge = getMembershipAge()
  const totalCertificates = getTotalCertificatesEarned()
  const completionPercentage = getCompletionPercentage()
  const nextModule = getNextRecommendedModule()
  const portfolioValue = getTotalPortfolioValue()
  const portfolioDistribution = getPortfolioDistribution()
  const flowScanUrl = getFlowScanUrl()
  const leaderboard = getLeaderboard(5)

  // Get reputation level styling
  const getReputationStyling = (level: string) => {
    switch (level) {
      case 'Master': return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' }
      case 'Advanced': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' }
      case 'Intermediate': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' }
      case 'Beginner': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
    }
  }

  const styling = getReputationStyling(reputationLevel)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Profile Card */}
      <Card className="shadow-lg bg-white border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-800 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Flow Passport Profile
            </CardTitle>
            {flowScanUrl && (
              <Button asChild variant="outline" size="sm">
                <Link href={flowScanUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on FlowScan
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wallet Info */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Wallet className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Wallet Address</span>
            </div>
            <code className="text-xs bg-gray-200 px-2 py-1 rounded">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </code>
          </div>

          {/* Reputation Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-medium text-gray-700">Reputation Level</span>
            </div>
            <Badge className={`${styling.bg} ${styling.text} border ${styling.border}`}>
              <Crown className="mr-1 h-3 w-3" />
              {reputationLevel}
            </Badge>
          </div>

          {/* Reputation Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Reputation Score</span>
              <span className="font-medium">{userProfile?.reputationScore || 0}</span>
            </div>
            <Progress value={reputationProgress} className="h-2" />
            <div className="text-xs text-gray-500 text-center">
              Progress to next level: {Math.round(reputationProgress)}%
            </div>
          </div>

          {/* Membership Age */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Member for</span>
            </div>
            <span className="text-sm font-medium">
              {membershipAge === 0 ? "Today" : `${membershipAge} day${membershipAge !== 1 ? 's' : ''}`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Certificates */}
        <Card className="shadow-lg bg-white border-gray-200">
          <CardContent className="pt-6 text-center">
            <Medal className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{totalCertificates}</div>
            <div className="text-sm text-gray-600">Certificates Earned</div>
            <div className="text-xs text-purple-600 mt-1">
              {completionPercentage}% Complete
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Value */}
        <Card className="shadow-lg bg-white border-gray-200">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              ${portfolioValue.usd.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Portfolio Value</div>
            <div className="text-xs text-green-600 mt-1">
              {userPortfolio?.totalAssets || 0} Assets
            </div>
          </CardContent>
        </Card>

        {/* Child NFTs */}
        <Card className="shadow-lg bg-white border-gray-200">
          <CardContent className="pt-6 text-center">
            <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {userProfile?.totalChildNFTs || 0}
            </div>
            <div className="text-sm text-gray-600">Child NFTs</div>
            <div className="text-xs text-blue-600 mt-1">
              Linked to Membership
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Actions */}
      {nextModule && (
        <Card className="shadow-lg bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Recommended Next Step
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{getModuleName(nextModule)}</p>
                <p className="text-sm text-gray-600">Complete this module to earn your next certificate</p>
              </div>
              <Button asChild className="bg-green-gradient text-white hover:opacity-90">
                <Link href={`/academy/module/${nextModule}`}>
                  Start Module
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Distribution */}
      {Object.keys(portfolioDistribution).length > 0 && (
        <Card className="shadow-lg bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Portfolio Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(portfolioDistribution).map(([category, percentage]) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{category}</span>
                  <span className="font-medium">{percentage.toFixed(1)}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Preview */}
      {leaderboard.length > 0 && (
        <Card className="shadow-lg bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Reputation Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div key={entry.address} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {entry.rank}
                    </div>
                    <code className="text-xs">
                      {entry.address === address ? 'You' : `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                    </code>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{entry.reputation}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}