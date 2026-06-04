import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import type { TestSchedule } from '../-types'

interface ScheduleFormData {
  course_id: string
  exam_id: string
  month: number | null
  year: number | null
  start_date: string
  end_date: string
  is_visible: boolean
}

interface ExamTestScheduleFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  schedule?: TestSchedule | null
  onSave: (data: ScheduleFormData) => void
  isPending?: boolean
}

const emptyForm: ScheduleFormData = {
  course_id: '',
  exam_id: '',
  month: null,
  year: null,
  start_date: '',
  end_date: '',
  is_visible: true,
}

export function ExamTestScheduleFormDialog({
  isOpen,
  onOpenChange,
  schedule,
  onSave,
  isPending,
}: ExamTestScheduleFormDialogProps) {
  const [form, setForm] = useState<ScheduleFormData>(emptyForm)

  useEffect(() => {
    if (schedule) {
      setForm({
        course_id: schedule.courseId ?? '',
        exam_id: schedule.examId ?? '',
        month: schedule.month,
        year: schedule.year,
        start_date: schedule.startDate
          ? format(new Date(schedule.startDate), 'yyyy-MM-dd')
          : '',
        end_date: schedule.endDate
          ? format(new Date(schedule.endDate), 'yyyy-MM-dd')
          : '',
        is_visible: schedule.isVisible ?? true,
      })
    } else {
      setForm(emptyForm)
    }
  }, [schedule, isOpen])

  const isEditing = !!schedule
  const isValid = form.month !== null && form.year !== null && form.start_date && form.end_date

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>
            {isEditing ? 'Edit Test Schedule' : 'Create Test Schedule'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the test schedule details.'
              : 'Enter the details for the new test schedule.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="month">
                Month <span className="text-destructive">*</span>
              </Label>
              <Input
                id="month"
                type="number"
                min={1}
                max={12}
                value={form.month ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    month: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="1-12"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">
                Year <span className="text-destructive">*</span>
              </Label>
              <Input
                id="year"
                type="number"
                value={form.year ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    year: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="2026"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start_date">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="start_date"
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, start_date: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">
                End Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="end_date"
                type="date"
                value={form.end_date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, end_date: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="course_id">Course ID</Label>
              <Input
                id="course_id"
                value={form.course_id}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, course_id: e.target.value }))
                }
                placeholder="Course ID"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam_id">Exam ID</Label>
              <Input
                id="exam_id"
                value={form.exam_id}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, exam_id: e.target.value }))
                }
                placeholder="Exam ID"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="is_visible"
              checked={form.is_visible}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  is_visible: checked === true,
                }))
              }
            />
            <Label htmlFor="is_visible" className="cursor-pointer">
              Visible
            </Label>
          </div>

          <SheetFooter className="p-0 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export type { ScheduleFormData }
