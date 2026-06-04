import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TiptapEditor } from '@/components/blocks/tiptap-editor'
import { DatePicker } from '@/components/blocks/date-picker'
import type { TQuizSchema } from '../-types'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

interface DemoSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mode: 'view' | 'edit' | 'create'
  quiz?: TQuizSchema | null
  onSubmit: (data: Partial<TQuizSchema>) => void
  onCancel: () => void
  onEdit: (quiz: TQuizSchema) => void
}

export function DemoSheet({
  isOpen,
  onOpenChange,
  mode,
  quiz,
  onSubmit,
  onCancel,
  onEdit,
}: DemoSheetProps) {
  const [formData, setFormData] = useState<Partial<TQuizSchema>>({
    name: '',
    title: '',
    heading: '',
    description: '',
    date: '',
    is_active: true,
    embed_code: '',
  })

  useEffect(() => {
    if (quiz) {
      setFormData({
        name: quiz.name,
        title: quiz.title,
        heading: quiz.heading,
        description: quiz.description,
        date: quiz.date,
        is_active: quiz.is_active,
        embed_code: quiz.embed_code || '',
      })
    } else {
      setFormData({
        name: '',
        title: '',
        heading: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        is_active: true,
        embed_code: '',
      })
    }
  }, [quiz])

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      date: date ? format(date, 'yyyy-MM-dd') : '',
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isViewMode = mode === 'view'
  const isEditMode = mode === 'edit'
  // const isCreateMode = mode === 'create';

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto dark:bg-card">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>
            {isViewMode
              ? 'Quiz Details'
              : isEditMode
                ? 'Edit Quiz'
                : 'Create Quiz'}
          </SheetTitle>
          <SheetDescription>
            {isViewMode
              ? 'Viewing details for the selected quiz.'
              : 'Enter the quiz information below.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Internal name"
                disabled={isViewMode}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Public title"
                disabled={isViewMode}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={formData.heading ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, heading: e.target.value })
                }
                placeholder="Public heading"
                disabled={isViewMode}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <DatePicker
                value={formData.date ? new Date(formData.date) : undefined}
                onChange={handleDateChange}
                disabled={isViewMode}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              {isViewMode ? (
                <div
                  className="p-3 border rounded-md bg-muted/30 min-h-[180px] prose prose-sm max-w-none prose-p:my-[1px] prose-h1:my-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-h5:my-0 prose-h6:my-0 prose-ul:my-0 prose-li:my-0 prose-ol:my-0 prose-blockquote:my-0 prose-pre:my-0 dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: formData.description || '',
                  }}
                />
              ) : (
                <TiptapEditor
                  value={formData.description || ''}
                  onChange={(val) =>
                    setFormData({ ...formData, description: val })
                  }
                />
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="embed_code">Embed Code</Label>
              <Textarea
                id="embed_code"
                value={formData.embed_code ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, embed_code: e.target.value })
                }
                placeholder="HTML embed snippet"
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            {isViewMode && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onEdit(quiz!)}
              >
                Edit Quiz
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onCancel}>
              Close
            </Button>
            {!isViewMode && (
              <Button type="submit">
                {isEditMode ? 'Update Quiz' : 'Create Quiz'}
              </Button>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
