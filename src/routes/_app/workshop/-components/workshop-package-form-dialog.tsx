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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useGetCourseOptions } from '../-api'
import type { WorkshopPackage } from '../-types'

export interface WorkshopPackageFormData {
  course_id: string
  workshop_id: string
  duration: number
  price: number
  discount_type: string
  discount_value: number
  vat_rate: number
}

interface WorkshopPackageFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  pkg?: WorkshopPackage | null
  onSave: (data: WorkshopPackageFormData) => void
  isPending?: boolean
}

const emptyForm: WorkshopPackageFormData = {
  course_id: '',
  workshop_id: '',
  duration: 0,
  price: 0,
  discount_type: '',
  discount_value: 0,
  vat_rate: 0,
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

export function WorkshopPackageFormDialog({
  isOpen,
  onOpenChange,
  pkg,
  onSave,
  isPending,
}: WorkshopPackageFormDialogProps) {
  const [form, setForm] = useState<WorkshopPackageFormData>(emptyForm)

  useEffect(() => {
    if (pkg) {
      setForm({
        course_id: pkg.courseId ?? '',
        workshop_id: pkg.workshopId ?? '',
        duration: pkg.duration ?? 0,
        price: pkg.price ?? 0,
        discount_type: pkg.discountType ?? '',
        discount_value: pkg.discountValue ?? 0,
        vat_rate: pkg.vatRate ?? 0,
      })
    } else {
      setForm(emptyForm)
    }
  }, [pkg, isOpen])

  const isEditing = !!pkg
  const isValid = form.duration > 0 && form.price > 0

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
            {isEditing ? 'Edit Workshop Package' : 'Create Workshop Package'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the package details.'
              : 'Enter the details for the new package.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <CourseSelect
              value={form.course_id}
              onChange={(v) => setForm((prev) => ({ ...prev, course_id: v }))}
            />
            <div className="grid gap-2">
              <Label htmlFor="workshop_id">Workshop ID</Label>
              <Input
                id="workshop_id"
                value={form.workshop_id}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, workshop_id: e.target.value }))
                }
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  <SelectValue placeholder="Select" />
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
