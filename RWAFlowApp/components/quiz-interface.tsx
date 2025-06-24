"use client"

import type { LearningModule } from "@/app/academy/module/[moduleId]/types" // Updated import path
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Clock, Award, Check, AlertTriangle, Gift, Loader2, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAcademyContracts } from "@/hooks/use-academy-contracts"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface QuizInterfaceProps {
  module: LearningModule
}

const QUESTION_TIME_SECONDS = 30

export default function QuizInterface({ module }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS)
  const [showResults, setShowResults] = useState(false)
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false)
  const [hasSubmittedExam, setHasSubmittedExam] = useState(false)
  const [showNFTMinting, setShowNFTMinting] = useState(false)

  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const {
    submitExamResult,
    mintCertificate,
    hasPassedModule,
    canMintCertificate,
    hasUserMintedCertificate,
    isSubmittingExam,
    isMintingNFT,
    examSubmissionSuccess,
    nftMintingSuccess
  } = useAcademyContracts()
  
  const currentQuestion = module.questions[currentQuestionIndex]

  const resetTimer = useCallback(() => {
    setTimeLeft(QUESTION_TIME_SECONDS)
  }, [])

  const handleConfirmAnswer = useCallback(() => {
    if (!currentQuestion || isAnswerConfirmed) return // Prevent multiple confirmations
    setIsAnswerConfirmed(true)

    if (selectedAnswerId === currentQuestion.correctAnswerId) {
      setScore((prevScore) => prevScore + 1)
    }

    setTimeout(() => {
      if (currentQuestionIndex < module.questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
        setSelectedAnswerId(null)
        setIsAnswerConfirmed(false)
        resetTimer()
      } else {
        setShowResults(true)
      }
    }, 1200)
  }, [currentQuestion, selectedAnswerId, currentQuestionIndex, module.questions.length, resetTimer, isAnswerConfirmed])

  useEffect(() => {
    if (showResults || isAnswerConfirmed) return

    if (timeLeft === 0) {
      handleConfirmAnswer()
      return
    }
    const timer = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, showResults, isAnswerConfirmed, handleConfirmAnswer])

  const handleAnswerSelect = (answerId: string) => {
    if (isAnswerConfirmed) return
    setSelectedAnswerId(answerId)
  }

  const handleClose = () => router.push("/academy/modules")

  const xpEarned = score * 10
  const tokensEarned = score * 5
  const percentage = Math.round((score / module.questions.length) * 100)
  const isPassed = percentage >= 50
  const moduleId = module.id

  // Handle exam submission when results are shown
  useEffect(() => {
    if (showResults && !hasSubmittedExam && isAuthenticated) {
      const submitExam = async () => {
        try {
          await submitExamResult(moduleId, score, module.questions.length)
          setHasSubmittedExam(true)
          
          // Show NFT minting option if passed
          if (isPassed) {
            setTimeout(() => setShowNFTMinting(true), 2000)
          }
        } catch (error) {
          console.error('Failed to submit exam result:', error)
        }
      }
      submitExam()
    }
  }, [showResults, hasSubmittedExam, isAuthenticated, submitExamResult, moduleId, score, module.questions.length, isPassed])

  // Handle successful NFT minting
  useEffect(() => {
    if (nftMintingSuccess) {
      toast.success('🎉 Certificate NFT minted successfully!')
      setShowNFTMinting(false)
    }
  }, [nftMintingSuccess])

  const handleMintCertificate = async () => {
    try {
      await mintCertificate(moduleId)
    } catch (error) {
      console.error('Failed to mint certificate:', error)
    }
  }

  if (showResults) {
    const alreadyHasCertificate = hasUserMintedCertificate(moduleId)
    const canMint = canMintCertificate(moduleId)
    const userHasPassed = hasPassedModule(moduleId)

    return (
      <Card className="w-full max-w-lg shadow-xl bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-gray-800">{module.title} - Results</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-500 hover:text-metallic-green">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="text-center py-10">
          {isPassed ? (
            <div className="mb-6">
              <Star className="h-24 w-24 text-yellow-400 mx-auto mb-4" />
              <div className="text-6xl mb-2">🎉</div>
            </div>
          ) : (
            <Award className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          )}
          
          <h2 className={`text-3xl font-bold mb-3 ${isPassed ? 'text-metallic-green' : 'text-gray-600'}`}>
            {isPassed ? 'Congratulations!' : 'Quiz Completed'}
          </h2>
          
          <p className="text-xl text-gray-700 mb-2">
            Your Score: {score} / {module.questions.length} ({percentage}%)
          </p>
          
          {isPassed ? (
            <p className="text-lg text-metallic-green font-semibold mb-4">
              ✅ You passed! (50% or higher required)
            </p>
          ) : (
            <p className="text-lg text-red-600 font-semibold mb-4">
              ❌ You need 50% or higher to pass
            </p>
          )}

          {isAuthenticated && (
            <div className="my-6 space-y-3">
              {isSubmittingExam && (
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting exam result...</span>
                </div>
              )}
              
              {examSubmissionSuccess && (
                <div className="text-metallic-green font-semibold">
                  ✅ Exam result saved to blockchain!
                </div>
              )}

              {isPassed && isAuthenticated && showNFTMinting && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                  <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">
                    Claim Your Certificate NFT!
                  </h3>
                  <p className="text-sm text-purple-600 mb-3">
                    You've earned a soulbound certificate NFT for passing this module.
                  </p>
                  
                  {alreadyHasCertificate ? (
                    <div className="text-metallic-green font-semibold">
                      ✅ Certificate already minted!
                    </div>
                  ) : canMint ? (
                    <Button
                      onClick={handleMintCertificate}
                      disabled={isMintingNFT}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isMintingNFT ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Minting NFT...
                        </>
                      ) : (
                        <>
                          <Gift className="mr-2 h-4 w-4" />
                          Mint Certificate NFT
                        </>
                      )}
                    </Button>
                  ) : userHasPassed ? (
                    <div className="text-gray-600 text-sm">
                      Certificate already claimed or not available
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {!isAuthenticated && isPassed && (
            <div className="my-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Connect your wallet to save your progress and claim your certificate NFT!
              </p>
            </div>
          )}

          <div className="my-6 space-y-2">
            <p className="text-lg font-semibold text-metallic-green">+{xpEarned} XP Earned</p>
            <p className="text-lg font-semibold text-purple-600">+{tokensEarned} Flow Tokens</p>
          </div>
          
          <Button
            onClick={handleClose}
            className="w-full bg-green-gradient text-white hover:opacity-90 transition-opacity shadow-md"
          >
            Back to Modules
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!currentQuestion) return <div className="p-4 text-center text-gray-600">Loading question...</div>

  return (
    <Card className="w-full max-w-lg shadow-xl bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-gray-800">{module.title}</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-500 hover:text-metallic-green">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="py-6">
        <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
          <p>
            Question {currentQuestionIndex + 1} of {module.questions.length}
          </p>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-metallic-green" />
            <span>{timeLeft}s</span>
          </div>
        </div>
        <Progress
          value={((currentQuestionIndex + 1) / module.questions.length) * 100}
          className="mb-6 h-2 [&>*]:bg-metallic-green"
        />

        <h3 className="text-lg font-semibold mb-6 text-gray-700 min-h-[3em]">{currentQuestion.questionText}</h3>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswerId === option.id
            let buttonClasses = "border-gray-300 text-gray-700 bg-white hover:border-metallic-green hover:bg-emerald-50/50 hover:text-metallic-green"
            let icon = null

            if (isAnswerConfirmed) {
              if (option.id === currentQuestion.correctAnswerId) {
                buttonClasses = "bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-400"
                icon = <Check className="mr-2 h-5 w-5 text-emerald-600 flex-shrink-0" />
              } else if (isSelected && option.id !== currentQuestion.correctAnswerId) {
                buttonClasses = "bg-red-50 border-red-400 text-red-700 ring-2 ring-red-400"
                icon = <AlertTriangle className="mr-2 h-5 w-5 text-red-600 flex-shrink-0" />
              } else {
                buttonClasses = "border-gray-300 text-gray-500 bg-white opacity-70" // Muted for non-selected, non-correct after answer
              }
            } else if (isSelected) {
              buttonClasses = "bg-emerald-50 border-metallic-green text-metallic-green ring-2 ring-metallic-green"
            }

            return (
              <Button
                key={option.id}
                variant="outline"
                className={`w-full justify-start h-auto py-3 text-left whitespace-normal transition-all duration-150 flex items-center !bg-transparent ${buttonClasses}`}
                onClick={() => handleAnswerSelect(option.id)}
                disabled={isAnswerConfirmed}
                style={{
                  backgroundColor: isAnswerConfirmed 
                    ? (option.id === currentQuestion.correctAnswerId 
                        ? 'rgb(236 253 245)' // emerald-50
                        : isSelected && option.id !== currentQuestion.correctAnswerId 
                          ? 'rgb(254 242 242)' // red-50
                          : 'white')
                    : isSelected 
                      ? 'rgb(236 253 245)' // emerald-50
                      : 'white'
                }}
              >
                {icon}
                <span className="flex-grow">{option.text}</span>
              </Button>
            )
          })}
        </div>

        {!isAnswerConfirmed && selectedAnswerId && (
          <Button
            onClick={handleConfirmAnswer}
            className="w-full bg-green-gradient text-white hover:opacity-90 transition-opacity shadow-md"
          >
            Confirm Answer
          </Button>
        )}
        {isAnswerConfirmed && (
          <Button className="w-full bg-gray-300 text-gray-500 border-0 cursor-wait" disabled>
            Next Question...
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
