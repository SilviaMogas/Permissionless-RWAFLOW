import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BarChartBig, ShieldCheck, Home, Palette, Leaf, Landmark } from "lucide-react"

const featureCards = [
  {
    icon: <Users className="h-8 w-8 text-metallic-green" />,
    title: "Smart Onboarding",
    description: "Personalized investment plans tailored to your experience level, goals, and risk tolerance",
  },
  {
    icon: <BarChartBig className="h-8 w-8 text-metallic-green" />,
    title: "Curated Marketplace",
    description: "Browse categorized listings of verified tokenized assets with detailed performance metrics",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-metallic-green" />,
    title: "Portfolio Dashboard",
    description: "Track investments, monitor diversification, and manage your staking rewards in real-time",
  },
]

const investmentCategories = [
  {
    icon: <Home className="h-6 w-6 text-metallic-green" />,
    name: "Real Estate",
    yield: "7.2% avg yield",
    iconBg: "bg-emerald-50", // Lighter green for icon background
  },
  {
    icon: <Palette className="h-6 w-6 text-metallic-green" />,
    name: "Art & Collectibles",
    yield: "9.8% avg yield",
    iconBg: "bg-emerald-50",
  },
  {
    icon: <Leaf className="h-6 w-6 text-metallic-green" />,
    name: "Agriculture",
    yield: "6.5% avg yield",
    iconBg: "bg-emerald-50",
  },
  {
    icon: <Landmark className="h-6 w-6 text-metallic-green" />,
    name: "Debt & Loans",
    yield: "8.1% avg yield",
    iconBg: "bg-emerald-50",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      {" "}
      {/* Light gray background for subtle separation */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="text-center shadow-lg bg-white border-gray-200">
              <CardHeader className="items-center">
                <div className="p-3 bg-emerald-50 rounded-full">{feature.icon}</div>
                <CardTitle className="mt-4 text-xl font-semibold text-gray-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-lg bg-white border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">Investment Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
              {investmentCategories.map((category) => (
                <div key={category.name} className="flex flex-col items-center text-center">
                  <div className={`p-4 rounded-full ${category.iconBg} mb-2`}>{category.icon}</div>
                  <h3 className="text-md font-medium text-gray-700">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.yield}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
