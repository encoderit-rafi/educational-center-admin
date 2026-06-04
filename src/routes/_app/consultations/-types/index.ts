export interface Slot {
  id: string
  slotDate: string
  startTime: string
  endTime: string
  durationMinutes: number
  isAvailable: boolean
  isBlocked: boolean
  createdAt: string
  updatedAt: string
}

export type ConsultationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'

export interface ConsultationExam {
  id: string
  courseId: string
  name: string
  slug: string
}

export interface Consultation {
  id: string
  bookingRef: string
  consultationType: string
  examId: string
  subCourseId: string | null
  firstName: string
  middleName: string | null
  lastName: string
  email: string
  phone: string | null
  country: string
  address: string | null
  preferredDate: string
  file: string | null
  slotId: string
  status: ConsultationStatus
  createdAt: string
  updatedAt: string
  exam: ConsultationExam | null
}

export interface ConsultationsResponse {
  data: Consultation[]
  total: number
  page: number
  totalPages: number
}

