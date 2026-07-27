import api from '@/lib/axios'
import {
  useQuery,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  WorkshopsResponse,
  Workshop,
  CreateWorkshopInput,
  WorkshopBookingsResponse,
  WorkshopBooking,
  UpdateWorkshopBookingStatusInput,
  WorkshopPackagesResponse,
  CreateWorkshopPackageInput,
} from '../-types'

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

export interface WorkshopListParams {
  keyword?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetWorkshops(params?: WorkshopListParams) {
  return queryOptions({
    queryKey: ['workshops', params],
    queryFn: async (): Promise<WorkshopsResponse> => {
      const res = await api.get('/admin/workshops', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useGetWorkshop(idOrSlug: string) {
  return queryOptions({
    queryKey: ['workshop', idOrSlug],
    queryFn: async (): Promise<Workshop> => {
      try {
        const res = await api.get(`/workshops/${idOrSlug}`)
        return res.data.data
      } catch {
        const res = await api.get(`/admin/workshops/${idOrSlug}`)
        return res.data.data
      }
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildWorkshopPayload(data: CreateWorkshopInput) {
  const payload: Record<string, unknown> = {
    title: data.title,
    sub_title: data.sub_title,
    price: data.price,
    duration: data.duration,
  }

  if (data.course_id) payload.course_id = data.course_id
  if (data.name) payload.name = data.name
  if (data.short_description) payload.short_description = data.short_description
  if (data.logo) payload.logo = data.logo
  if (data.banner_image) payload.banner_image = data.banner_image
  if (data.description) payload.description = data.description
  if (data.is_active !== undefined) payload.is_active = data.is_active
  if (data.translations) payload.translations = data.translations

  return payload
}

export function useCreateWorkshop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateWorkshopInput) => {
      const res = await api.post('/admin/workshops', buildWorkshopPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workshops'] })
    },
  })
}

export function useUpdateWorkshop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateWorkshopInput & { id: string }) => {
      const payload = buildWorkshopPayload(data)
      const res = await api.put(`/admin/workshops/${id}`, payload)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workshops'] })
    },
  })
}

export function useDeleteWorkshop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/workshops/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workshops'] })
    },
  })
}

export interface WorkshopBookingListParams {
  keyword?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetWorkshopBookings(params?: WorkshopBookingListParams) {
  return queryOptions({
    queryKey: ['workshop-bookings', params],
    queryFn: async (): Promise<WorkshopBookingsResponse> => {
      const res = await api.get('/admin/workshop-bookings', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useGetWorkshopBooking(id: string) {
  return queryOptions({
    queryKey: ['workshop-booking', id],
    queryFn: async (): Promise<WorkshopBooking> => {
      const res = await api.get(`/admin/workshop-bookings/${id}`)
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useUpdateWorkshopBookingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: UpdateWorkshopBookingStatusInput & { id: string }) => {
      const res = await api.put(`/admin/workshop-bookings/${id}/status`, data)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workshop-bookings'] })
    },
  })
}

export function useDeleteWorkshopBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/workshop-bookings/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workshop-bookings'] })
    },
  })
}

export interface WorkshopPackageListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetWorkshopPackages(params?: WorkshopPackageListParams) {
  return queryOptions({
    queryKey: ['workshop-packages', params],
    queryFn: async (): Promise<WorkshopPackagesResponse> => {
      const res = await api.get('/admin/workshop-packages', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildWorkshopPackagePayload(data: CreateWorkshopPackageInput) {
  const payload: Record<string, unknown> = {
    duration: data.duration,
    price: data.price,
  }

  if (data.course_id) payload.course_id = data.course_id
  if (data.workshop_id) payload.workshop_id = data.workshop_id
  if (data.discount_type) payload.discount_type = data.discount_type.toLowerCase()
  if (data.discount_value !== undefined) payload.discount_value = data.discount_value
  if (data.vat_rate !== undefined) payload.vat_rate = data.vat_rate

  return payload
}

export function useCreateWorkshopPackage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateWorkshopPackageInput) => {
      const res = await api.post('/admin/workshop-packages', buildWorkshopPackagePayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workshop-packages'] })
    },
  })
}

export function useUpdateWorkshopPackage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateWorkshopPackageInput & { id: string }) => {
      const payload = buildWorkshopPackagePayload(data)
      const res = await api.put(`/admin/workshop-packages/${id}`, payload)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workshop-packages'] })
    },
  })
}

export function useDeleteWorkshopPackage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/workshop-packages/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workshop-packages'] })
    },
  })
}

export function useArrangeWorkshops() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (items: { id: string; order_index: number }[]) => {
      const res = await api.put('/admin/workshops/arrange-order', { items })
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workshops'] })
    },
  })
}
