export interface EnglishTestAttempt {
  id: string
  userId: string | null
  score: number | null
  level: string | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
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

export interface CreateLevelDefinitionInput {
  level_code: string
  label: string
  min_score: number
  max_score: number
  description?: string
  is_active?: boolean
}
