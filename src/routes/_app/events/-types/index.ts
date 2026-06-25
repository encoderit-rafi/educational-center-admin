export interface Event {
  id: string
  title: string | null
  slug: string | null
  description: string | null
  eventType: string | null
  bannerImage: string | null
  location: string | null
  isOnline: boolean | null
  meetingLink: string | null
  startDate: string | null
  endDate: string | null
  startTime: string | null
  endTime: string | null
  totalSeats: number | null
  bookedSeats: number | null
  price: string | null
  vatRate: string | null
  isActive: boolean | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface EventsResponse {
  data: Event[]
  total: number
  page: number
  totalPages: number
}

export interface CreateEventInput {
  title: string
  event_type: string
  description?: string
  location?: string
  is_online?: boolean
  meeting_link?: string | null
  start_date: string
  end_date: string
  start_time?: string
  end_time?: string
  total_seats?: number | null
  price: number
  vat_rate?: number | null
  is_active?: boolean
  banner_image?: string
}

export interface EventBooking {
  id: string
  userId: string | null
  eventId: string | null
  bookingRef: string | null
  firstName: string
  middleName: string | null
  lastName: string
  email: string
  phone: string | null
  address: string | null
  country: string | null
  status: string | null
  price: string | null
  vatAmount: string | null
  totalAmount: string | null
  paymentId: string | null
  attended: boolean | null
  pdfUrl: string | null
  emailSentAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface EventBookingsResponse {
  data: EventBooking[]
  total: number
  page: number
  totalPages: number
}
