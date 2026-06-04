import { z } from 'zod'

export const FormQuizSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().min(1, { message: 'Title is required' }),
  name: z.string().min(1, { message: 'Quiz name is required' }),
  heading: z.string().min(1, { message: 'Heading is required' }),
  cta_text: z.string().min(1, { message: 'CTA text is required' }),
  landing_page_text: z.string().min(1, { message: 'Landing page text is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  logo: z.union([z.string(), z.object({}), z.null()]),
  background_image: z.union([z.string(), z.object({}), z.null()]),
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Invalid color format. Use hex color (e.g., #FF5733)',
  }),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Invalid color format. Use hex color (e.g., #FF5733)',
  }),
  submit_button_text: z.string().min(1, { message: 'Submit button text is required' }),
  result_button_text: z.string().min(1, { message: 'Result button text is required' }),
})

export type TFormQuizSchema = z.infer<typeof FormQuizSchema>

