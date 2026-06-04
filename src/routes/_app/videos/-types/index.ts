export interface YoutubeVideo {
  id: string
  title: string | null
  youtubeUrl: string | null
  youtubeVideoId: string | null
  isActive: boolean | null
  createdAt: string
  updatedAt: string
}

export interface YoutubeVideosResponse {
  data: YoutubeVideo[]
  total: number
  page: number
  totalPages: number
}

export interface CreateVideoInput {
  title: string
  youtubeUrl: string
  youtubeVideoId?: string
  isActive?: boolean
}
