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

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateEventInput) => {
      const payload = {
        ...data,
        event_type: data.event_type.toLowerCase(),
      }
      if (!payload.is_online || !payload.meeting_link) {
        delete payload.meeting_link
      }
      const res = await api.post('/admin/events', payload)
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
      const payload = {
        ...data,
        event_type: data.event_type.toLowerCase(),
      }
      if (!payload.is_online || !payload.meeting_link) {
        delete payload.meeting_link
      }
      const res = await api.put(`/admin/events/${id}`, payload)
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
