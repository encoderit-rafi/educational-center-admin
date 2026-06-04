export interface SubCourse {
  id: string
  courseId: string | null
  name: string | null
  slug: string | null
  title: string
  subTitle: string | null
  shortDescription: string | null
  description: string | null
  logo: string | null
  bannerImage: string | null
  price: number | null
  discountType: 'FLAT' | 'PERCENTAGE' | null
  discountValue: number | null
  vatRate: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface SubCoursesResponse {
  data: SubCourse[]
  total: number
  page: number
  totalPages: number
}

export interface CreateSubCourseInput {
  courseId?: string
  name?: string
  title: string
  subTitle: string
  shortDescription?: string
  description?: string
  logo?: string
  bannerImage?: string
  price?: number
  discountType?: 'FLAT' | 'PERCENTAGE'
  discountValue?: number
  vatRate?: number
  isActive?: boolean
}
