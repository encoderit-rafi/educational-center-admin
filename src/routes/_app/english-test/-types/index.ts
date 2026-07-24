export interface EnglishTestAttempt {
  id: string
  email: string | null
  userId: string | null
  fullName: string | null
  firstName: string | null
  middleName: string | null
  lastName: string | null
  phone: string | null
  address: string | null
  country: string | null
  city: string | null
  preferredContactMethod: string | null
  preferredTimeToContactYou: string | null
  totalScore: number | null
  englishLevelId: string | null
  scoresBySkill: Record<string, number> | null
  startedAt: string | null
  completedAt: string | null
  submittedAt: string | null
  pdfUrl: string | null
  emailSentAt: string | null
  createdAt: string
  updatedAt: string
  level: string | null
  score: number | null
}

export interface EnglishTestAttemptsResponse {
  data: EnglishTestAttempt[]
  total: number
  page: number
  totalPages: number
}

export interface EnglishLevelDefinition {
  id: string
  levelCode: string | null
  label: string | null
  minScore: number | null
  maxScore: number | null
  description: string | null
  isActive: boolean | null
  createdAt: string
  updatedAt: string
}

export interface EnglishLevelDefinitionsResponse {
  data: EnglishLevelDefinition[]
  total: number
  page: number
  totalPages: number
}

export interface EnglishTestAttemptData {
  id: string
  email: string | null
  user_id: string | null
  full_name: string | null
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  phone: string | null
  address: string | null
  country: string | null
  city: string | null
  preferred_contact_method: string | null
  preferred_time_to_contact_you: string | null
  started_at: string | null
  submitted_at: string | null
  total_score: number | null
  pdf_url: string | null
  email_sent_at: string | null
  scores_by_skill: Record<string, number> | null
  created_at: string
  updated_at: string
}

export interface EnglishTestAttemptDetailResponse {
  attempt: EnglishTestAttemptData
  english_level: { id: string; level_code: string; label: string } | null
  linked_user: { id: string; full_name: string; email: string } | null
  questions_and_answers: Array<{
    question_id: string
    question_text: string
    answer_text: string | null
    correct_answer: string
    is_correct: boolean
    score: number
    max_score: number
  }>
}

export interface CreateLevelDefinitionInput {
  level_code: string
  label: string
  min_score: number
  max_score: number
  description?: string
  is_active?: boolean
}
