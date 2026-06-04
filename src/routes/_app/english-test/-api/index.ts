import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  EnglishTestAttemptsResponse,
  EnglishLevelDefinitionsResponse,
  CreateLevelDefinitionInput,
} from '../-types'

export interface ListParams {
  keyword?: string
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
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
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
