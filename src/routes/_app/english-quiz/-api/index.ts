import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { EnglishQuizSubmission, EnglishQuizSubmissionsResponse } from '../-types'

export interface ListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
  search?: string
}

export function useGetSubmissions(params?: ListParams) {
  return queryOptions({
    queryKey: ['english-quiz-submissions', params],
    queryFn: async (): Promise<EnglishQuizSubmissionsResponse> => {
      const res = await api.get('/admin/english-quiz-submissions', { params })
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
      const rawList: EnglishQuizSubmission[] = Array.isArray(resData?.data)
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

export function useGetSubmissionDetail(id: string) {
  return queryOptions({
    queryKey: ['english-quiz-submission', id],
    queryFn: async (): Promise<EnglishQuizSubmission> => {
      const res = await api.get(`/admin/english-quiz-submissions/${id}`)
      const resData = res.data
      return resData?.data ?? resData
    },
  })
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/english-quiz-submissions/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['english-quiz-submissions'] })
    },
  })
}
