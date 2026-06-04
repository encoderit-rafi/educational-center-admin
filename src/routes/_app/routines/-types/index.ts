export interface Routine {
  id: string
  courseId: string | null
  subCourseId: string | null
  title: string | null
  instructorName: string | null
  dayOfWeek: string | null
  startTime: string | null
  endTime: string | null
  location: string | null
  isOnline: boolean | null
  meetingLink: string | null
  isActive: boolean | null
  effectiveFrom: string | null
  effectiveTo: string | null
  createdAt: string
  updatedAt: string
}

export interface RoutinesResponse {
  data: Routine[]
  total: number
  page: number
  totalPages: number
}

export interface CreateRoutineInput {
  title: string
  courseId?: string
  subCourseId?: string
  instructorName?: string
  dayOfWeek: string
  startTime?: string
  endTime?: string
  location?: string
  isOnline?: boolean
  meetingLink?: string
  isActive?: boolean
}

export interface UpdateRoutineInput {
  title?: string
  instructorName?: string
  dayOfWeek?: string
}
