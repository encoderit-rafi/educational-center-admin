export interface CareerApplication {
  id: string
  firstName: string | null
  middleName: string | null
  lastName: string | null
  gender: string | null
  dob: string | null
  nationality: string | null
  email: string | null
  mobile: string | null
  address: string | null
  city: string | null
  pobox: string | null
  resume: string | null
  createdAt: string
  updatedAt: string
}

export interface CareerResponse {
  data: CareerApplication[]
  total: number
  page: number
  totalPages: number
}
