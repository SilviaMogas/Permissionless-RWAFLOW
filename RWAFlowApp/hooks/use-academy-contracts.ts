'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'sonner'

// ABI for AcademyCertification contract
const ACADEMY_CERTIFICATION_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}, {"internalType": "enum AcademyCertification.ModuleLevel", "name": "moduleLevel", "type": "uint8"}, {"internalType": "uint256", "name": "score", "type": "uint256"}, {"internalType": "uint256", "name": "totalQuestions", "type": "uint256"}],
    "name": "submitExamResult",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}, {"internalType": "enum AcademyCertification.ModuleLevel", "name": "moduleLevel", "type": "uint8"}],
    "name": "hasPassedModule",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}, {"internalType": "enum AcademyCertification.ModuleLevel", "name": "moduleLevel", "type": "uint8"}],
    "name": "getExamResult",
    "outputs": [{"components": [{"internalType": "uint256", "name": "score", "type": "uint256"}, {"internalType": "uint256", "name": "totalQuestions", "type": "uint256"}, {"internalType": "uint256", "name": "timestamp", "type": "uint256"}, {"internalType": "bool", "name": "passed", "type": "bool"}], "internalType": "struct AcademyCertification.ExamResult", "name": "", "type": "tuple"}],
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
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getAllUserStats",
    "outputs": [{"internalType": "uint256[]", "name": "scores", "type": "uint256[]"}, {"internalType": "uint256[]", "name": "totalQuestions", "type": "uint256[]"}, {"internalType": "uint256[]", "name": "timestamps", "type": "uint256[]"}, {"internalType": "bool[]", "name": "passedStatus", "type": "bool[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// ABI for AcademyNFT contract
const ACADEMY_NFT_ABI = [
  {
    "inputs": [{"internalType": "enum AcademyCertification.ModuleLevel", "name": "moduleLevel", "type": "uint8"}],
    "name": "mintCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}, {"internalType": "enum AcademyCertification.ModuleLevel", "name": "moduleLevel", "type": "uint8"}],
    "name": "hasUserMintedCertificate",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}, {"internalType": "enum AcademyCertification.ModuleLevel", "name": "moduleLevel", "type": "uint8"}],
    "name": "canMintCertificate",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
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
    "name": "getUserMintableModules",
    "outputs": [{"internalType": "bool[]", "name": "", "type": "bool[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "getCertificateInfo",
    "outputs": [{"components": [{"internalType": "address", "name": "recipient", "type": "address"}, {"internalType": "enum AcademyCertification.ModuleLevel", "name": "moduleLevel", "type": "uint8"}, {"internalType": "uint256", "name": "score", "type": "uint256"}, {"internalType": "uint256", "name": "totalQuestions", "type": "uint256"}, {"internalType": "uint256", "name": "timestamp", "type": "uint256"}, {"internalType": "string", "name": "metadataURI", "type": "string"}], "internalType": "struct AcademyNFT.CertificateInfo", "name": "", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"indexed": true, "internalType": "enum AcademyCertification.ModuleLevel", "name": "moduleLevel", "type": "uint8"},
      {"indexed": false, "internalType": "uint256", "name": "score", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "totalQuestions", "type": "uint256"}
    ],
    "name": "CertificateIssued",
    "type": "event"
  }
] as const

// Contract addresses
const CERTIFICATION_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ACADEMY_CERTIFICATION_ADDRESS as `0x${string}`
const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ACADEMY_NFT_ADDRESS as `0x${string}`

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

interface ExamResult {
  score: number
  totalQuestions: number
  timestamp: number
  passed: boolean
}

interface CertificateInfo {
  recipient: string
  moduleLevel: ModuleLevel
  score: number
  totalQuestions: number
  timestamp: number
  metadataURI: string
}

interface UseAcademyContractsReturn {
  // State
  isLoading: boolean
  error: string | null
  
  // Exam functions
  submitExamResult: (moduleId: string, score: number, totalQuestions: number) => Promise<void>
  hasPassedModule: (moduleId: string) => boolean
  getExamResult: (moduleId: string) => ExamResult | null
  getUserPassedModules: () => boolean[]
  
  // NFT functions
  mintCertificate: (moduleId: string) => Promise<void>
  hasUserMintedCertificate: (moduleId: string) => boolean
  canMintCertificate: (moduleId: string) => boolean
  getUserCertificates: () => number[]
  getUserMintableModules: () => boolean[]
  
  // Transaction state
  isSubmittingExam: boolean
  isMintingNFT: boolean
  examSubmissionSuccess: boolean
  nftMintingSuccess: boolean
}

export function useAcademyContracts(): UseAcademyContractsReturn {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [examSubmissionSuccess, setExamSubmissionSuccess] = useState(false)
  const [nftMintingSuccess, setNftMintingSuccess] = useState(false)

  // Contract interaction hooks
  const { writeContract, data: writeHash, isPending: isWritePending } = useWriteContract()
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeHash,
  })

  // Read user's passed modules
  const { data: userPassedModules, refetch: refetchPassedModules } = useReadContract({
    address: CERTIFICATION_CONTRACT_ADDRESS,
    abi: ACADEMY_CERTIFICATION_ABI,
    functionName: 'getUserPassedModules',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!CERTIFICATION_CONTRACT_ADDRESS,
  })

  // Read user's all stats
  const { data: userStats, refetch: refetchUserStats } = useReadContract({
    address: CERTIFICATION_CONTRACT_ADDRESS,
    abi: ACADEMY_CERTIFICATION_ABI,
    functionName: 'getAllUserStats',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!CERTIFICATION_CONTRACT_ADDRESS,
  })

  // Read user's certificates
  const { data: userCertificates, refetch: refetchUserCertificates } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: ACADEMY_NFT_ABI,
    functionName: 'getUserCertificates',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!NFT_CONTRACT_ADDRESS,
  })

  // Read user's mintable modules
  const { data: userMintableModules, refetch: refetchMintableModules } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: ACADEMY_NFT_ABI,
    functionName: 'getUserMintableModules',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address && !!NFT_CONTRACT_ADDRESS,
  })

  // Track current operation
  const [currentOperation, setCurrentOperation] = useState<'exam' | 'nft' | null>(null)

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && writeHash) {
      if (currentOperation === 'exam') {
        setExamSubmissionSuccess(true)
        toast.success('Exam result submitted successfully!')
        refetchPassedModules()
        refetchUserStats()
        refetchMintableModules()
        setTimeout(() => setExamSubmissionSuccess(false), 3000)
      } else if (currentOperation === 'nft') {
        setNftMintingSuccess(true)
        toast.success('Certificate NFT minted successfully!')
        refetchUserCertificates()
        refetchMintableModules()
        setTimeout(() => setNftMintingSuccess(false), 3000)
      }
      setCurrentOperation(null)
    }
  }, [isConfirmed, writeHash, currentOperation, refetchPassedModules, refetchUserStats, refetchUserCertificates, refetchMintableModules])

  const submitExamResult = async (moduleId: string, score: number, totalQuestions: number): Promise<void> => {
    if (!isConnected || !address) {
      setError('Please connect your wallet')
      toast.error('Please connect your wallet')
      return
    }

    if (!CERTIFICATION_CONTRACT_ADDRESS) {
      setError('Certification contract not configured')
      toast.error('Certification contract not configured')
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
      setCurrentOperation('exam')
      
      writeContract({
        address: CERTIFICATION_CONTRACT_ADDRESS,
        abi: ACADEMY_CERTIFICATION_ABI,
        functionName: 'submitExamResult',
        args: [address, moduleLevel, BigInt(score), BigInt(totalQuestions)],
      })
    } catch (err) {
      console.error('Submit exam result error:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit exam result')
      toast.error('Failed to submit exam result')
      setCurrentOperation(null)
    }
  }

  const mintCertificate = async (moduleId: string): Promise<void> => {
    if (!isConnected || !address) {
      setError('Please connect your wallet')
      toast.error('Please connect your wallet')
      return
    }

    if (!NFT_CONTRACT_ADDRESS) {
      setError('NFT contract not configured')
      toast.error('NFT contract not configured')
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
      setCurrentOperation('nft')
      
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: ACADEMY_NFT_ABI,
        functionName: 'mintCertificate',
        args: [moduleLevel],
      })
    } catch (err) {
      console.error('Mint certificate error:', err)
      setError(err instanceof Error ? err.message : 'Failed to mint certificate')
      toast.error('Failed to mint certificate')
      setCurrentOperation(null)
    }
  }

  const hasPassedModule = (moduleId: string): boolean => {
    const moduleLevel = MODULE_ID_TO_LEVEL[moduleId]
    if (moduleLevel === undefined || !userPassedModules) return false
    return userPassedModules[moduleLevel] || false
  }

  const getExamResult = (moduleId: string): ExamResult | null => {
    const moduleLevel = MODULE_ID_TO_LEVEL[moduleId]
    if (moduleLevel === undefined || !userStats) return null
    
    const [scores, totalQuestions, timestamps, passedStatus] = userStats
    if (!scores || !totalQuestions || !timestamps || !passedStatus) return null
    
    return {
      score: Number(scores[moduleLevel]),
      totalQuestions: Number(totalQuestions[moduleLevel]),
      timestamp: Number(timestamps[moduleLevel]),
      passed: passedStatus[moduleLevel]
    }
  }

  const getUserPassedModules = (): boolean[] => {
    return userPassedModules ? [...userPassedModules] : [false, false, false]
  }

  const hasUserMintedCertificate = (moduleId: string): boolean => {
    const moduleLevel = MODULE_ID_TO_LEVEL[moduleId]
    if (moduleLevel === undefined || !userCertificates) return false
    return Number(userCertificates[moduleLevel]) > 0
  }

  const canMintCertificate = (moduleId: string): boolean => {
    const moduleLevel = MODULE_ID_TO_LEVEL[moduleId]
    if (moduleLevel === undefined || !userMintableModules) return false
    return userMintableModules[moduleLevel] || false
  }

  const getUserCertificates = (): number[] => {
    return userCertificates ? userCertificates.map(id => Number(id)) : [0, 0, 0]
  }

  const getUserMintableModules = (): boolean[] => {
    return userMintableModules ? [...userMintableModules] : [false, false, false]
  }

  return {
    isLoading,
    error,
    submitExamResult,
    hasPassedModule,
    getExamResult,
    getUserPassedModules,
    mintCertificate,
    hasUserMintedCertificate,
    canMintCertificate,
    getUserCertificates,
    getUserMintableModules,
    isSubmittingExam: currentOperation === 'exam' && (isWritePending || isConfirming),
    isMintingNFT: currentOperation === 'nft' && (isWritePending || isConfirming),
    examSubmissionSuccess,
    nftMintingSuccess,
  }
}