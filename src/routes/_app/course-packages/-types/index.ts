export interface CoursePackageTranslations {
  name?: string | null
  description?: string | null
  requirements?: string | null
  best_for?: string | null
}

export interface CoursePackage {
  id: string
  courseId: string | null
  course: {
    id: string
    name?: string | null
    slug?: string | null
    title: string | null
    subTitle?: string | null
    shortDescription?: string | null
    description?: string | null
  } | null
  subCourseId: string | null
  subCourse?: { id: string; title: string | null; name?: string | null } | null
  sub_course?: { id: string; title: string | null; name?: string | null } | null
  name: string
  slug: string | null
  description: string | null
  price: number | string
  discountType: 'FLAT' | 'PERCENTAGE' | null
  discountValue: number | string | null
  specialDiscountType: 'FLAT' | 'PERCENTAGE' | null
  specialDiscount: number | string | null
  vatRate: number | string | null
  deliveryType: 'CLASSROOM' | 'ONLINE' | string
  duration: number | string | null
  noOfDaysPerWeek: number | string | null
  totalHours: number | string | null
  classSize?: number | string | null
  orderIndex?: number | null
  requirements: string | null
  scheduleInfo: string | null
  bestFor: string[] | null
  image: string | null
  isActive: boolean
  translations?: Record<string, CoursePackageTranslations> | null
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
  translations?: {
    ar?: {
      name?: string
      description?: string
      requirements?: string
      best_for?: string
    }
  }
}
