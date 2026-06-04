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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import type { ExamFormField } from '../-types'

interface FormFieldData {
  course_id: string
  exam_id: string
  field_key: string
  field_label: string
  field_type: string
  options: string
  is_required: boolean
  validation_rules: string
  order_index: number | null
  placeholder: string
  help_text: string
  is_active: boolean
}

interface ExamFormFieldFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  field?: ExamFormField | null
  onSave: (data: FormFieldData) => void
  isPending?: boolean
}

const emptyForm: FormFieldData = {
  course_id: '',
  exam_id: '',
  field_key: '',
  field_label: '',
  field_type: '',
  options: '',
  is_required: false,
  validation_rules: '',
  order_index: null,
  placeholder: '',
  help_text: '',
  is_active: true,
}

export function ExamFormFieldFormDialog({
  isOpen,
  onOpenChange,
  field,
  onSave,
  isPending,
}: ExamFormFieldFormDialogProps) {
  const [form, setForm] = useState<FormFieldData>(emptyForm)

  useEffect(() => {
    if (field) {
      setForm({
        course_id: field.courseId ?? '',
        exam_id: field.examId ?? '',
        field_key: field.fieldKey ?? '',
        field_label: field.fieldLabel ?? '',
        field_type: field.fieldType ?? '',
        options: field.options ? JSON.stringify(field.options) : '',
        is_required: field.isRequired ?? false,
        validation_rules: field.validationRules
          ? JSON.stringify(field.validationRules)
          : '',
        order_index: field.orderIndex,
        placeholder: field.placeholder ?? '',
        help_text: field.helpText ?? '',
        is_active: field.isActive ?? true,
      })
    } else {
      setForm(emptyForm)
    }
  }, [field, isOpen])

  const isEditing = !!field
  const isValid =
    form.field_key.trim() && form.field_label.trim() && form.field_type

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
            {isEditing ? 'Edit Form Field' : 'Create Form Field'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the form field details.'
              : 'Enter the details for the new form field.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="field_key">
                Field Key <span className="text-destructive">*</span>
              </Label>
              <Input
                id="field_key"
                value={form.field_key}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, field_key: e.target.value }))
                }
                placeholder="e.g., full_name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="field_label">
                Field Label <span className="text-destructive">*</span>
              </Label>
              <Input
                id="field_label"
                value={form.field_label}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, field_label: e.target.value }))
                }
                placeholder="e.g., Full Name"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="field_type">
              Field Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.field_type}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, field_type: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Text</SelectItem>
                <SelectItem value="TEXTAREA">Textarea</SelectItem>
                <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                <SelectItem value="NUMBER">Number</SelectItem>
                <SelectItem value="DATE">Date</SelectItem>
                <SelectItem value="FILE_UPLOAD">File Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="options">Options (JSON)</Label>
            <Input
              id="options"
              value={form.options}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, options: e.target.value }))
              }
              placeholder='["Option 1", "Option 2"]'
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={form.placeholder}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, placeholder: e.target.value }))
                }
                placeholder="Placeholder text"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order_index">Order Index</Label>
              <Input
                id="order_index"
                type="number"
                value={form.order_index ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    order_index: e.target.value
                      ? Number(e.target.value)
                      : null,
                  }))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="help_text">Help Text</Label>
            <Input
              id="help_text"
              value={form.help_text}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, help_text: e.target.value }))
              }
              placeholder="Help text for this field"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="validation_rules">Validation Rules (JSON)</Label>
            <Input
              id="validation_rules"
              value={form.validation_rules}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  validation_rules: e.target.value,
                }))
              }
              placeholder='{"required": true, "minLength": 3}'
            />
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

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_required"
                checked={form.is_required}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    is_required: checked === true,
                  }))
                }
              />
              <Label htmlFor="is_required" className="cursor-pointer">
                Required
              </Label>
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

export type { FormFieldData }
