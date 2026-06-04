export interface ContactSubmission {
  id: string
  firstName: string | null
  middleName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  country: string | null
  address: string | null
  category: 'GENERAL' | 'ASSESSMENT_SOLUTIONS' | 'EXAM_PROCTORING' | 'EXAM_DELIVERY' | 'OTHER' | null
  subject: string | null
  message: string | null
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface ContactsResponse {
  data: ContactSubmission[]
  total: number
  page: number
  totalPages: number
}
