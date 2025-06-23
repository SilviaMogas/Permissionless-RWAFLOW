import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import GlobalBackground from "@/components/global-background"
import { PrivyWagmiProvider } from "@/providers/privy-provider"
import { AgentBubble } from "@/components/agent-bubble"

export const metadata: Metadata = {
  title: "Flow Passport - Your Gateway to Onchain Identity, Investment & Education",
  description: "Discover, compare and invest in verified tokenized real-world assets with Flow Passport.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PrivyWagmiProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <GlobalBackground />
            <div className="flex flex-col min-h-screen relative z-0">
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <AgentBubble />
          </ThemeProvider>
        </PrivyWagmiProvider>
      </body>
    </html>
  )
}