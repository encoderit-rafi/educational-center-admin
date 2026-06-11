export interface Exam {
  id: string
  courseId: string | null
  name: string | null
  slug: string | null
  description: string | null
  availableSeats: number | null
  registrationDate: string | null
  examDate: string | null
  examStartTime: string | null
  examEndTime: string | null
  examFee: string | null
  usdExamFee: string | null
  additionalFee: string | null
  vatRate: string | null
  totalFee: string | null
  examType: unknown | null
  parentId: string | null
  examFormRedirectUrl: string | null
  isActive: boolean | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ExamsResponse {
  data: Exam[]
  total: number
  page: number
  totalPages: number
}

export interface CreateExamInput {
  course_id: string
  exam_type?: Array<{ id: string; name: string }>
  name: string
  description?: string
  available_seats: number
  exam_fee: number
  usd_exam_fee?: number | null
  additional_fee: number
  vat_rate: number
  total_fee: number
  parent_id?: string
  exam_form_redirect_url?: string
  is_active?: boolean
}

export interface ExamFormField {
  id: string
  courseId: string | null
  examId: string | null
  fieldKey: string | null
  fieldLabel: string | null
  fieldType: string | null
  options: unknown | null
  isRequired: boolean | null
  validationRules: unknown | null
  orderIndex: number | null
  placeholder: string | null
  helpText: string | null
  isActive: boolean | null
  createdAt: string
  updatedAt: string
}

export interface CreateExamFormFieldInput {
  course_id?: string
  exam_id?: string
  field_key: string
  field_label: string
  field_type: string
  options?: string
  is_required?: boolean
  validation_rules?: string
  order_index?: number
  placeholder?: string
  help_text?: string
  is_active?: boolean
}

export interface TestSchedule {
  id: string
  courseId: string | null
  examId: string | null
  month: number | null
  year: number | null
  startDate: string | null
  endDate: string | null
  isVisible: boolean | null
  createdAt: string
  updatedAt: string
}

export interface TestSchedulesResponse {
  data: TestSchedule[]
  total: number
  page: number
  totalPages: number
}

export interface CreateTestScheduleInput {
  course_id?: string
  exam_id?: string
  month?: number
  year?: number
  start_date?: string
  end_date?: string
  is_visible?: boolean
}
