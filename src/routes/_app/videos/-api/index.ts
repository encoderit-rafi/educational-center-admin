import api from '@/lib/axios'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { YoutubeVideosResponse, CreateVideoInput } from '../-types'

export interface VideoListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
  keyword?: string
}

export function useGetVideos(params?: VideoListParams) {
  return queryOptions({
    queryKey: ['videos', params],
    queryFn: async (): Promise<YoutubeVideosResponse> => {
      const res = await api.get('/admin/videos', { params })
      return res.data.data
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}

function buildPayload(data: CreateVideoInput) {
  const payload: Record<string, unknown> = {
    title: data.title,
    youtube_url: data.youtubeUrl,
  }

  if (data.youtubeVideoId) payload.youtube_video_id = data.youtubeVideoId
  if (data.isActive !== undefined) payload.is_active = data.isActive

  return payload
}

export function useCreateVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateVideoInput) => {
      const res = await api.post('/admin/videos', buildPayload(data))
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}

export function useUpdateVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateVideoInput & { id: string }) => {
      const payload = buildPayload(data)
      const res = await api.put(`/admin/videos/${id}`, payload)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}

export function useDeleteVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/videos/${id}`)
      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}
