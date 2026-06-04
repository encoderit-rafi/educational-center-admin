export interface User {
  id: string
  email: string
  firstName: string
  middleName: string | null
  lastName: string | null
  phone: string | null
  country: string | null
  address: string | null
  role: string
  avatarUrl: string | null
  emailVerifiedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface UsersResponse {
  data: User[]
  total: number
  page: number
  totalPages: number
}
