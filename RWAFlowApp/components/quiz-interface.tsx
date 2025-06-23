"use client"

import type { LearningModule } from "@/app/academy/module/[moduleId]/types" // Updated import path
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Clock, Award, Check, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

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

  const router = useRouter()
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

  if (showResults) {
    return (
      <Card className="w-full max-w-lg shadow-xl bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-gray-800">{module.title} - Results</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-500 hover:text-metallic-green">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="text-center py-10">
          <Award className="h-24 w-24 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Quiz Completed!</h2>
          <p className="text-xl text-gray-700 mb-2">
            Your Score: {score} / {module.questions.length}
          </p>
          <div className="my-6 space-y-2">
            <p className="text-lg font-semibold text-metallic-green">+{xpEarned} XP Earned</p>
            <p className="text-lg font-semibold text-purple-600">+{tokensEarned} Flow Tokens</p>{" "}
            {/* Kept purple for variety */}
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
            let buttonClasses = "border-gray-300 text-gray-700 hover:border-metallic-green hover:bg-emerald-50/50"
            let icon = null

            if (isAnswerConfirmed) {
              if (option.id === currentQuestion.correctAnswerId) {
                buttonClasses = "bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-400"
                icon = <Check className="mr-2 h-5 w-5 text-emerald-600 flex-shrink-0" />
              } else if (isSelected && option.id !== currentQuestion.correctAnswerId) {
                buttonClasses = "bg-red-50 border-red-400 text-red-700 ring-2 ring-red-400"
                icon = <AlertTriangle className="mr-2 h-5 w-5 text-red-600 flex-shrink-0" />
              } else {
                buttonClasses = "border-gray-300 text-gray-500 opacity-70" // Muted for non-selected, non-correct after answer
              }
            } else if (isSelected) {
              buttonClasses = "bg-emerald-50 border-metallic-green text-metallic-green ring-2 ring-metallic-green"
            }

            return (
              <Button
                key={option.id}
                variant="outline"
                className={`w-full justify-start h-auto py-3 text-left whitespace-normal transition-all duration-150 flex items-center ${buttonClasses}`}
                onClick={() => handleAnswerSelect(option.id)}
                disabled={isAnswerConfirmed}
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
