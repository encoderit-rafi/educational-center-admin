import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { ExamBookingsResponse, ExamBooking } from '../-types'

export interface ExamBookingListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
  filter?: { keyword?: string }
}

export function useGetExamBookings(params?: ExamBookingListParams) {
  return queryOptions({
    queryKey: ['exam-bookings', params],
    queryFn: async (): Promise<ExamBookingsResponse> => {
      const res = await api.get('/admin/exam-bookings', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useGetExamBooking(id: string) {
  return queryOptions({
    queryKey: ['exam-booking', id],
    queryFn: async (): Promise<ExamBooking> => {
      const res = await api.get(`/admin/exam-bookings/${id}`)
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useUpdateExamBookingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: string
    }) => {
      const res = await api.put(`/admin/exam-bookings/${id}/status`, {
        status,
      })
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exam-bookings'] })
    },
  })
}

export function useDeleteExamBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/exam-bookings/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exam-bookings'] })
    },
  })
}
