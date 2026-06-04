import { z } from 'zod'

export const QuizSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  title: z.string(),
  heading: z.string(),
  description: z.string(),
  date: z.string(), // ISO Date string
  is_active: z.boolean(),
  embed_code: z.string().nullable(),
})

export type TQuizSchema = z.infer<typeof QuizSchema>
