"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Header from "@/components/header"

const onboardingSteps = [
  {
    id: "experience",
    title: "Investment Experience",
    question: "What's your experience with investing?",
    type: "radio",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    id: "goal",
    title: "Main Goal",
    question: "What's your main goal?",
    type: "radio",
    options: ["Passive income", "Capital growth", "Diversification"],
  },
  {
    id: "risk",
    title: "Risk Tolerance",
    question: "What's your risk tolerance?",
    type: "radio",
    options: ["Low", "Medium", "High"],
  },
  {
    id: "assets",
    title: "Asset Interest",
    question: "Types of assets you're interested in:",
    type: "checkbox",
    options: ["Real Estate", "Art", "Agriculture", "Debt", "Energy"],
  },
  {
    id: "investmentAmount",
    title: "Investment Amount",
    question: "How much do you plan to invest?",
    type: "radio",
    options: ["<$100", "$100 - $1,000", "$1,000 - $10,000", ">$10,000"],
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | string[]>>({})
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, [onboardingSteps[currentStep].id]: value }))
  }
  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentSelection = (formData[onboardingSteps[currentStep].id] as string[]) || []
    let newSelection
    if (checked) {
      newSelection = [...currentSelection, option]
    } else {
      newSelection = currentSelection.filter((item) => item !== option)
    }
    setFormData((prev) => ({ ...prev, [onboardingSteps[currentStep].id]: newSelection }))
  }
  const handleSubmit = () => {
    const queryParams = new URLSearchParams({ data: JSON.stringify(formData) }).toString()
    router.push(`/plan?${queryParams}`)
  }

  const step = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1
  const isFirstStep = currentStep === 0
  const radioValue = (formData[step.id] as string) || ""
  const checkboxValues = (formData[step.id] as string[]) || []

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg shadow-xl bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Investment Profile</CardTitle>
            <CardDescription className="text-gray-500">
              Step {currentStep + 1} of {onboardingSteps.length}: {step.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="space-y-4">
                <Label className="text-md font-medium text-gray-700">{step.question}</Label>
                {step.type === "radio" && (
                  <RadioGroup value={radioValue} onValueChange={handleRadioChange}>
                    {step.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`${step.id}-${option}`}
                          className="data-[state=checked]:bg-metallic-green data-[state=checked]:border-metallic-green text-metallic-green focus:ring-metallic-green"
                        />
                        <Label htmlFor={`${step.id}-${option}`} className="text-gray-700">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {step.type === "checkbox" && (
                  <div className="space-y-2">
                    {step.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${step.id}-${option}`}
                          checked={checkboxValues.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxChange(option, !!checked)}
                          className="data-[state=checked]:bg-metallic-green data-[state=checked]:border-metallic-green data-[state=checked]:text-white focus:ring-metallic-green"
                        />
                        <Label htmlFor={`${step.id}-${option}`} className="text-gray-700">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="border-metallic-green text-metallic-green hover:bg-emerald-50"
            >
              Previous
            </Button>
            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                className="bg-green-gradient text-white hover:opacity-90 transition-opacity shadow-md"
              >
                Generate my Plan
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-green-gradient text-white hover:opacity-90 transition-opacity shadow-md"
              >
                Next
              </Button>
            )}
          </CardFooter>
        </Card>
        <div className="w-full max-w-lg mt-6">
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className="absolute top-0 left-0 h-2 bg-metallic-green rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
