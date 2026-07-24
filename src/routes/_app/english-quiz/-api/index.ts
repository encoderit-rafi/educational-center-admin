import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { EnglishQuizSubmissionsResponse } from '../-types'

export interface ListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetSubmissions(params?: ListParams) {
  return queryOptions({
    queryKey: ['english-quiz-submissions', params],
    queryFn: async (): Promise<EnglishQuizSubmissionsResponse> => {
      const res = await api.get('/admin/english-quiz-submissions', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/english-quiz-submissions/delete/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['english-quiz-submissions'] })
    },
  })
}
