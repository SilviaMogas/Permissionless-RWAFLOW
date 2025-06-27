'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'sonner'
import { useMembershipSystem } from './use-membership-system'

// AcademyCertificationV2 Contract ABI
const ACADEMY_V2_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "enum AcademyCertificationV2.ModuleLevel", "name": "moduleLevel", "type": "uint8"},
      {"internalType": "uint256", "name": "score", "type": "uint256"},
      {"internalType": "uint256", "name": "totalQuestions", "type": "uint256"}
    ],
    "name": "submitExamResult",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "enum AcademyCertificationV2.ModuleLevel", "name": "moduleLevel", "type": "uint8"}
    ],
    "name": "hasPassedModule",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "enum AcademyCertificationV2.ModuleLevel", "name": "moduleLevel", "type": "uint8"}
    ],
    "name": "getExamResult",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "score", "type": "uint256"},
          {"internalType": "uint256", "name": "totalQuestions", "type": "uint256"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "bool", "name": "passed", "type": "bool"}
        ],
        "internalType": "struct AcademyCertificationV2.ExamResult",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserPassedModules",
    "outputs": [{"internalType": "bool[]", "name": "", "type": "bool[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "enum AcademyCertificationV2.ModuleLevel", "name": "moduleLevel", "type": "uint8"}
    ],
    "name": "getPassPercentage",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "enum AcademyCertificationV2.ModuleLevel", "name": "moduleLevel", "type": "uint8"}],
    "name": "getModuleStats",
    "outputs": [
      {"internalType": "uint256", "name": "participants", "type": "uint256"},
      {"internalType": "uint256", "name": "passed", "type": "uint256"},
      {"internalType": "uint256", "name": "passRate", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "enum AcademyCertificationV2.ModuleLevel", "name": "moduleLevel", "type": "uint8"},
      {"indexed": false, "internalType": "uint256", "name": "score", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "totalQuestions", "type": "uint256"},
      {"indexed": false, "internalType": "bool", "name": "passed", "type": "bool"},
      {"indexed": false, "internalType": "uint256", "name": "membershipTokenId", "type": "uint256"}
    ],
    "name": "ExamCompleted",
    "type": "event"
  }
] as const

// Contract address
const ACADEMY_V2_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ACADEMY_V2_CONTRACT_ADDRESS as `0x${string}`

// Module levels enum mapping
export enum ModuleLevel {
  BEGINNER = 0,
  INTERMEDIATE = 1,
  ADVANCED = 2
}

// Module ID to level mapping
export const MODULE_ID_TO_LEVEL: Record<string, ModuleLevel> = {
  'beginner-rwa-quiz': ModuleLevel.BEGINNER,
  'intermediate-rwa-quiz': ModuleLevel.INTERMEDIATE,
  'advanced-rwa-quiz': ModuleLevel.ADVANCED
}

export const LEVEL_TO_MODULE_ID: Record<ModuleLevel, string> = {
  [ModuleLevel.BEGINNER]: 'beginner-rwa-quiz',
  [ModuleLevel.INTERMEDIATE]: 'intermediate-rwa-quiz',
  [ModuleLevel.ADVANCED]: 'advanced-rwa-quiz'
}

// Types
interface ExamResult {
  score: number
  totalQuestions: number
  timestamp: number
  passed: boolean
}

interface ModuleStats {
  participants: number
  passed: number
  passRate: number
}

interface UseAcademyV2Return {
  // State
  isLoading: boolean
  error: string | null
  
  // Exam functions
  submitExamResult: (moduleId: string, score: number, totalQuestions: number) => Promise<void>
  hasPassedModule: (moduleId: string) => boolean
  getExamResult: (moduleId: string) => ExamResult | null
  getUserPassedModules: () => boolean[]
  getPassPercentage: (moduleId: string) => number
  getModuleStats: (moduleId: string) => ModuleStats | null
  
  // Transaction state
  isSubmittingExam: boolean
  examSubmissionSuccess: boolean
  
  // Helper functions
  getModuleName: (moduleId: string) => string
  getTotalCertificatesEarned: () => number
  getCompletionPercentage: () => number
  canTakeModule: (moduleId: string) => boolean
  getNextRecommendedModule: () => string | null
}

export function useAcademyV2(): UseAcademyV2Return {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [examSubmissionSuccess, setExamSubmissionSuccess] = useState(false)
  const { ensureMembership, refreshProfile } = useMembershipSystem()

  // Contract interaction hooks
  const { writeContract, data: writeHash, isPending: isWritePending } = useWriteContract()
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeHash,
  })

  // Read user's passed modules
  const { data: userPassedModules, refetch: refetchPassedModules } = useReadContract({
    address: ACADEMY_V2_CONTRACT_ADDRESS,
    abi: ACADEMY_V2_ABI,
    functionName: 'getUserPassedModules',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!ACADEMY_V2_CONTRACT_ADDRESS,
  })

  // Read exam results for each module
  const { data: beginnerResult, refetch: refetchBeginnerResult } = useReadContract({
    address: ACADEMY_V2_CONTRACT_ADDRESS,
    abi: ACADEMY_V2_ABI,
    functionName: 'getExamResult',
    args: address ? [address, ModuleLevel.BEGINNER] : undefined,
    enabled: isConnected && !!address && !!ACADEMY_V2_CONTRACT_ADDRESS,
  })

  const { data: intermediateResult, refetch: refetchIntermediateResult } = useReadContract({
    address: ACADEMY_V2_CONTRACT_ADDRESS,
    abi: ACADEMY_V2_ABI,
    functionName: 'getExamResult',
    args: address ? [address, ModuleLevel.INTERMEDIATE] : undefined,
    enabled: isConnected && !!address && !!ACADEMY_V2_CONTRACT_ADDRESS,
  })

  const { data: advancedResult, refetch: refetchAdvancedResult } = useReadContract({
    address: ACADEMY_V2_CONTRACT_ADDRESS,
    abi: ACADEMY_V2_ABI,
    functionName: 'getExamResult',
    args: address ? [address, ModuleLevel.ADVANCED] : undefined,
    enabled: isConnected && !!address && !!ACADEMY_V2_CONTRACT_ADDRESS,
  })

  // Read module statistics
  const { data: beginnerStats } = useReadContract({
    address: ACADEMY_V2_CONTRACT_ADDRESS,
    abi: ACADEMY_V2_ABI,
    functionName: 'getModuleStats',
    args: [ModuleLevel.BEGINNER],
    enabled: !!ACADEMY_V2_CONTRACT_ADDRESS,
  })

  const { data: intermediateStats } = useReadContract({
    address: ACADEMY_V2_CONTRACT_ADDRESS,
    abi: ACADEMY_V2_ABI,
    functionName: 'getModuleStats',
    args: [ModuleLevel.INTERMEDIATE],
    enabled: !!ACADEMY_V2_CONTRACT_ADDRESS,
  })

  const { data: advancedStats } = useReadContract({
    address: ACADEMY_V2_CONTRACT_ADDRESS,
    abi: ACADEMY_V2_ABI,
    functionName: 'getModuleStats',
    args: [ModuleLevel.ADVANCED],
    enabled: !!ACADEMY_V2_CONTRACT_ADDRESS,
  })

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && writeHash) {
      setExamSubmissionSuccess(true)
      toast.success('Exam result submitted! Certificate created automatically.')
      
      // Refresh all data
      refetchPassedModules()
      refetchBeginnerResult()
      refetchIntermediateResult()
      refetchAdvancedResult()
      refreshProfile() // Refresh membership profile to get updated counts
      
      setTimeout(() => setExamSubmissionSuccess(false), 3000)
    }
  }, [isConfirmed, writeHash, refetchPassedModules, refetchBeginnerResult, refetchIntermediateResult, refetchAdvancedResult, refreshProfile])

  const submitExamResult = async (moduleId: string, score: number, totalQuestions: number): Promise<void> => {
    if (!isConnected || !address) {
      setError('Please connect your wallet')
      toast.error('Please connect your wallet')
      return
    }

    if (!ACADEMY_V2_CONTRACT_ADDRESS) {
      setError('Academy V2 contract not configured')
      toast.error('Academy V2 contract not configured')
      return
    }

    const moduleLevel = MODULE_ID_TO_LEVEL[moduleId]
    if (moduleLevel === undefined) {
      setError('Invalid module ID')
      toast.error('Invalid module ID')
      return
    }

    try {
      setError(null)
      
      // Ensure user has membership before submitting exam
      await ensureMembership()
      
      writeContract({
        address: ACADEMY_V2_CONTRACT_ADDRESS,
        abi: ACADEMY_V2_ABI,
        functionName: 'submitExamResult',
        args: [address, moduleLevel, BigInt(score), BigInt(totalQuestions)],
      })
    } catch (err) {
      console.error('Submit exam result error:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit exam result')
      toast.error('Failed to submit exam result')
    }
  }

  const hasPassedModule = (moduleId: string): boolean => {
    const moduleLevel = MODULE_ID_TO_LEVEL[moduleId]
    if (moduleLevel === undefined || !userPassedModules) return false
    return userPassedModules[moduleLevel] || false
  }

  const getExamResult = (moduleId: string): ExamResult | null => {
    const moduleLevel = MODULE_ID_TO_LEVEL[moduleId]
    if (moduleLevel === undefined) return null
    
    let resultData
    switch (moduleLevel) {
      case ModuleLevel.BEGINNER:
        resultData = beginnerResult
        break
      case ModuleLevel.INTERMEDIATE:
        resultData = intermediateResult
        break
      case ModuleLevel.ADVANCED:
        resultData = advancedResult
        break
      default:
        return null
    }
    
    if (!resultData) return null
    
    return {
      score: Number(resultData.score),
      totalQuestions: Number(resultData.totalQuestions),
      timestamp: Number(resultData.timestamp),
      passed: resultData.passed
    }
  }

  const getUserPassedModules = (): boolean[] => {
    return userPassedModules ? [...userPassedModules] : [false, false, false]
  }

  const getPassPercentage = (moduleId: string): number => {
    const examResult = getExamResult(moduleId)
    if (!examResult || examResult.totalQuestions === 0) return 0
    return Math.round((examResult.score / examResult.totalQuestions) * 100)
  }

  const getModuleStats = (moduleId: string): ModuleStats | null => {
    const moduleLevel = MODULE_ID_TO_LEVEL[moduleId]
    if (moduleLevel === undefined) return null
    
    let statsData
    switch (moduleLevel) {
      case ModuleLevel.BEGINNER:
        statsData = beginnerStats
        break
      case ModuleLevel.INTERMEDIATE:
        statsData = intermediateStats
        break
      case ModuleLevel.ADVANCED:
        statsData = advancedStats
        break
      default:
        return null
    }
    
    if (!statsData) return null
    
    return {
      participants: Number(statsData[0]),
      passed: Number(statsData[1]),
      passRate: Number(statsData[2])
    }
  }

  const getModuleName = (moduleId: string): string => {
    const names: Record<string, string> = {
      'beginner-rwa-quiz': 'Beginner RWA Fundamentals',
      'intermediate-rwa-quiz': 'Intermediate RWA Strategies',
      'advanced-rwa-quiz': 'Advanced RWA Portfolio Management'
    }
    return names[moduleId] || 'Unknown Module'
  }

  const getTotalCertificatesEarned = (): number => {
    const passedModules = getUserPassedModules()
    return passedModules.filter(Boolean).length
  }

  const getCompletionPercentage = (): number => {
    const totalCertificates = getTotalCertificatesEarned()
    return Math.round((totalCertificates / 3) * 100)
  }

  const canTakeModule = (moduleId: string): boolean => {
    const moduleLevel = MODULE_ID_TO_LEVEL[moduleId]
    if (moduleLevel === undefined) return false
    
    // Check if already passed
    if (hasPassedModule(moduleId)) return false
    
    // Beginner can always be taken
    if (moduleLevel === ModuleLevel.BEGINNER) return true
    
    // Intermediate requires beginner
    if (moduleLevel === ModuleLevel.INTERMEDIATE) {
      return hasPassedModule(LEVEL_TO_MODULE_ID[ModuleLevel.BEGINNER])
    }
    
    // Advanced requires intermediate
    if (moduleLevel === ModuleLevel.ADVANCED) {
      return hasPassedModule(LEVEL_TO_MODULE_ID[ModuleLevel.INTERMEDIATE])
    }
    
    return false
  }

  const getNextRecommendedModule = (): string | null => {
    const passedModules = getUserPassedModules()
    
    // If no modules passed, recommend beginner
    if (!passedModules[ModuleLevel.BEGINNER]) {
      return LEVEL_TO_MODULE_ID[ModuleLevel.BEGINNER]
    }
    
    // If beginner passed but not intermediate, recommend intermediate
    if (passedModules[ModuleLevel.BEGINNER] && !passedModules[ModuleLevel.INTERMEDIATE]) {
      return LEVEL_TO_MODULE_ID[ModuleLevel.INTERMEDIATE]
    }
    
    // If intermediate passed but not advanced, recommend advanced
    if (passedModules[ModuleLevel.INTERMEDIATE] && !passedModules[ModuleLevel.ADVANCED]) {
      return LEVEL_TO_MODULE_ID[ModuleLevel.ADVANCED]
    }
    
    // All modules completed
    return null
  }

  return {
    isLoading,
    error,
    submitExamResult,
    hasPassedModule,
    getExamResult,
    getUserPassedModules,
    getPassPercentage,
    getModuleStats,
    isSubmittingExam: isWritePending || isConfirming,
    examSubmissionSuccess,
    getModuleName,
    getTotalCertificatesEarned,
    getCompletionPercentage,
    canTakeModule,
    getNextRecommendedModule,
  }
}