export interface Coupon {
  id: string
  code: string
  description: string | null
  discountType: 'percentage' | 'flat' | 'PERCENTAGE' | 'FLAT'
  discountValue: number | string
  maxUses: number | null
  minPurchaseAmount: number | null
  maxDiscountAmount: number | null
  startDate: string | null
  endDate: string | null
  isActive: boolean
  applicableTo: string[]
  applicableEntityIds: string[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CouponsResponse {
  data: Coupon[]
  total: number
  page: number
  totalPages: number
}

export interface CreateCouponInput {
  code: string
  description?: string
  discount_type: 'percentage' | 'flat'
  discount_value: number
  max_uses?: number | null
  min_purchase_amount?: number | null
  max_discount_amount?: number | null
  start_date?: string | null
  end_date?: string | null
  is_active?: boolean
  applicable_to?: string[]
  applicable_entity_ids?: string[]
}

export interface CouponUsage {
  id: string
  couponId: string
  userId: string | null
  user: {
    id: string
    name: string | null
    email: string | null
    phone?: string | null
  } | null
  entityType: string | null
  entityId: string | null
  purchaseAmount: number | null
  discountAmount: number | null
  createdAt: string
}

export interface CouponUsagesResponse {
  data: CouponUsage[]
  total: number
  page: number
  totalPages: number
}
