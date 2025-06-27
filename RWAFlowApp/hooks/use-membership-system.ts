'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'sonner'

// FlowPassportMembership Contract ABI
const MEMBERSHIP_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "createMembership",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "hasMembership",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getMembershipTokenId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getMembershipInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "member", "type": "address"},
          {"internalType": "uint256", "name": "joinTimestamp", "type": "uint256"},
          {"internalType": "uint256", "name": "reputationScore", "type": "uint256"},
          {"internalType": "uint256", "name": "certificateCount", "type": "uint256"},
          {"internalType": "uint256", "name": "assetCount", "type": "uint256"},
          {"internalType": "string", "name": "profileURI", "type": "string"},
          {"internalType": "bool", "name": "isActive", "type": "bool"}
        ],
        "internalType": "struct FlowPassportMembership.MembershipInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalMemberships",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "member", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "MembershipCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "member", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "oldScore", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "newScore", "type": "uint256"}
    ],
    "name": "ReputationUpdated",
    "type": "event"
  }
] as const

// FlowPassportRegistry Contract ABI
const REGISTRY_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "createOrLinkMembership",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserProfile",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "membershipTokenId", "type": "uint256"},
          {"internalType": "uint256", "name": "totalChildNFTs", "type": "uint256"},
          {"internalType": "uint256", "name": "certificateCount", "type": "uint256"},
          {"internalType": "uint256", "name": "assetCount", "type": "uint256"},
          {"internalType": "uint256", "name": "reputationScore", "type": "uint256"},
          {"internalType": "uint256", "name": "joinTimestamp", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"}
        ],
        "internalType": "struct FlowPassportRegistry.UserProfile",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getCompleteUserProfile",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "membershipTokenId", "type": "uint256"},
          {"internalType": "uint256", "name": "totalChildNFTs", "type": "uint256"},
          {"internalType": "uint256", "name": "certificateCount", "type": "uint256"},
          {"internalType": "uint256", "name": "assetCount", "type": "uint256"},
          {"internalType": "uint256", "name": "reputationScore", "type": "uint256"},
          {"internalType": "uint256", "name": "joinTimestamp", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"}
        ],
        "internalType": "struct FlowPassportRegistry.UserProfile",
        "name": "profile",
        "type": "tuple"
      },
      {"internalType": "uint256[]", "name": "certificates", "type": "uint256[]"},
      {"internalType": "uint256[]", "name": "assets", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserCertificates",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserAssets",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "limit", "type": "uint256"}],
    "name": "getTopUsersByReputation",
    "outputs": [
      {"internalType": "address[]", "name": "", "type": "address[]"},
      {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalUsers",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "membershipTokenId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "MembershipLinked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "childNFTId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "contractAddress", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "nftType", "type": "string"}
    ],
    "name": "ChildNFTAdded",
    "type": "event"
  }
] as const

// Contract addresses
const MEMBERSHIP_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS as `0x${string}`
const REGISTRY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS as `0x${string}`

// Types
interface MembershipInfo {
  member: string
  joinTimestamp: number
  reputationScore: number
  certificateCount: number
  assetCount: number
  profileURI: string
  isActive: boolean
}

interface UserProfile {
  membershipTokenId: number
  totalChildNFTs: number
  certificateCount: number
  assetCount: number
  reputationScore: number
  joinTimestamp: number
  isActive: boolean
}

interface CompleteUserProfile {
  profile: UserProfile
  certificates: number[]
  assets: number[]
}

interface LeaderboardEntry {
  address: string
  reputation: number
  rank: number
}

interface UseMembershipSystemReturn {
  // State
  isLoading: boolean
  error: string | null
  
  // Membership info
  hasMembership: boolean
  membershipInfo: MembershipInfo | null
  userProfile: UserProfile | null
  completeProfile: CompleteUserProfile | null
  
  // Functions
  createMembership: () => Promise<void>
  ensureMembership: () => Promise<void>
  refreshProfile: () => void
  getLeaderboard: (limit?: number) => LeaderboardEntry[]
  getTotalUsers: () => number
  
  // Transaction state
  isCreatingMembership: boolean
  membershipCreationSuccess: boolean
  
  // Helper functions
  getReputationLevel: () => string
  getReputationProgress: () => number
  getMembershipAge: () => number
  getFlowScanUrl: () => string | null
}

export function useMembershipSystem(): UseMembershipSystemReturn {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [membershipCreationSuccess, setMembershipCreationSuccess] = useState(false)

  // Contract interaction hooks
  const { writeContract, data: writeHash, isPending: isWritePending } = useWriteContract()
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeHash,
  })

  // Read membership status
  const { data: hasMembershipData, refetch: refetchHasMembership } = useReadContract({
    address: MEMBERSHIP_CONTRACT_ADDRESS,
    abi: MEMBERSHIP_ABI,
    functionName: 'hasMembership',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!MEMBERSHIP_CONTRACT_ADDRESS,
  })

  // Read membership info
  const { data: membershipInfoData, refetch: refetchMembershipInfo } = useReadContract({
    address: MEMBERSHIP_CONTRACT_ADDRESS,
    abi: MEMBERSHIP_ABI,
    functionName: 'getMembershipInfo',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!MEMBERSHIP_CONTRACT_ADDRESS && hasMembershipData,
  })

  // Read user profile from registry
  const { data: userProfileData, refetch: refetchUserProfile } = useReadContract({
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'getUserProfile',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!REGISTRY_CONTRACT_ADDRESS && hasMembershipData,
  })

  // Read complete user profile
  const { data: completeProfileData, refetch: refetchCompleteProfile } = useReadContract({
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'getCompleteUserProfile',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!REGISTRY_CONTRACT_ADDRESS && hasMembershipData,
  })

  // Read total users
  const { data: totalUsersData } = useReadContract({
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'getTotalUsers',
    enabled: !!REGISTRY_CONTRACT_ADDRESS,
  })

  // Read leaderboard
  const { data: leaderboardData } = useReadContract({
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: 'getTopUsersByReputation',
    args: [BigInt(10)], // Top 10 users
    enabled: !!REGISTRY_CONTRACT_ADDRESS,
  })

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && writeHash) {
      setMembershipCreationSuccess(true)
      toast.success('Membership created successfully!')
      
      // Refresh all data
      refetchHasMembership()
      refetchMembershipInfo()
      refetchUserProfile()
      refetchCompleteProfile()
      
      setTimeout(() => setMembershipCreationSuccess(false), 3000)
    }
  }, [isConfirmed, writeHash, refetchHasMembership, refetchMembershipInfo, refetchUserProfile, refetchCompleteProfile])

  const createMembership = async (): Promise<void> => {
    if (!isConnected || !address) {
      setError('Please connect your wallet')
      toast.error('Please connect your wallet')
      return
    }

    if (!REGISTRY_CONTRACT_ADDRESS) {
      setError('Registry contract not configured')
      toast.error('Registry contract not configured')
      return
    }

    try {
      setError(null)
      
      writeContract({
        address: REGISTRY_CONTRACT_ADDRESS,
        abi: REGISTRY_ABI,
        functionName: 'createOrLinkMembership',
        args: [address],
      })
    } catch (err) {
      console.error('Create membership error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create membership')
      toast.error('Failed to create membership')
    }
  }

  const ensureMembership = async (): Promise<void> => {
    if (!hasMembershipData) {
      await createMembership()
    }
  }

  const refreshProfile = () => {
    refetchHasMembership()
    refetchMembershipInfo()
    refetchUserProfile()
    refetchCompleteProfile()
  }

  const getLeaderboard = (limit: number = 10): LeaderboardEntry[] => {
    if (!leaderboardData || !leaderboardData[0] || !leaderboardData[1]) return []
    
    const [addresses, reputations] = leaderboardData
    return addresses.slice(0, limit).map((addr, index) => ({
      address: addr,
      reputation: Number(reputations[index]),
      rank: index + 1
    }))
  }

  const getTotalUsers = (): number => {
    return totalUsersData ? Number(totalUsersData) : 0
  }

  const getReputationLevel = (): string => {
    const reputation = userProfileData ? Number(userProfileData.reputationScore) : 0
    
    if (reputation >= 500) return 'Master'
    if (reputation >= 300) return 'Advanced'
    if (reputation >= 200) return 'Intermediate'
    if (reputation >= 100) return 'Beginner'
    return 'Newcomer'
  }

  const getReputationProgress = (): number => {
    const reputation = userProfileData ? Number(userProfileData.reputationScore) : 0
    const level = getReputationLevel()
    
    switch (level) {
      case 'Newcomer': return (reputation / 100) * 100
      case 'Beginner': return ((reputation - 100) / 100) * 100
      case 'Intermediate': return ((reputation - 200) / 100) * 100
      case 'Advanced': return ((reputation - 300) / 200) * 100
      case 'Master': return 100
      default: return 0
    }
  }

  const getMembershipAge = (): number => {
    if (!membershipInfoData) return 0
    const joinTimestamp = Number(membershipInfoData.joinTimestamp) * 1000
    return Math.floor((Date.now() - joinTimestamp) / (1000 * 60 * 60 * 24)) // Days
  }

  const getFlowScanUrl = (): string | null => {
    if (!userProfileData || !userProfileData.membershipTokenId) return null
    return `https://evm-testnet.flowscan.io/token/${MEMBERSHIP_CONTRACT_ADDRESS}?a=${userProfileData.membershipTokenId}`
  }

  // Process data for return
  const hasMembership = Boolean(hasMembershipData)
  
  const membershipInfo: MembershipInfo | null = membershipInfoData ? {
    member: membershipInfoData.member,
    joinTimestamp: Number(membershipInfoData.joinTimestamp),
    reputationScore: Number(membershipInfoData.reputationScore),
    certificateCount: Number(membershipInfoData.certificateCount),
    assetCount: Number(membershipInfoData.assetCount),
    profileURI: membershipInfoData.profileURI,
    isActive: membershipInfoData.isActive
  } : null

  const userProfile: UserProfile | null = userProfileData ? {
    membershipTokenId: Number(userProfileData.membershipTokenId),
    totalChildNFTs: Number(userProfileData.totalChildNFTs),
    certificateCount: Number(userProfileData.certificateCount),
    assetCount: Number(userProfileData.assetCount),
    reputationScore: Number(userProfileData.reputationScore),
    joinTimestamp: Number(userProfileData.joinTimestamp),
    isActive: userProfileData.isActive
  } : null

  const completeProfile: CompleteUserProfile | null = completeProfileData ? {
    profile: {
      membershipTokenId: Number(completeProfileData[0].membershipTokenId),
      totalChildNFTs: Number(completeProfileData[0].totalChildNFTs),
      certificateCount: Number(completeProfileData[0].certificateCount),
      assetCount: Number(completeProfileData[0].assetCount),
      reputationScore: Number(completeProfileData[0].reputationScore),
      joinTimestamp: Number(completeProfileData[0].joinTimestamp),
      isActive: completeProfileData[0].isActive
    },
    certificates: completeProfileData[1].map(cert => Number(cert)),
    assets: completeProfileData[2].map(asset => Number(asset))
  } : null

  return {
    isLoading,
    error,
    hasMembership,
    membershipInfo,
    userProfile,
    completeProfile,
    createMembership,
    ensureMembership,
    refreshProfile,
    getLeaderboard,
    getTotalUsers,
    isCreatingMembership: isWritePending || isConfirming,
    membershipCreationSuccess,
    getReputationLevel,
    getReputationProgress,
    getMembershipAge,
    getFlowScanUrl,
  }
}