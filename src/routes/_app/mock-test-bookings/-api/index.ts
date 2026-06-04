import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  MockTestBookingsResponse,
  MockTestBooking,
} from '../-types'

export interface MockTestBookingListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
  filter?: { keyword?: string }
}

export function useGetMockTestBookings(
  params?: MockTestBookingListParams,
) {
  return queryOptions({
    queryKey: ['mock-test-bookings', params],
    queryFn: async (): Promise<MockTestBookingsResponse> => {
      const res = await api.get('/admin/mock-test-bookings', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useGetMockTestBooking(id: string) {
  return queryOptions({
    queryKey: ['mock-test-booking', id],
    queryFn: async (): Promise<MockTestBooking> => {
      const res = await api.get(`/admin/mock-test-bookings/${id}`)
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useUpdateMockTestBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
      address?: string
      country?: string
      variant?: string
    }) => {
      const payload: Record<string, unknown> = {}
      if (data.firstName !== undefined)
        payload.first_name = data.firstName
      if (data.lastName !== undefined) payload.last_name = data.lastName
      if (data.email !== undefined) payload.email = data.email
      if (data.phone !== undefined) payload.phone = data.phone
      if (data.address !== undefined) payload.address = data.address
      if (data.country !== undefined) payload.country = data.country
      if (data.variant !== undefined) payload.variant = data.variant
      const res = await api.put(`/admin/mock-test-bookings/${id}`, payload)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['mock-test-bookings'],
      })
    },
  })
}

export function useUpdateMockTestBookingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: string
    }) => {
      const res = await api.put(
        `/admin/mock-test-bookings/${id}/status`,
        { status },
      )
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['mock-test-bookings'],
      })
    },
  })
}

export function useDeleteMockTestBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/mock-test-bookings/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['mock-test-bookings'],
      })
    },
  })
}
