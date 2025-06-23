import FeaturesSection from "@/components/features-section"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"

export const dynamic = 'force-dynamic'

export default function RWAFlowPage() {
  return (
    // The main background is now controlled by globals.css and layout.tsx
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
    </>
  )
}
