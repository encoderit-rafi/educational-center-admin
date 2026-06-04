export interface Holiday {
  id: string
  title: string
  description: string | null
  holidayType: 'PUBLIC' | 'NATIONAL' | 'RELIGIOUS' | 'CUSTOM'
  startDate: string
  endDate: string
  isRecurring: boolean
  country: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface HolidaysResponse {
  data: Holiday[]
  total: number
  page: number
  totalPages: number
}

export interface CreateHolidayInput {
  title: string
  description?: string
  holidayType: string
  startDate: string
  endDate: string
  isRecurring?: boolean
  country?: string
  isActive?: boolean
}
