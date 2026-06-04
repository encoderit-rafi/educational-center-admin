import api from '@/lib/axios'
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

export function useGetQuiz(id: string | number) {
  return queryOptions({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const res = await api.get(`/admin/quizzes/${id}`)
      return res.data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateQuiz() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/admin/quizzes', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] })
    },
  })
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/admin/quizzes/${data.id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] })
    },
  })
}
