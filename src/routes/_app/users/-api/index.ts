import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { UsersResponse } from '../-types'

interface GetUsersParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
  keyword?: string
}

export function useGetUsers(params: GetUsersParams) {
  return {
    queryKey: ['users', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params.page) searchParams.set('page', String(params.page))
      if (params.limit) searchParams.set('limit', String(params.limit))
      if (params.sortBy) searchParams.set('sort_by', params.sortBy)
      if (params.sortOrder) searchParams.set('sort_order', params.sortOrder)
      if (params.keyword) searchParams.set('filter', JSON.stringify({ keyword: params.keyword }))
      const res = await api.get<{ success: boolean; data: UsersResponse }>(
        `/admin/auth/users?${searchParams.toString()}`,
      )
      return res.data.data
    },
  }
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await api.put(`/auth/users/${id}/role`, { role })
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
