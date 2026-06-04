export interface Payment {
  id: string
  paymentRef: string | null
  userId: string | null
  courseBookingId: string | null
  examBookingId: string | null
  mockTestBookingId: string | null
  workshopBookingId: string | null
  payerEmail: string | null
  provider: 'STRIPE' | 'PAYPAL' | null
  status: 'INITIATED' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'
  amount: number | null
  vatAmount: number | null
  discountAmount: number | null
  currency: string | null
  paymentType: 'EXAM_BOOKING' | 'COURSE_BOOKING' | 'MOCK_TEST_BOOKING' | 'WORKSHOP_BOOKING' | 'EVENT_BOOKING' | null
  referenceId: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Refund {
  id: string
  paymentId: string | null
  amount: number | null
  reason: string | null
  status: string | null
  refundedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PaymentsResponse {
  data: Payment[]
  total: number
  page: number
  totalPages: number
}

export interface RefundsResponse {
  data: Refund[]
  total: number
  page: number
  totalPages: number
}
