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
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { useGetCourseOptions, useGetExamTypes, useGetExamOptions } from '../-api'
import type { Exam } from '../-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExamFormData {
  course_id: string
  exam_type: { id: string; name: string }[]
  name: string
  description: string
  available_seats: number | null
  exam_fee: number | null
  additional_fee: number | null
  vat_rate: number | null
  total_fee: number | null
  parent_id: string
  exam_form_redirect_url: string
  is_active: boolean
}

interface ExamFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  exam?: Exam | null
  onSave: (data: ExamFormData) => void
  isPending?: boolean
}

const emptyForm: ExamFormData = {
  course_id: '',
  exam_type: [],
  name: '',
  description: '',
  available_seats: null,
  exam_fee: null,
  additional_fee: null,
  vat_rate: null,
  total_fee: null,
  parent_id: '',
  exam_form_redirect_url: '',
  is_active: true,
}

function CourseSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const { data: courses = [] } = useGetCourseOptions()

  return (
    <div className="grid gap-2">
      <Label>
        Course <span className="text-destructive">*</span>
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a course..." />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.title ?? course.name}
            </SelectItem>
          ))}
          {courses.length === 0 && (
            <SelectItem value="__none__" disabled>
              No courses available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

function ExamTypeMultiSelect({
  value,
  onChange,
}: {
  value: { id: string; name: string }[]
  onChange: (value: { id: string; name: string }[]) => void
}) {
  const { data: examTypes = [] } = useGetExamTypes()
  const [open, setOpen] = useState(false)

  const toggle = (type: { id: string; name: string }) => {
    const already = value.some((v) => v.id === type.id)
    onChange(already ? value.filter((v) => v.id !== type.id) : [...value, type])
  }

  const label = value.length === 0
    ? 'Select exam types...'
    : value.map((v) => v.name).join(', ')

  return (
    <div className="grid gap-2">
      <Label>
        Exam Type <span className="text-destructive">*</span>
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
              value.length === 0 && 'text-muted-foreground',
            )}
          >
            <span className="truncate">{label}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-1" align="start">
          {examTypes.length === 0 ? (
            <p className="px-2 py-3 text-center text-sm text-muted-foreground">No exam types available</p>
          ) : (
            examTypes.map((type) => {
              const id = String(type.id)
              const checked = value.some((v) => v.id === id)
              return (
                <button
                  key={id}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm capitalize hover:bg-accent hover:text-accent-foreground"
                  onClick={() => toggle({ id, name: type.name })}
                >
                  <Check className={cn('h-4 w-4', checked ? 'opacity-100' : 'opacity-0')} />
                  {type.name}
                </button>
              )
            })
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

function ParentExamSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const { data: exams = [] } = useGetExamOptions()

  return (
    <div className="grid gap-2">
      <Label htmlFor="parent_id">Parent Exam</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a parent exam..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">None</SelectItem>
          {exams.map((exam) => (
            <SelectItem key={exam.id} value={exam.id}>
              {exam.name}
            </SelectItem>
          ))}
          {exams.length === 0 && (
            <SelectItem value="__none__" disabled>
              No exams available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

export function ExamFormDialog({
  isOpen,
  onOpenChange,
  exam,
  onSave,
  isPending,
}: ExamFormDialogProps) {
  const [form, setForm] = useState<ExamFormData>(emptyForm)

  useEffect(() => {
    if (exam) {
      setForm({
        course_id: exam.courseId ?? '',
        exam_type: Array.isArray(exam.examType)
          ? (exam.examType as { id: string; name: string }[]).map((t) => ({
            id: String(t.id),
            name: t.name,
          }))
          : [],
        name: exam.name ?? '',
        description: exam.description ?? '',
        available_seats: exam.availableSeats,
        exam_fee: exam.examFee ? Number(exam.examFee) : null,
        additional_fee: exam.additionalFee ? Number(exam.additionalFee) : null,
        vat_rate: exam.vatRate ? Number(exam.vatRate) : null,
        total_fee: exam.totalFee ? Number(exam.totalFee) : null,
        parent_id: exam.parentId ?? '',
        exam_form_redirect_url: exam.examFormRedirectUrl ?? '',
        is_active: exam.isActive ?? true,
      })
    } else {
      setForm(emptyForm)
    }
  }, [exam, isOpen])

  const isEditing = !!exam
  const isValid = form.course_id.trim() && form.name.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  const totalFee = (form.exam_fee ?? 0) + (form.additional_fee ?? 0) + (form.vat_rate ?? 0)

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>{isEditing ? 'Edit Exam' : 'Create Exam'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the exam details.'
              : 'Enter the details for the new exam.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          <CourseSelect
            value={form.course_id}
            onChange={(v) => setForm((prev) => ({ ...prev, course_id: v }))}
          />

          <div className='grid gap-4 md:grid-cols-2'>
            <ExamTypeMultiSelect
              value={form.exam_type}
              onChange={(v) => setForm((prev) => ({ ...prev, exam_type: v }))}
            />


            <ParentExamSelect
              value={form.parent_id}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  parent_id: v === '__none__' ? '' : v,
                }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Exam name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Exam description"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="available_seats">Available Seats</Label>
            <Input
              id="available_seats"
              type="number"
              value={form.available_seats ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  available_seats: e.target.value
                    ? Number(e.target.value)
                    : null,
                }))
              }
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="exam_fee">Exam Fee</Label>
              <Input
                id="exam_fee"
                type="number"
                step="0.01"
                value={form.exam_fee ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    exam_fee: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="additional_fee">Additional Fee</Label>
              <Input
                id="additional_fee"
                type="number"
                step="0.01"
                value={form.additional_fee ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    additional_fee: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="vat_rate">VAT Rate (%)</Label>
              <Input
                id="vat_rate"
                type="number"
                step="0.01"
                value={form.vat_rate ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    vat_rate: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="total_fee">Total Fee <span className="text-xs text-muted-foreground">
                Calculated: ${form.exam_fee ?? 0} + ${form.additional_fee ?? 0}{' '}
                + ${form.vat_rate ?? 0} = ${totalFee}
              </span></Label>
              <Input
                id="total_fee"
                type="number"
                step="0.01"
                value={form.total_fee ?? totalFee}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    total_fee: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exam_form_redirect_url">Form Redirect URL</Label>
            <Input
              id="exam_form_redirect_url"
              value={form.exam_form_redirect_url}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, exam_form_redirect_url: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="is_active"
              checked={form.is_active}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  is_active: checked === true,
                }))
              }
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Active
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

export type { ExamFormData }
