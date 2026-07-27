import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { CareerResponse, CareerApplication } from '../-types'

export interface CareerListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
  keyword?: string
}

export function useGetCareers(params?: CareerListParams) {
  return queryOptions({
    queryKey: ['career', params],
    queryFn: async (): Promise<CareerResponse> => {
      const res = await api.get('/admin/career', {
        params: {
          ...params,
          filter: params?.keyword ? { keyword: params.keyword } : undefined,
        },
      })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useGetCareer(id: string) {
  return queryOptions({
    queryKey: ['career', id],
    queryFn: async (): Promise<CareerApplication> => {
      const res = await api.get(`/admin/career/${id}`)
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useDeleteCareer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/career/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['career'] })
    },
  })
}
