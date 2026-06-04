export interface MockTest {
  id: string
  courseId: string | null
  name: string | null
  slug: string | null
  type: string | null
  price: string | null
  discountType: 'FLAT' | 'PERCENTAGE' | null
  discountValue: string | null
  vatRate: string | null
  description: string | null
  details: unknown | null
  variant: unknown | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface MockTestsResponse {
  data: MockTest[]
  total: number
  page: number
  totalPages: number
}

export interface CreateMockTestInput {
  courseId?: string
  name?: string
  type?: string
  price?: number
  discountType?: 'FLAT' | 'PERCENTAGE'
  discountValue?: number
  vatRate?: number
  description?: string
  isActive?: boolean
}

