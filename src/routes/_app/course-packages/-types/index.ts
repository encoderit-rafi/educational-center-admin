export interface CoursePackage {
  id: string
  courseId: string | null
  course: { id: string; title: string | null } | null
  subCourseId: string | null
  name: string
  slug: string | null
  description: string | null
  price: number
  discountType: 'FLAT' | 'PERCENTAGE' | null
  discountValue: number | null
  specialDiscountType: 'FLAT' | 'PERCENTAGE' | null
  specialDiscount: number | null
  vatRate: number | null
  deliveryType: 'CLASSROOM' | 'ONLINE'
  duration: number | null
  noOfDaysPerWeek: number | null
  totalHours: number | null
  requirements: string | null
  scheduleInfo: string | null
  bestFor: string[] | null
  image: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CoursePackagesResponse {
  data: CoursePackage[]
  total: number
  page: number
  totalPages: number
}

export interface CreateCoursePackageInput {
  name: string
  courseId?: string
  subCourseId?: string
  description?: string
  price: number
  discountType?: string
  discountValue?: number
  specialDiscountType?: string
  specialDiscount?: number
  vatRate?: number
  deliveryType: string
  duration?: number
  noOfDaysPerWeek?: number
  totalHours?: number
  requirements?: string
  scheduleInfo?: string
  image?: string
  bestFor?: string[]
  isActive?: boolean
}
