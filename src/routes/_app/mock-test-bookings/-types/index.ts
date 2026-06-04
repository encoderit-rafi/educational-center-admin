export interface MockTestBooking {
  id: string
  userId?: string | null
  firstName: string
  middleName?: string | null
  lastName?: string
  email: string
  phone?: string | null
  address?: string | null
  country?: string | null
  mockTestId?: string | null
  scheduleId?: string | null
  bookingRef?: string | null
  status: string
  price?: string | null
  vatAmount?: string | null
  totalAmount?: string | null
  paymentId?: string | null
  pdfUrl?: string | null
  variant?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface MockTestBookingsResponse {
  data: MockTestBooking[]
  total: number
  page: number
  totalPages: number
}

export const MOCK_TEST_BOOKING_STATUSES = [
  'PENDING',
  'PAYMENT_PENDING',
  'CONFIRMED',
  'CANCELLED',
  'REFUNDED',
] as const

export type MockTestBookingStatus =
  (typeof MOCK_TEST_BOOKING_STATUSES)[number]
