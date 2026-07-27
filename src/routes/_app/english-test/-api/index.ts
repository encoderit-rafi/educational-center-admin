import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  EnglishTestAttemptsResponse,
  EnglishTestAttemptDetailResponse,
  EnglishLevelDefinitionsResponse,
  CreateLevelDefinitionInput,
} from '../-types'

export interface ListParams {
  keyword?: string
  search?: string
  level?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetAttempts(params?: ListParams) {
  return queryOptions({
    queryKey: ['english-test-attempts', params],
    queryFn: async (): Promise<EnglishTestAttemptsResponse> => {
      const res = await api.get('/admin/english-test', { params })
      const resData = res.data

      const page = params?.page ?? 1
      const limit = params?.limit ?? 10

      // Standard API envelope with nested pagination object: { success: true, message: '...', data: { data: [...], total, page, totalPages } }
      if (resData?.data && typeof resData.data === 'object' && !Array.isArray(resData.data)) {
        const inner = resData.data
        const items = Array.isArray(inner.data) ? inner.data : []
        const total = typeof inner.total === 'number' ? inner.total : items.length
        const totalPages = typeof inner.totalPages === 'number' && inner.totalPages > 0
          ? inner.totalPages
          : Math.max(1, Math.ceil(total / limit))
        return {
          data: items,
          total,
          page: typeof inner.page === 'number' ? inner.page : page,
          totalPages,
        }
      }

      // Direct pagination response: { data: [...], total, page, totalPages }
      if (resData && typeof resData === 'object' && Array.isArray(resData.data) && (typeof resData.total === 'number' || typeof resData.totalPages === 'number')) {
        const total = typeof resData.total === 'number' ? resData.total : resData.data.length
        const totalPages = typeof resData.totalPages === 'number' && resData.totalPages > 0
          ? resData.totalPages
          : Math.max(1, Math.ceil(total / limit))
        return {
          data: resData.data,
          total,
          page: typeof resData.page === 'number' ? resData.page : page,
          totalPages,
        }
      }

      // Flat array response: { data: [...] } or direct array [...]
      const rawList = Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(resData)
        ? resData
        : []

      const total = rawList.length
      const totalPages = Math.max(1, Math.ceil(total / limit))
      const slicedData = rawList.length > limit ? rawList.slice((page - 1) * limit, page * limit) : rawList

      return {
        data: slicedData,
        total,
        page,
        totalPages,
      }
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useGetAttemptDetail(attemptId: string) {
  return queryOptions({
    queryKey: ['english-test-attempt', attemptId],
    queryFn: async (): Promise<EnglishTestAttemptDetailResponse> => {
      try {
        const res = await api.get(`/admin/english-test/${attemptId}`)
        return res.data?.data ?? res.data
      } catch {
        const res = await api.get(`/english-test/${attemptId}`)
        return res.data?.data ?? res.data
      }
    },
  })
}

export function useDeleteAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (attemptId: string) => {
      const res = await api.delete(`/admin/english-test/delete/${attemptId}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['english-test-attempts'] })
    },
  })
}

export function useGetLevelDefinitions(params?: ListParams) {
  return queryOptions({
    queryKey: ['english-test-levels', params],
    queryFn: async (): Promise<EnglishLevelDefinitionsResponse> => {
      const res = await api.get('/admin/english-test/level-definitions', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildLevelPayload(data: CreateLevelDefinitionInput) {
  const payload: Record<string, unknown> = {
    level_code: data.level_code,
    label: data.label,
    min_score: data.min_score,
    max_score: data.max_score,
  }
  if (data.description) payload.description = data.description
  if (data.is_active !== undefined) payload.is_active = data.is_active
  return payload
}

export function useCreateLevelDefinition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateLevelDefinitionInput) => {
      const res = await api.post('/admin/english-test/level-definitions', buildLevelPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['english-test-levels'] })
    },
  })
}

export function useUpdateLevelDefinition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: CreateLevelDefinitionInput & { id: string }) => {
      const res = await api.put(`/admin/english-test/level-definitions/${id}`, buildLevelPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['english-test-levels'] })
    },
  })
}

export function useDeleteLevelDefinition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/english-test/level-definitions/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['english-test-levels'] })
    },
  })
}
