import api from '@/lib/axios'
import {
  useQuery,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  CouponsResponse,
  CreateCouponInput,
  CouponUsagesResponse,
} from '../-types'

export interface ListParams {
  keyword?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetCoupons(params?: ListParams) {
  return queryOptions({
    queryKey: ['coupons', params],
    queryFn: async (): Promise<CouponsResponse> => {
      const res = await api.get('/admin/coupons', { params })
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

function buildCouponPayload(data: CreateCouponInput) {
  const payload: Record<string, unknown> = {
    code: data.code,
    description: data.description || '',
    discount_type: data.discount_type,
    discount_value: Number(data.discount_value),
    is_active: data.is_active ?? true,
    applicable_to: data.applicable_to ?? [],
    applicable_entity_ids: data.applicable_entity_ids ?? [],
  }
  if (data.max_uses !== undefined && data.max_uses !== null) payload.max_uses = Number(data.max_uses)
  if (data.min_purchase_amount !== undefined && data.min_purchase_amount !== null) payload.min_purchase_amount = Number(data.min_purchase_amount)
  if (data.max_discount_amount !== undefined && data.max_discount_amount !== null) payload.max_discount_amount = Number(data.max_discount_amount)
  if (data.start_date) payload.start_date = data.start_date
  if (data.end_date) payload.end_date = data.end_date

  return payload
}

export function useCreateCoupon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateCouponInput) => {
      const res = await api.post('/admin/coupons', buildCouponPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
  })
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: CreateCouponInput & { id: string }) => {
      const res = await api.put(`/admin/coupons/${id}`, buildCouponPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
  })
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/coupons/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
  })
}

export function useGetCouponUsages(id: string, params?: { page?: number; limit?: number }) {
  return queryOptions({
    queryKey: ['coupon-usages', id, params],
    queryFn: async (): Promise<CouponUsagesResponse> => {
      const res = await api.get(`/admin/coupons/${id}/usages`, { params })
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useGetCourseOptions() {
  return useQuery({
    queryKey: ['courses', 'all'],
    queryFn: async (): Promise<Array<{ id: string; title: string | null; name: string | null }>> => {
      const res = await api.get('/admin/courses', {
        params: { page: 1, limit: 100, sortBy: 'title', sortOrder: 'asc' },
      })
      return res.data.data?.data ?? []
    },
    staleTime: 15 * 60 * 1000,
  })
}

export function useGetExamOptions() {
  return useQuery({
    queryKey: ['exams', 'all'],
    queryFn: async (): Promise<Array<{ id: string; name: string | null }>> => {
      const res = await api.get('/admin/exams', {
        params: { page: 1, limit: 1000, sortBy: 'name', sortOrder: 'asc' },
      })
      return res.data.data?.data ?? []
    },
    staleTime: 15 * 60 * 1000,
  })
}

export function useGetMockTestOptions() {
  return useQuery({
    queryKey: ['mock-tests', 'all'],
    queryFn: async (): Promise<Array<{ id: string; name: string | null }>> => {
      const res = await api.get('/admin/mock-tests', {
        params: { page: 1, limit: 1000, sortBy: 'name', sortOrder: 'asc' },
      })
      return res.data.data?.data ?? []
    },
    staleTime: 15 * 60 * 1000,
  })
}

import type { CoursePackage } from '../../course-packages/-types'

export function useGetCoursePackageOptions() {
  return useQuery({
    queryKey: ['course-packages', 'all'],
    queryFn: async (): Promise<CoursePackage[]> => {
      const res = await api.get('/admin/course-packages', {
        params: { page: 1, limit: 1000, sortBy: 'name', sortOrder: 'asc' },
      })
      return res.data.data?.data ?? []
    },
    staleTime: 15 * 60 * 1000,
  })
}

export function useGetWorkshopOptions() {
  return useQuery({
    queryKey: ['workshops', 'all'],
    queryFn: async (): Promise<Array<{ id: string; title: string | null; name: string | null }>> => {
      const res = await api.get('/admin/workshops', {
        params: { page: 1, limit: 1000, sortBy: 'title', sortOrder: 'asc' },
      })
      return res.data.data?.data ?? []
    },
    staleTime: 15 * 60 * 1000,
  })
}
