import { useState } from 'react'
import {
  PageActions,
  PageBody,
  PageContainer,
  PageHeader,
  PageTitle,
} from '@/components/blocks/app-page'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DemoTable } from './-components/demo-table'
import { DemoSheet } from './-components/demo-sheet'
import { MOCK_QUIZZES } from './-data'
import type { TQuizSchema } from './-types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/demo/')({
  component: DemoPage,
})

function DemoPage() {
  const [quizzes, setQuizzes] = useState<TQuizSchema[]>(MOCK_QUIZZES)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetMode, setSheetMode] = useState<'view' | 'edit' | 'create'>('view')
  const [selectedQuiz, setSelectedQuiz] = useState<TQuizSchema | null>(null)

  const handleCreateNew = () => {
    setSelectedQuiz(null)
    setSheetMode('create')
    setIsSheetOpen(true)
  }

  const handleView = (quiz: TQuizSchema) => {
    setSelectedQuiz(quiz)
    setSheetMode('view')
    setIsSheetOpen(true)
  }

  const handleEdit = (quiz: TQuizSchema) => {
    setSelectedQuiz(quiz)
    setSheetMode('edit')
    setIsSheetOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter((q) => q.id !== id))
    }
  }

  const handleSubmit = (data: Partial<TQuizSchema>) => {
    if (selectedQuiz) {
      setQuizzes(
        quizzes.map((q) => (q.id === selectedQuiz.id ? { ...q, ...data } : q)),
      )
    } else {
      const newQuiz: TQuizSchema = {
        id: quizzes.length > 0 ? Math.max(...quizzes.map((q) => q.id)) + 1 : 1,
        uuid: crypto.randomUUID(),
        name: data.name || 'Untitled Quiz',
        title: data.title || 'Untitled',
        heading: data.heading || '',
        description: data.description || '',
        date: data.date || new Date().toISOString().split('T')[0],
        is_active: data.is_active ?? true,
        embed_code: data.embed_code || null,
      }
      setQuizzes([...quizzes, newQuiz])
    }
    setIsSheetOpen(false)
  }

  return (
    <PageContainer>
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <PageTitle>Demo Quizzes</PageTitle>
          <PageActions className="w-fit">
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Quiz
            </Button>
          </PageActions>
        </div>
      </PageHeader>
      <PageBody>
        <DemoTable
          quizzes={quizzes}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </PageBody>
      <DemoSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        mode={sheetMode}
        quiz={selectedQuiz}
        onSubmit={handleSubmit}
        onCancel={() => setIsSheetOpen(false)}
        onEdit={(quiz) => {
          setSheetMode('edit')
          setSelectedQuiz(quiz)
        }}
      />
    </PageContainer>
  )
}
