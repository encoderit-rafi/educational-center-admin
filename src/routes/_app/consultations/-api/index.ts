import api from '@/lib/axios'
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ConsultationsResponse, Consultation } from '../-types'

export interface ConsultationListParams {
  keyword?: string
  firstName?: string
  lastName?: string
  email?: string
  country?: string
  courseId?: string
  examId?: string
  courseName?: string
  examName?: string
  createdAtFrom?: string
  createdAtTo?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetConsultations(params?: ConsultationListParams) {
  return queryOptions({
    queryKey: ['consultations', params],
    queryFn: async (): Promise<ConsultationsResponse> => {
      const res = await api.get('/admin/consultations', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useGetConsultation(id: string) {
  return queryOptions({
    queryKey: ['consultation', id],
    queryFn: async (): Promise<Consultation> => {
      const res = await api.get(`/admin/consultations/${id}`)
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

export function useUpdateConsultationStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.put(`/admin/consultations/${id}/status`, { status })
      return res.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] })
      queryClient.invalidateQueries({ queryKey: ['consultation', variables.id] })
    },
  })
}

export async function fetchConsultation(id: string) {
  const res = await api.get(`/admin/consultations/${id}`)
  return res.data
}

export async function updateConsultationStatus(id: string, status: string) {
  const res = await api.put(`/admin/consultations/${id}/status`, { status })
  return res.data
}

export async function deleteConsultation(id: string) {
  const res = await api.delete(`/admin/consultations/${id}`)
  return res.data
}

export function useDeleteConsultation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/consultations/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['consultation-slots'] })
    },
  })
}

