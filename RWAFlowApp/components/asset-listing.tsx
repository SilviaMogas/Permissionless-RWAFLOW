"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Palette, Zap, Wheat, Landmark, Star } from "lucide-react"
import { useState } from "react"

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
  const [portfolio, setPortfolio] = useState<string[]>([])

  const handleAddToPortfolio = (assetId: string) => {
    setPortfolio((prev) => [...prev, assetId])
  }

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Asset Marketplace</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover verified tokenized real-world assets with transparent performance metrics and secure investment
          opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => {
          const isAdded = portfolio.includes(asset.id)
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
                  <span className="font-bold text-gray-800">${asset.price.toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    isAdded
                      ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-green-gradient text-white hover:opacity-90 transition-opacity shadow-md"
                  }`}
                  onClick={() => !isAdded && handleAddToPortfolio(asset.id)}
                  disabled={isAdded}
                >
                  {isAdded ? "Added to Portfolio" : "Add to Portfolio"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
