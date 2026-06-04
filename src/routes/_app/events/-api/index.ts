import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { EventsResponse, EventBookingsResponse, EventBooking, CreateEventInput } from '../-types'

export interface EventListParams {
  keyword?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetEvents(params?: EventListParams) {
  return queryOptions({
    queryKey: ['events', params],
    queryFn: async (): Promise<EventsResponse> => {
      const res = await api.get('/admin/events', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildEventPayload(data: CreateEventInput) {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('event_type', data.event_type)
  formData.append('start_date', data.start_date)
  formData.append('end_date', data.end_date)
  formData.append('price', String(data.price))

  if (data.description) formData.append('description', data.description)
  if (data.location) formData.append('location', data.location)
  if (data.is_online !== undefined) formData.append('is_online', String(data.is_online))
  if (data.meeting_link) formData.append('meeting_link', data.meeting_link)
  if (data.start_time) formData.append('start_time', data.start_time)
  if (data.end_time) formData.append('end_time', data.end_time)
  if (data.total_seats !== undefined) formData.append('total_seats', String(data.total_seats))
  if (data.vat_rate !== undefined) formData.append('vat_rate', String(data.vat_rate))
  if (data.is_active !== undefined) formData.append('is_active', String(data.is_active))
  if (data.banner) formData.append('banner', data.banner)

  return formData
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateEventInput) => {
      const payload = buildEventPayload(data)
      const res = await api.post('/admin/events', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: CreateEventInput & { id: string }) => {
      const payload = buildEventPayload(data)
      const res = await api.put(`/admin/events/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/events/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useGetEventBookings(params?: EventListParams) {
  return queryOptions({
    queryKey: ['event-bookings', params],
    queryFn: async (): Promise<EventBookingsResponse> => {
      const res = await api.get('/admin/event-bookings', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useGetEventBooking(id: string) {
  return queryOptions({
    queryKey: ['event-booking', id],
    queryFn: async (): Promise<EventBooking> => {
      const res = await api.get(`/admin/event-bookings/${id}`)
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useMarkAttended() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/admin/event-bookings/${id}/attended`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['event-bookings'] })
    },
  })
}

export function useDeleteEventBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/event-bookings/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['event-bookings'] })
    },
  })
}
