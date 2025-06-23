// This is a new file to hold types for the module page, to avoid redeclaring them.
export interface QuizQuestion {
  id: string
  questionText: string
  options: { id: string; text: string }[]
  correctAnswerId: string
}

export interface LearningModule {
  id: string
  title: string
  level?: number // Optional: if you want to display level on quiz page
  questions: QuizQuestion[]
  completed?: boolean // Optional: for future use
  description?: string // Optional: for future use
}
