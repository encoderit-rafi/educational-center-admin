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
import { FileUpload } from '@/components/blocks/file-upload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useGetCourseOptions } from '../-api'
import type { SubCourse } from '../-types'

interface SubCourseFormData {
  courseId: string
  name: string
  title: string
  subTitle: string
  shortDescription: string
  description: string
  logo: string
  bannerImage: string
  price: string
  discountType: string
  discountValue: string
  vatRate: string
  isActive: boolean
}

interface SubCourseFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  subCourse?: SubCourse | null
  onSave: (data: SubCourseFormData) => void
  isPending?: boolean
}

const emptyForm: SubCourseFormData = {
  courseId: '',
  name: '',
  title: '',
  subTitle: '',
  shortDescription: '',
  description: '',
  logo: '',
  bannerImage: '',
  price: '',
  discountType: '',
  discountValue: '',
  vatRate: '0',
  isActive: true,
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

export function SubCourseFormDialog({
  isOpen,
  onOpenChange,
  subCourse,
  onSave,
  isPending,
}: SubCourseFormDialogProps) {
  const [form, setForm] = useState<SubCourseFormData>(emptyForm)

  useEffect(() => {
    if (subCourse) {
      setForm({
        courseId: subCourse.courseId ?? '',
        name: subCourse.name ?? '',
        title: subCourse.title,
        subTitle: subCourse.subTitle ?? '',
        shortDescription: subCourse.shortDescription ?? '',
        description: subCourse.description ?? '',
        logo: subCourse.logo ?? '',
        bannerImage: subCourse.bannerImage ?? '',
        price: subCourse.price !== null ? String(subCourse.price) : '',
        discountType: subCourse.discountType ?? '',
        discountValue: subCourse.discountValue !== null ? String(subCourse.discountValue) : '',
        vatRate: subCourse.vatRate !== null ? String(subCourse.vatRate) : '',
        isActive: subCourse.isActive,
      })
    } else {
      setForm(emptyForm)
    }
  }, [subCourse, isOpen])

  const isEditing = !!subCourse
  const isValid = form.title.trim() && form.subTitle.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  const set = (key: keyof SubCourseFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>
            {isEditing ? 'Edit Sub Course' : 'Create Sub Course'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the sub course details.'
              : 'Enter the details for the new sub course.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          <CourseSelect
            value={form.courseId}
            onChange={(v) => set('courseId', v)}
          />

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Optional name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Sub course title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subTitle">
              Sub Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subTitle"
              value={form.subTitle}
              onChange={(e) => set('subTitle', e.target.value)}
              placeholder="Sub course sub title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              value={form.shortDescription}
              onChange={(e) => set('shortDescription', e.target.value)}
              placeholder="Brief description"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Full description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Logo</Label>
              <FileUpload
                value={form.logo}
                onChange={(url) => set('logo', url)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Banner Image</Label>
              <FileUpload
                value={form.bannerImage}
                onChange={(url) => set('bannerImage', url)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={form.discountType}
                onValueChange={(v) => set('discountType', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FLAT">Flat</SelectItem>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input
                id="discountValue"
                type="number"
                min="0"
                value={form.discountValue}
                onChange={(e) => set('discountValue', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="vatRate">VAT Rate (%)</Label>
              <Input
                id="vatRate"
                type="number"
                min="0"
                step="0.01"
                value={form.vatRate}
                onChange={(e) => set('vatRate', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(checked) =>
                set('isActive', checked === true)
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

export type { SubCourseFormData }
