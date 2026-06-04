import api from '@/lib/axios'
import {
  useQuery,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { CoursePackagesResponse, CreateCoursePackageInput } from '../-types'

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

export function useGetSubCourseOptions() {
  return useQuery({
    queryKey: ['sub-courses', 'all'],
    queryFn: async (): Promise<Array<{ id: string; title: string; name: string | null }>> => {
      const res = await api.get('/admin/sub-courses', {
        params: { page: 1, limit: 200, sortBy: 'title', sortOrder: 'asc' },
      })
      return res.data.data?.data ?? []
    },
    staleTime: 15 * 60 * 1000,
  })
}

export interface CoursePackageListParams {
  keyword?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetCoursePackages(params?: CoursePackageListParams) {
  return queryOptions({
    queryKey: ['course-packages', params],
    queryFn: async (): Promise<CoursePackagesResponse> => {
      const res = await api.get('/admin/course-packages', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function toNum(v: unknown): number | undefined {
  if (v === '' || v === null || v === undefined) return undefined
  const n = Number(v)
  return isNaN(n) ? undefined : n
}

function buildPayload(data: CreateCoursePackageInput) {
  const payload: Record<string, unknown> = {
    name: data.name,
    price: toNum(data.price),
    delivery_type: typeof data.deliveryType === 'string' ? data.deliveryType.toLowerCase() : data.deliveryType,
    is_active: data.isActive ?? true,
  }
  if (data.courseId) payload.course_id = data.courseId
  if (data.subCourseId) payload.sub_course_id = data.subCourseId
  if (data.description) payload.description = data.description
  if (data.discountType) payload.discount_type = (data.discountType as string).toLowerCase()
  const discountValue = toNum(data.discountValue)
  if (discountValue !== undefined) payload.discount_value = discountValue
  const vatRate = toNum(data.vatRate)
  if (vatRate !== undefined) payload.vat_rate = vatRate
  const duration = toNum(data.duration)
  if (duration !== undefined) payload.duration = duration
  const noOfDaysPerWeek = toNum(data.noOfDaysPerWeek)
  if (noOfDaysPerWeek !== undefined) payload.no_of_days_per_week = noOfDaysPerWeek
  const totalHours = toNum(data.totalHours)
  if (totalHours !== undefined) payload.total_hours = totalHours
  if (data.requirements) payload.requirements = data.requirements
  if (data.scheduleInfo) payload.schedule_info = data.scheduleInfo
  if (data.image) payload.image = data.image
  if (data.bestFor) payload.best_for = data.bestFor
  return payload
}

export function useCreateCoursePackage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateCoursePackageInput) => {
      const res = await api.post('/admin/course-packages', buildPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['course-packages'] })
    },
  })
}

export function useUpdateCoursePackage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateCoursePackageInput & { id: string }) => {
      const res = await api.put(`/admin/course-packages/${id}`, buildPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['course-packages'] })
    },
  })
}

export function useDeleteCoursePackage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/course-packages/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['course-packages'] })
    },
  })
}
