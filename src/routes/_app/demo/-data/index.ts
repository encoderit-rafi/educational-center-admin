import type { TQuizSchema } from '../-types'

export const MOCK_QUIZZES: TQuizSchema[] = [
  {
    id: 1,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Beginner React Quiz',
    title: 'Are you a React Beginner?',
    heading: 'Test your fundamental knowledge of React components and hooks.',
    description: 'This quiz covers the basics of JSX, useState, and useEffect.',
    date: '2026-05-01',
    is_active: true,
    embed_code: '<div id="quiz-1"></div>',
  },
  {
    id: 2,
    uuid: '6ba7b810-e29b-41d4-a716-446655440001',
    name: 'Advanced TypeScript',
    title: 'Mastering TypeScript Generics',
    heading: 'Dive deep into type gymnastics and generic constraints.',
    description: 'A challenging quiz for experienced TS developers.',
    date: '2026-05-10',
    is_active: true,
    embed_code: null,
  },
  {
    id: 3,
    uuid: '7ca8c921-e29b-41d4-a716-446655440002',
    name: 'Tailwind CSS Layouts',
    title: 'Grid and Flexbox Mastery',
    heading: 'How well do you know modern CSS layouts?',
    description: 'Focuses on responsive design and utility-first patterns.',
    date: '2026-05-20',
    is_active: false,
    embed_code: '<div id="quiz-3"></div>',
  },
]

export const DEFAULT_QUIZ_DATA = {
  id: '',
  name: '',
  title: '',
  heading: '',
  cta_text: '',
  landing_page_text: '',
  description: '',
  logo: '',
  background_image: '',
  primary_color: '#3b82f6',
  secondary_color: '#8b5cf6',
  submit_button_text: 'Submit',
  result_button_text: 'See Results',
}

