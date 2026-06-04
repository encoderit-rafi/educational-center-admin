import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { ContactsResponse } from '../-types'

export interface ContactListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
  keyword?: string
}

export function useGetContacts(params?: ContactListParams) {
  return queryOptions({
    queryKey: ['contacts', params],
    queryFn: async (): Promise<ContactsResponse> => {
      const res = await api.get('/admin/contacts', {
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

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/admin/contacts/${id}/read`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useDeleteContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/contacts/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}
