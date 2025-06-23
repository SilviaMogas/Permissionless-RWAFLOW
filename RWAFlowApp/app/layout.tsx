import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import GlobalBackground from "@/components/global-background" // Import the new component

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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <GlobalBackground /> {/* Add the global background component here */}
          <div className="flex flex-col min-h-screen relative z-0">
            {" "}
            {/* Ensure content is above background */}
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
