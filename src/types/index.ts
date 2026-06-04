import { z } from 'zod'
import type { LucideIcon } from 'lucide-react'

export type TFormType = 'create' | 'update'

export const TFileSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  url: z.string().optional(),
  type: z.string().optional(),
  size: z.number().optional(),
})

export type TFileSchemaType = z.infer<typeof TFileSchema>

export interface TRoute {
  name: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  isVisible?: boolean
  children?: TRoute[]
  [key: string]: unknown
}
