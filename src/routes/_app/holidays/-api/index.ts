import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { HolidaysResponse, CreateHolidayInput } from '../-types'

export interface HolidayListParams {
  keyword?: string
  holidayType?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetHolidays(params?: HolidayListParams) {
  return queryOptions({
    queryKey: ['holidays', params],
    queryFn: async (): Promise<HolidaysResponse> => {
      const res = await api.get('/admin/holidays', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildPayload(data: CreateHolidayInput) {
  const payload: Record<string, unknown> = {
    title: data.title,
    holiday_type: data.holidayType.toLowerCase(),
    start_date: data.startDate,
    end_date: data.endDate,
    is_recurring: data.isRecurring ?? false,
    is_active: data.isActive ?? true,
  }
  if (data.description) payload.description = data.description
  if (data.country) payload.country = data.country
  if (data.translations) payload.translations = data.translations
  return payload
}

export function useCreateHoliday() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateHolidayInput) => {
      const res = await api.post('/admin/holidays', buildPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['holidays'] })
    },
  })
}

export function useUpdateHoliday() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateHolidayInput & { id: string }) => {
      const res = await api.put(`/admin/holidays/${id}`, buildPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['holidays'] })
    },
  })
}

export function useDeleteHoliday() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/holidays/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['holidays'] })
    },
  })
}
