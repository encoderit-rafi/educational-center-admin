import api from '@/lib/axios'
import {
  useQuery,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  MockTestsResponse,
  CreateMockTestInput,
} from '../-types'

export function useGetCourseOptions() {
  return useQuery({
    queryKey: ['courses', 'all'],
    queryFn: async (): Promise<Array<{ id: string; title: string | null; name: string | null; slug: string | null }>> => {
      const res = await api.get('/admin/courses', {
        params: { page: 1, limit: 100, sortBy: 'title', sortOrder: 'asc' },
      })
      return res.data.data?.data ?? []
    },
    staleTime: 15 * 60 * 1000,
  })
}

export interface MockTestListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
  keyword?: string
}

export function useGetMockTests(params?: MockTestListParams) {
  return queryOptions({
    queryKey: ['mock-tests', params],
    queryFn: async (): Promise<MockTestsResponse> => {
      const axiosParams: Record<string, unknown> = {
        page: params?.page,
        limit: params?.limit,
        sort_by: params?.sortBy,
        sort_order: params?.sortOrder,
      }
      if (params?.keyword) {
        axiosParams.filter = { keyword: params.keyword }
      }
      const res = await api.get('/admin/mock-tests', {
        params: axiosParams,
      })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildMockTestPayload(data: CreateMockTestInput) {
  const payload: Record<string, unknown> = {
    name: data.name,
    is_active: data.isActive ?? true,
  }
  if (data.courseId) payload.course_id = data.courseId
  if (data.type) payload.type = data.type
  if (data.price !== undefined) payload.price = Number(data.price)
  if (data.discountType) payload.discount_type = (data.discountType as string).toLowerCase()
  if (data.discountValue !== undefined)
    payload.discount_value = Number(data.discountValue)
  if (data.vatRate !== undefined) payload.vat_rate = Number(data.vatRate)
  if (data.description) payload.description = data.description
  if (data.details !== undefined) payload.details = data.details
  return payload
}

export function useCreateMockTest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateMockTestInput) => {
      const res = await api.post(
        '/admin/mock-tests',
        buildMockTestPayload(data),
      )
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['mock-tests'] })
    },
  })
}

export function useUpdateMockTest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateMockTestInput & { id: string }) => {
      const res = await api.put(
        `/admin/mock-tests/${id}`,
        buildMockTestPayload(data),
      )
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['mock-tests'] })
    },
  })
}

export function useDeleteMockTest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/mock-tests/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['mock-tests'] })
    },
  })
}

