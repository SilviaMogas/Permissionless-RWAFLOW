"use client"

import Header from "@/components/header"
import UserProfile from "@/components/user-profile"

export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Profile</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View your complete Flow Passport profile with hierarchical NFTs, reputation scoring, and achievements.
            </p>
          </div>
          
          <UserProfile />
        </div>
      </main>
    </div>
  )
}