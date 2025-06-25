"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation" // useRouter not used, can be removed
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Link from "next/link"

type PlanDetails = {
  profileTitle: string
  profileDescription: string
  recommendedAllocation: string
  expectedROI: string
  investmentRange: string
}

function generatePlanDetails(formData: Record<string, any>): PlanDetails {
  let profileTitle = "Balanced Investor"
  let profileDescription = "A balanced approach to growth and stability."
  let recommendedAllocation = "50% Real Estate, 30% Agriculture, 20% Debt"
  let expectedROI = "7.5%"
  const investmentRange = formData.investmentAmount || "<$100"
  if (formData.risk === "Low" && formData.experience === "Beginner") {
    profileTitle = "Safe Explorer"
    profileDescription = "Conservative portfolio focused on stable returns."
    recommendedAllocation = "40% Debt, 30% Real Estate, 30% Agriculture"
    expectedROI = "5.2%"
  } else if (formData.risk === "High" && formData.experience === "Advanced") {
    profileTitle = "Aggressive Growth Seeker"
    profileDescription = "High-growth portfolio with a focus on emerging assets."
    recommendedAllocation = "40% Art, 30% Energy, 30% Real Estate"
    expectedROI = "12.3%"
  } else if (formData.goal === "Capital growth") {
    profileTitle = "Growth Focused Investor"
    profileDescription = "Portfolio aimed at maximizing capital appreciation."
    recommendedAllocation = "35% Real Estate, 35% Art, 30% Energy"
    expectedROI = "9.8%"
  }
  if (formData.assets && (formData.assets as string[]).length > 0) {
    const interestedAssets = formData.assets as string[]
    if (interestedAssets.length === 1) {
      recommendedAllocation = `100% ${interestedAssets[0]}`
    } else if (interestedAssets.length > 1) {
      const percentage = Math.floor(100 / interestedAssets.length)
      recommendedAllocation = interestedAssets
        .map(
          (asset, index) =>
            `${index === interestedAssets.length - 1 ? 100 - (percentage * (interestedAssets.length - 1)) : percentage}% ${asset}`,
        )
        .join(", ")
    }
  }
  return { profileTitle, profileDescription, recommendedAllocation, expectedROI, investmentRange }
}

function PlanDisplay() {
  const searchParams = useSearchParams()
  const formDataString = searchParams.get("data")
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  let planDetails: PlanDetails
  let formData = {}
  
  if (formDataString) {
    try {
      formData = JSON.parse(formDataString)
      planDetails = generatePlanDetails(formData)
    } catch (error) {
      console.error("Failed to parse form data:", error)
      planDetails = generatePlanDetails({})
    }
  } else {
    planDetails = generatePlanDetails({})
  }
  
  useEffect(() => {
    if (formDataString) {
      fetchPortfolioRecommendation(formData)
    }
  }, [formDataString])
  
  const fetchPortfolioRecommendation = async (onboardingData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/agent/portfolio-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ onboardingData }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setRecommendation(data.recommendation)
      } else {
        console.error('Failed to fetch recommendation')
      }
    } catch (error) {
      console.error('Error fetching recommendation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl shadow-xl bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-3xl text-gray-800">Your Personalized Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-emerald-50 p-6 border border-emerald-200">
              <h3 className="text-2xl font-semibold text-metallic-green">{planDetails.profileTitle}</h3>
              <p className="text-sm text-emerald-700">{planDetails.profileDescription}</p>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-500">Recommended Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-gray-700">{planDetails.recommendedAllocation}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-500">Expected ROI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-metallic-green">{planDetails.expectedROI}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-500">Investment Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-gray-700">{planDetails.investmentRange}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {isLoading && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="text-blue-700">Getting AI-powered recommendations...</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {recommendation && (
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-purple-800 flex items-center">
                    <span className="mr-2">🤖</span>
                    AI Portfolio Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {recommendation}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Button
              asChild
              size="lg"
              className="w-full bg-green-gradient text-white hover:opacity-90 transition-opacity shadow-md"
            >
              <Link href="/marketplace">Continue to Marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-white text-gray-600">Loading plan...</div>
      }
    >
      <PlanDisplay />
    </Suspense>
  )
}
