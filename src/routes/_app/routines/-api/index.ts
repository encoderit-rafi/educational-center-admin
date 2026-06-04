import api from '@/lib/axios'
import {
  useQuery,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { RoutinesResponse, CreateRoutineInput, UpdateRoutineInput } from '../-types'

export function useGetCourseOptions() {
  return useQuery({
    queryKey: ['courses', 'all'],
    queryFn: async (): Promise<Array<{ id: string; title: string | null; name: string | null }>> => {
      const res = await api.get('/admin/courses', {
        params: { page: 1, limit: 100, sortBy: 'title', sortOrder: 'asc' },
      })
      return res.data.data?.data ?? []
    },
    staleTime: 15 * 60 * 1000,
  })
}

export function useGetSubCourseOptions() {
  return useQuery({
    queryKey: ['sub-courses', 'all'],
    queryFn: async (): Promise<Array<{ id: string; title: string; name: string | null }>> => {
      const res = await api.get('/admin/sub-courses', {
        params: { page: 1, limit: 200, sortBy: 'title', sortOrder: 'asc' },
      })
      return res.data.data?.data ?? []
    },
    staleTime: 15 * 60 * 1000,
  })
}

export interface RoutineListParams {
  keyword?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export function useGetRoutines(params?: RoutineListParams) {
  return queryOptions({
    queryKey: ['routines', params],
    queryFn: async (): Promise<RoutinesResponse> => {
      const res = await api.get('/routines', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildPayload(data: CreateRoutineInput) {
  const payload: Record<string, unknown> = {
    title: data.title,
    day_of_week: data.dayOfWeek,
  }
  if (data.courseId) payload.course_id = data.courseId
  if (data.subCourseId) payload.sub_course_id = data.subCourseId
  if (data.instructorName) payload.instructor_name = data.instructorName
  if (data.startTime) payload.start_time = data.startTime
  if (data.endTime) payload.end_time = data.endTime
  if (data.location) payload.location = data.location
  if (data.isOnline !== undefined) payload.is_online = data.isOnline
  if (data.meetingLink) payload.meeting_link = data.meetingLink
  return payload
}

export function useCreateRoutine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateRoutineInput) => {
      const res = await api.post('/routines', buildPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['routines'] })
    },
  })
}

export function useUpdateRoutine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      title,
      instructorName,
      dayOfWeek,
    }: UpdateRoutineInput & { id: string }) => {
      const payload: Record<string, unknown> = {}
      if (title !== undefined) payload.title = title
      if (instructorName !== undefined) payload.instructor_name = instructorName
      if (dayOfWeek !== undefined) payload.day_of_week = dayOfWeek
      const res = await api.patch(`/routines/${id}`, payload)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['routines'] })
    },
  })
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/routines/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['routines'] })
    },
  })
}
