export interface EnglishTestAnswer {
  id: string
  attemptId?: string | null
  questionId?: string | null
  answer?: string | null
  selectedOption?: string | null
  isCorrect?: boolean | null
  createdAt?: string | null
}

export interface EnglishTestAttempt {
  id: string
  email: string | null
  userId?: string | null
  user_id?: string | null
  fullName?: string | null
  full_name?: string | null
  firstName?: string | null
  first_name?: string | null
  middleName?: string | null
  middle_name?: string | null
  lastName?: string | null
  last_name?: string | null
  phone: string | null
  address: string | null
  country: string | null
  city: string | null
  preferredContactMethod?: string | null
  preferred_contact_method?: string | null
  preferredTimeToContactYou?: string | null
  preferred_time_to_contact_you?: string | null
  datePreference?: string | null
  date_preference?: string | null
  totalScore?: number | null
  total_score?: number | null
  score?: number | null
  englishLevelId?: string | null
  english_level_id?: string | null
  englishLevel?: { id?: string; levelCode?: string; label?: string } | string | null
  level?: string | null
  scoresBySkill?: Record<string, number> | null
  scores_by_skill?: Record<string, number> | null
  startedAt?: string | null
  started_at?: string | null
  completedAt?: string | null
  completed_at?: string | null
  submittedAt?: string | null
  submitted_at?: string | null
  pdfUrl?: string | null
  pdf_url?: string | null
  emailSentAt?: string | null
  email_sent_at?: string | null
  createdAt: string
  created_at?: string
  updatedAt: string
  updated_at?: string
  answers?: EnglishTestAnswer[]
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
  date_preference?: string | null
  datePreference?: string | null
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
    answer_id: string
    question_id: string
    question_text: string
    skill_area: string
    marks: number
    correct_option: string
    correct_option_text: string
    selected_option: string | null
    selected_option_text: string | null
    is_correct: boolean | null
    options: Array<{
      key: string
      label: string
      marks: number
    }>
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
