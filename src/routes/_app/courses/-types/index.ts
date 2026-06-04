export interface Course {
  id: string
  name: string | null
  slug: string | null
  title: string | null
  subTitle: string | null
  shortDescription: string | null
  description: string | null
  testDateContent: string | null
  testRegistrationContent: string | null
  websiteUrl: string | null
  logo: string | null
  bannerImage: string | null
  keyBenefits: unknown | null
  focusArea: unknown | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  sub_courses?: Array<{
    id: string
    title: string | null
    name: string | null
    slug: string | null
    price: number | null
  }>
  packages?: Array<{
    id: string
    name: string | null
    price: number | null
  }>
  exams?: Array<{
    id: string
    title: string | null
    type: string | null
  }>
}

export interface CoursesResponse {
  data: Course[]
  total: number
  page: number
  totalPages: number
}

export interface CreateCourseInput {
  title: string
  sub_title: string
  short_description?: string
  description?: string
  test_date_content?: string
  test_registration_content?: string
  website_url?: string
  logo?: string
  banner_image?: string
  key_benefits?: string[]
  focus_area?: string[]
  is_active?: boolean
}

export type CourseBookingStatus =
  | 'PENDING'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface CourseBooking {
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
  packageId: string | null
  status: CourseBookingStatus | null
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

export interface CourseBookingsResponse {
  data: CourseBooking[]
  total: number
  page: number
  totalPages: number
}

export interface UpdateCourseBookingStatusInput {
  status: CourseBookingStatus
}
