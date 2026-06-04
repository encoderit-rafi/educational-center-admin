import api from '@/lib/axios'
import {
  useQuery,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { SubCoursesResponse, CreateSubCourseInput } from '../-types'
import type { Course } from '@/routes/_app/courses/-types'

export function useGetCourseOptions() {
  return useQuery({
    queryKey: ['courses', 'all'],
    queryFn: async (): Promise<Course[]> => {
      const res = await api.get('/admin/courses', {
        params: { page: 1, limit: 100, sortBy: 'title', sortOrder: 'asc' },
      })
      return res.data.data?.data ?? []
    },
    staleTime: 15 * 60 * 1000,
  })
}

export interface SubCourseListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
  keyword?: string
}

export function useGetSubCourses(params?: SubCourseListParams) {
  return queryOptions({
    queryKey: ['sub-courses', params],
    queryFn: async (): Promise<SubCoursesResponse> => {
      const filter: Record<string, unknown> = {}
      if (params?.keyword) filter.keyword = params.keyword
      const res = await api.get('/admin/sub-courses', {
        params: {
          page: params?.page,
          limit: params?.limit,
          sort_by: params?.sortBy,
          sort_order: params?.sortOrder,
          filter: Object.keys(filter).length > 0 ? filter : undefined,
        },
      })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildPayload(data: CreateSubCourseInput) {
  const payload: Record<string, unknown> = {
    title: data.title,
    sub_title: data.subTitle,
  }
  if (data.courseId) payload.course_id = data.courseId
  if (data.name) payload.name = data.name
  if (data.shortDescription) payload.short_description = data.shortDescription
  if (data.description) payload.description = data.description
  if (data.logo) payload.logo = data.logo
  if (data.bannerImage) payload.banner_image = data.bannerImage
  if (data.price !== undefined) payload.price = data.price
  if (data.discountType) payload.discount_type = data.discountType
  if (data.discountValue !== undefined) payload.discount_value = data.discountValue
  if (data.vatRate !== undefined) payload.vat_rate = data.vatRate
  payload.is_active = data.isActive ?? true
  return payload
}

export function useCreateSubCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateSubCourseInput) => {
      const res = await api.post('/admin/sub-courses', buildPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sub-courses'] })
    },
  })
}

export function useUpdateSubCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateSubCourseInput & { id: string }) => {
      const payload = buildPayload(data)
      const res = await api.put(`/admin/sub-courses/${id}`, payload)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sub-courses'] })
    },
  })
}

export function useDeleteSubCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/sub-courses/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sub-courses'] })
    },
  })
}
