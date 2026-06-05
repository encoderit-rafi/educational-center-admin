import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  CoursesResponse,
  Course,
  CreateCourseInput,
  CourseBookingsResponse,
  CourseBooking,
  UpdateCourseBookingStatusInput,
} from '../-types'

export interface CourseListParams {
  keyword?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetCourses(params?: CourseListParams) {
  return queryOptions({
    queryKey: ['courses', params],
    queryFn: async (): Promise<CoursesResponse> => {
      const res = await api.get('/admin/courses', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useGetCourse(id: string) {
  return queryOptions({
    queryKey: ['course', id],
    queryFn: async (): Promise<Course> => {
      const res = await api.get(`/admin/courses/${id}`)
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildCoursePayload(data: CreateCourseInput) {
  const payload: Record<string, unknown> = {
    title: data.title,
    sub_title: data.sub_title,
  }

  if (data.short_description) payload.short_description = data.short_description
  if (data.description) payload.description = data.description
  if (data.test_date_content) payload.test_date_content = data.test_date_content
  if (data.test_registration_content) payload.test_registration_content = data.test_registration_content
  if (data.website_url) payload.website_url = data.website_url
  if (data.logo) payload.logo = data.logo
  if (data.banner_image) payload.banner_image = data.banner_image
  if (data.key_benefits?.length) payload.key_benefits = data.key_benefits
  if (data.focus_area?.length) payload.focus_area = data.focus_area
  if (data.is_active !== undefined) payload.is_active = data.is_active

  return payload
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateCourseInput) => {
      const res = await api.post('/admin/courses', buildCoursePayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateCourseInput & { id: string }) => {
      const payload = buildCoursePayload(data)
      const res = await api.put(`/admin/courses/${id}`, payload)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/courses/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export interface CourseBookingListParams {
  keyword?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetCourseBookings(params?: CourseBookingListParams) {
  return queryOptions({
    queryKey: ['course-bookings', params],
    queryFn: async (): Promise<CourseBookingsResponse> => {
      const res = await api.get('/admin/course-bookings', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useGetCourseBooking(id: string) {
  return queryOptions({
    queryKey: ['course-booking', id],
    queryFn: async (): Promise<CourseBooking> => {
      const res = await api.get(`/admin/course-bookings/${id}`)
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useUpdateCourseBookingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: UpdateCourseBookingStatusInput & { id: string }) => {
      const res = await api.put(`/admin/course-bookings/${id}/status`, data)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['course-bookings'] })
    },
  })
}

export function useDeleteCourseBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/course-bookings/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['course-bookings'] })
    },
  })
}

export function useArrangeCourses() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (items: { id: string; order_index: number }[]) => {
      const res = await api.put('/admin/courses/arrange-order', { items })
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
