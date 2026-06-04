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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUpload } from '@/components/blocks/file-upload'
import { Loader2 } from 'lucide-react'
import { useGetCourseOptions } from '../-api'
import type { Workshop } from '../-types'

export interface WorkshopFormData {
  title: string
  sub_title: string
  course_id: string
  name: string
  short_description: string
  description: string
  logo: string
  banner_image: string
  price: number
  duration: number
  discount_type: string
  discount_value: number
  vat_rate: number
  start_time: string
  end_time: string
  is_active: boolean
}

interface WorkshopFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  workshop?: Workshop | null
  onSave: (data: WorkshopFormData) => void
  isPending?: boolean
}

const emptyForm: WorkshopFormData = {
  title: '',
  sub_title: '',
  course_id: '',
  name: '',
  short_description: '',
  description: '',
  logo: '',
  banner_image: '',
  price: 0,
  duration: 0,
  discount_type: '',
  discount_value: 0,
  vat_rate: 0,
  start_time: '',
  end_time: '',
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
      <Label>Course</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
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

export function WorkshopFormDialog({
  isOpen,
  onOpenChange,
  workshop,
  onSave,
  isPending,
}: WorkshopFormDialogProps) {
  const [form, setForm] = useState<WorkshopFormData>(emptyForm)

  useEffect(() => {
    if (workshop) {
      setForm({
        title: workshop.title ?? '',
        sub_title: workshop.subTitle ?? '',
        course_id: workshop.courseId ?? '',
        name: workshop.name ?? '',
        short_description: workshop.shortDescription ?? '',
        description: workshop.description ?? '',
        logo: workshop.logo ?? '',
        banner_image: workshop.bannerImage ?? '',
        price: workshop.price ?? 0,
        duration: workshop.duration ?? 0,
        discount_type: workshop.discountType ?? '',
        discount_value: workshop.discountValue ?? 0,
        vat_rate: workshop.vatRate ?? 0,
        start_time: workshop.startTime ?? '',
        end_time: workshop.endTime ?? '',
        is_active: workshop.isActive,
      })
    } else {
      setForm(emptyForm)
    }
  }, [workshop, isOpen])

  const isEditing = !!workshop
  const isValid = form.title.trim() && form.sub_title.trim() && form.price > 0 && form.duration > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>{isEditing ? 'Edit Workshop' : 'Create Workshop'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the workshop details.'
              : 'Enter the details for the new workshop.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          <div className="grid gap-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Workshop title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sub_title">
              Sub Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sub_title"
              value={form.sub_title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, sub_title: e.target.value }))
              }
              placeholder="Workshop sub title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CourseSelect
              value={form.course_id}
              onChange={(v) => setForm((prev) => ({ ...prev, course_id: v }))}
            />
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Optional name"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea
              id="short_description"
              value={form.short_description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  short_description: e.target.value,
                }))
              }
              placeholder="Brief summary of the workshop"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Full workshop description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Logo</Label>
              <FileUpload
                value={form.logo}
                onChange={(url) =>
                  setForm((prev) => ({ ...prev, logo: url }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Banner Image</Label>
              <FileUpload
                value={form.banner_image}
                onChange={(url) =>
                  setForm((prev) => ({ ...prev, banner_image: url }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">
                Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">
                Duration (hours) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="duration"
                type="number"
                min={0}
                step="0.5"
                value={form.duration}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    duration: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="discount_type">Discount Type</Label>
              <Select
                value={form.discount_type}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, discount_type: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FLAT">FLAT</SelectItem>
                  <SelectItem value="PERCENTAGE">PERCENTAGE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount_value">Discount Value</Label>
              <Input
                id="discount_value"
                type="number"
                min={0}
                step="0.01"
                value={form.discount_value}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    discount_value: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vat_rate">VAT Rate (%)</Label>
              <Input
                id="vat_rate"
                type="number"
                min={0}
                step="0.1"
                value={form.vat_rate}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    vat_rate: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={form.start_time}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    start_time: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={form.end_time}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    end_time: e.target.value,
                  }))
                }
              />
            </div>
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
