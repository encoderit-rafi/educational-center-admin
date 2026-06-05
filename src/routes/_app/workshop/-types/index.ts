export interface Workshop {
  id: string
  courseId: string | null
  name: string | null
  slug: string | null
  title: string | null
  subTitle: string | null
  shortDescription: string | null
  description: string | null
  logo: string | null
  bannerImage: string | null
  startTime: string | null
  endTime: string | null
  type: string | null
  isActive: boolean
  duration: number | null
  price: number | null
  discountValue: number | null
  discountType: string | null
  vatRate: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface WorkshopsResponse {
  data: Workshop[]
  total: number
  page: number
  totalPages: number
}

export interface CreateWorkshopInput {
  course_id?: string
  name?: string
  title: string
  sub_title: string
  short_description?: string
  description?: string
  logo?: string
  banner_image?: string
  price: number
  duration: number
  start_time?: string
  end_time?: string
  is_active?: boolean
}

export type WorkshopBookingStatus =
  | 'PENDING'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface WorkshopBooking {
  id: string
  userId: string | null
  name: string | null
  firstName: string
  middleName: string | null
  lastName: string | null
  email: string
  phone: string | null
  address: string | null
  country: string | null
  courseId: string | null
  subCourseId: string | null
  workshopId: string | null
  workshopPackageId: string | null
  bookingDate: string | null
  status: WorkshopBookingStatus | null
  basePrice: number | null
  discountAmount: number | null
  vatAmount: number | null
  totalAmount: number | null
  paymentId: string | null
  pdfUrl: string | null
  emailSentAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface WorkshopBookingsResponse {
  data: WorkshopBooking[]
  total: number
  page: number
  totalPages: number
}

export interface UpdateWorkshopBookingStatusInput {
  status: WorkshopBookingStatus
}

export interface WorkshopPackage {
  id: string
  courseId: string | null
  workshopId: string | null
  duration: number | null
  price: number | null
  discountType: string | null
  discountValue: number | null
  vatRate: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface WorkshopPackagesResponse {
  data: WorkshopPackage[]
  total: number
  page: number
  totalPages: number
}

export interface CreateWorkshopPackageInput {
  course_id?: string
  workshop_id?: string
  duration: number
  price: number
  discount_type?: string
  discount_value?: number
  vat_rate?: number
}
