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
import { Loader2 } from 'lucide-react'
import { FileUpload } from '@/components/blocks/file-upload'
import { useGetCourseOptions, useGetSubCourseOptions } from '../-api'
import type { CoursePackage } from '../-types'

interface CoursePackageFormData {
  name: string
  courseId: string
  subCourseId: string
  description: string
  price: string
  discountType: string
  discountValue: string
  vatRate: string
  deliveryType: string
  duration: string
  noOfDaysPerWeek: string
  totalHours: string
  requirements: string
  scheduleInfo: string
  bestFor: string
  image: string
  isActive: boolean
}

interface CoursePackageFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  pkg?: CoursePackage | null
  onSave: (data: CoursePackageFormData) => void
  isPending?: boolean
}

const emptyForm: CoursePackageFormData = {
  name: '',
  courseId: '',
  subCourseId: '',
  description: '',
  price: '',
  discountType: '',
  discountValue: '',
  vatRate: '0',
  deliveryType: '',
  duration: '',
  noOfDaysPerWeek: '',
  totalHours: '',
  requirements: '',
  scheduleInfo: '',
  bestFor: '',
  image: '',
  isActive: true,
}

const DELIVERY_TYPES = ['CLASSROOM', 'ONLINE', 'HYBRID'] as const
const DISCOUNT_TYPES = ['FLAT', 'PERCENTAGE'] as const

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
      <Label>Course <span className="text-destructive">*</span></Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className='w-full'>
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

function SubCourseSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const { data: subCourses = [] } = useGetSubCourseOptions()

  return (
    <div className="grid gap-2">
      <Label>Sub Course</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder="Select a sub course..." />
        </SelectTrigger>
        <SelectContent>
          {subCourses.map((sc) => (
            <SelectItem key={sc.id} value={sc.id}>
              {sc.title ?? sc.name}
            </SelectItem>
          ))}
          {subCourses.length === 0 && (
            <SelectItem value="__none__" disabled>
              No sub courses available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

export function CoursePackageFormDialog({
  isOpen,
  onOpenChange,
  pkg,
  onSave,
  isPending,
}: CoursePackageFormDialogProps) {
  const [form, setForm] = useState<CoursePackageFormData>(emptyForm)

  useEffect(() => {
    if (pkg) {
      setForm({
        name: pkg.name,
        courseId: pkg.courseId ?? '',
        subCourseId: pkg.subCourseId ?? '',
        description: pkg.description ?? '',
        price: pkg.price.toString(),
        discountType: pkg.discountType ?? '',
        discountValue: pkg.discountValue?.toString() ?? '',
        vatRate: pkg.vatRate?.toString() ?? '',
        deliveryType: pkg.deliveryType,
        duration: pkg.duration?.toString() ?? '',
        noOfDaysPerWeek: pkg.noOfDaysPerWeek?.toString() ?? '',
        totalHours: pkg.totalHours?.toString() ?? '',
        requirements: pkg.requirements ?? '',
        scheduleInfo: pkg.scheduleInfo ?? '',
        bestFor: Array.isArray(pkg.bestFor) ? pkg.bestFor.join('\n') : '',
        image: pkg.image ?? '',
        isActive: pkg.isActive,
      })
    } else {
      setForm(emptyForm)
    }
  }, [pkg, isOpen])

  const isEditing = !!pkg
  const isValid = form.name.trim() && form.price && form.deliveryType && form.courseId

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>{isEditing ? 'Edit Package' : 'Create Package'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the course package details.'
              : 'Enter the details for the new course package.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
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
              placeholder="Package name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CourseSelect
              value={form.courseId}
              onChange={(v) => setForm((prev) => ({ ...prev, courseId: v }))}
            />
            <SubCourseSelect
              value={form.subCourseId}
              onChange={(v) => setForm((prev) => ({ ...prev, subCourseId: v }))}
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
              placeholder="Package description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">
                Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deliveryType">
                Delivery Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.deliveryType}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, deliveryType: value }))
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={form.discountType}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, discountType: value }))
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {DISCOUNT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input
                id="discountValue"
                type="number"
                step="0.01"
                value={form.discountValue}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, discountValue: e.target.value }))
                }
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vatRate">VAT Rate (%)</Label>
              <Input
                id="vatRate"
                type="number"
                step="0.01"
                value={form.vatRate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, vatRate: e.target.value }))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                step="0.5"
                value={form.duration}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, duration: e.target.value }))
                }
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="noOfDaysPerWeek">Days/Week</Label>
              <Input
                id="noOfDaysPerWeek"
                type="number"
                value={form.noOfDaysPerWeek}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    noOfDaysPerWeek: e.target.value,
                  }))
                }
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalHours">Total Hours</Label>
              <Input
                id="totalHours"
                type="number"
                step="0.5"
                value={form.totalHours}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, totalHours: e.target.value }))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={form.requirements}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  requirements: e.target.value,
                }))
              }
              placeholder="Prerequisites and requirements"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="scheduleInfo">Schedule Info</Label>
            <Textarea
              id="scheduleInfo"
              value={form.scheduleInfo}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  scheduleInfo: e.target.value,
                }))
              }
              placeholder="Schedule information"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label>Image</Label>
            <FileUpload
              value={form.image}
              onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bestFor">Best For</Label>
            <Textarea
              id="bestFor"
              value={form.bestFor}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bestFor: e.target.value }))
              }
              placeholder="One item per line&#10;e.g.&#10;Prefer both online &amp; classroom instruction&#10;High schedule adaptability requirement"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Enter each item on a new line
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  isActive: checked === true,
                }))
              }
            />
            <Label htmlFor="isActive" className="cursor-pointer">
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

export type { CoursePackageFormData }
