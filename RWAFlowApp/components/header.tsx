"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { LoginButton } from "@/components/login-button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/flow-passport-logo.png" alt="Flow Passport Logo" width={32} height={32} className="h-8 w-8" />
            <span className="font-bold text-lg text-gray-800">FLOW PASSPORT</span>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <Link href="/marketplace" className="transition-colors text-gray-600 hover:text-metallic-green">
              Invest
            </Link>
            <Link href="/academy" className="transition-colors text-gray-600 hover:text-metallic-green">
              Learn
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:inline-flex">
            <LoginButton />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden border-metallic-green text-metallic-green hover:bg-emerald-50"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <div className="grid gap-4 py-6">
                <Link
                  href="/marketplace"
                  className="flex w-full items-center py-2 text-lg font-semibold text-gray-600 hover:text-metallic-green"
                >
                  Invest
                </Link>
                <Link
                  href="/academy"
                  className="flex w-full items-center py-2 text-lg font-semibold text-gray-600 hover:text-metallic-green"
                >
                  Learn
                </Link>
                <LoginButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}