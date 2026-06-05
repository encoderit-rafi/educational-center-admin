import api from '@/lib/axios'
import {
  useQuery,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

export function useGetExamTypes() {
  return useQuery({
    queryKey: ['exam-types'],
    queryFn: async (): Promise<Array<{ id: string | number; name: string }>> => {
      const res = await api.get('/exam-types')
      return res.data.data ?? res.data ?? []
    },
    staleTime: 30 * 60 * 1000,
  })
}
import type {
  ExamsResponse,
  CreateExamInput,
  TestSchedulesResponse,
  CreateTestScheduleInput,
} from '../-types'

export function useGetExamOptions() {
  return useQuery({
    queryKey: ['exams', 'all'],
    queryFn: async (): Promise<Array<{ id: string; name: string | null }>> => {
      const res = await api.get('/admin/exams', {
        params: { page: 1, limit: 1000, sortBy: 'name', sortOrder: 'asc' },
      })
      return res.data.data?.data ?? []
    },
    staleTime: 15 * 60 * 1000,
  })
}

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

export interface ListParams {
  keyword?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetExams(params?: ListParams) {
  return queryOptions({
    queryKey: ['exams', params],
    queryFn: async (): Promise<ExamsResponse> => {
      const res = await api.get('/admin/exams', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildExamPayload(data: CreateExamInput) {
  const payload: Record<string, unknown> = {
    course_id: data.course_id,
    name: data.name,
  }
  if (data.available_seats !== null) payload.available_seats = data.available_seats
  if (data.exam_fee !== null) payload.exam_fee = data.exam_fee
  if (data.additional_fee !== null) payload.additional_fee = data.additional_fee
  if (data.vat_rate !== null) payload.vat_rate = data.vat_rate
  if (data.total_fee !== null) payload.total_fee = data.total_fee
  if (data.description) payload.description = data.description
  if (data.exam_type) payload.exam_type = data.exam_type
  if (data.parent_id) payload.parent_id = data.parent_id
  if (data.exam_form_redirect_url) payload.exam_form_redirect_url = data.exam_form_redirect_url
  if (data.is_active !== undefined) payload.is_active = data.is_active
  return payload
}

export function useCreateExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateExamInput) => {
      const res = await api.post('/admin/exams', buildExamPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exams'] })
    },
  })
}

export function useUpdateExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: CreateExamInput & { id: string }) => {
      const res = await api.put(`/admin/exams/${id}`, buildExamPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exams'] })
    },
  })
}

export function useDeleteExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/exams/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exams'] })
    },
  })
}

export function useCreateExamFormField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await api.post('/admin/exam-form-fields', data)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exams'] })
    },
  })
}

export function useUpdateExamFormField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Record<string, unknown> & { id: string }) => {
      const res = await api.put(`/admin/exam-form-fields/${id}`, data)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exams'] })
    },
  })
}

export function useGetTestSchedules(params?: ListParams) {
  return queryOptions({
    queryKey: ['test-schedules', params],
    queryFn: async (): Promise<TestSchedulesResponse> => {
      const res = await api.get('/admin/test-schedules', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildSchedulePayload(data: CreateTestScheduleInput) {
  const payload: Record<string, unknown> = {}
  if (data.course_id) payload.course_id = data.course_id
  if (data.exam_id) payload.exam_id = data.exam_id
  if (data.month !== undefined) payload.month = data.month
  if (data.year !== undefined) payload.year = data.year
  if (data.start_date) payload.start_date = data.start_date
  if (data.end_date) payload.end_date = data.end_date
  if (data.is_visible !== undefined) payload.is_visible = data.is_visible
  return payload
}

export function useCreateTestSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateTestScheduleInput) => {
      const res = await api.post('/admin/exam-schedules', buildSchedulePayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['test-schedules'] })
    },
  })
}

export function useUpdateTestSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: CreateTestScheduleInput & { id: string }) => {
      const res = await api.put(`/admin/test-schedules/${id}`, buildSchedulePayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['test-schedules'] })
    },
  })
}

export function useDeleteTestSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/test-schedules/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['test-schedules'] })
    },
  })
}

export function useArrangeExams() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (items: { id: string; order_index: number }[]) => {
      const res = await api.put('/admin/exams/arrange-order', { items })
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exams'] })
    },
  })
}
