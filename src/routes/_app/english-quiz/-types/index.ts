export interface EnglishQuizQuestion {
  question: string
  answer: string
}

export interface EnglishQuizSubmission {
  id: string
  fullName: string | null
  email: string | null
  phone: string | null
  country: string | null
  city: string | null
  followUp: string | null
  score?: string | null
  questions: EnglishQuizQuestion[]
  createdAt: string
  updatedAt: string
}

export interface EnglishQuizSubmissionsResponse {
  data: EnglishQuizSubmission[]
  total: number
  page: number
  totalPages: number
}
