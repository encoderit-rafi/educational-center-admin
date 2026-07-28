export interface ExamBooking {
  id: string
  bookingReference?: string | null
  booking_reference?: string | null
  userId?: string | null
  examId?: string | null
  courseId?: string | null
  packageId?: string | null
  workshopId?: string | null
  workshopPackageId?: string | null
  formData?: Record<string, unknown> | null
  paymentId?: string | null
  pdfUrl?: string | null
  emailSentAt?: string | null
  firstName: string
  middleName?: string | null
  lastName?: string
  dateOfBirth?: string | null
  gender?: string | null
  nationality?: string | null
  email: string
  phone?: string | null
  address?: string | null
  country?: string | null
  idType?: string | null
  idNumber?: string | null
  sessionDate?: string | null
  sessionTime?: string | null
  examFee?: string | null
  courseFee?: string | null
  workshopFee?: string | null
  additionalFee?: string | null
  discountAmount?: string | null
  vatAmount?: string | null
  totalAmount?: string | null
  status: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface ExamBookingsResponse {
  data: ExamBooking[]
  total: number
  page: number
  totalPages: number
}

export const EXAM_BOOKING_STATUSES = [
  'PENDING',
  'PAYMENT_PENDING',
  'CONFIRMED',
  'CANCELLED',
  'REFUNDED',
] as const

export type ExamBookingStatus = (typeof EXAM_BOOKING_STATUSES)[number]
