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
import { useGetCourseOptions } from '../-api'
import type { MockTest } from '../-types'

export interface MockTestFormData {
  courseId: string
  name: string
  type: string
  price: string
  centerPrice: string
  discountType: string
  discountValue: string
  vatRate: string
  description: string
  isActive: boolean
}

interface MockTestFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mockTest?: MockTest | null
  onSave: (data: MockTestFormData) => void
  isPending?: boolean
}

const emptyForm: MockTestFormData = {
  courseId: '',
  name: '',
  type: '',
  price: '',
  centerPrice: '',
  discountType: '',
  discountValue: '',
  vatRate: '0',
  description: '',
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

export function MockTestFormDialog({
  isOpen,
  onOpenChange,
  mockTest,
  onSave,
  isPending,
}: MockTestFormDialogProps) {
  const [form, setForm] = useState<MockTestFormData>(emptyForm)

  useEffect(() => {
    if (mockTest) {
      setForm({
        courseId: mockTest.courseId ?? '',
        name: mockTest.name ?? '',
        type: mockTest.type ?? '',
        price: mockTest.price ?? '',
        centerPrice: mockTest.centerPrice ?? '',
        discountType: mockTest.discountType ?? '',
        discountValue: mockTest.discountValue ?? '',
        vatRate: mockTest.vatRate ?? '',
        description: mockTest.description ?? '',
        isActive: mockTest.isActive,
      })
    } else {
      setForm(emptyForm)
    }
  }, [mockTest, isOpen])

  const isEditing = !!mockTest
  const isValid = form.name.trim() !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>
            {isEditing ? 'Edit Mock Test' : 'Create Mock Test'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the mock test details.'
              : 'Enter the details for the new mock test.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          <CourseSelect
            value={form.courseId}
            onChange={(v) => setForm((prev) => ({ ...prev, courseId: v }))}
          />

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
              placeholder="Mock test name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, type: e.target.value }))
              }
              placeholder="e.g. Practice, Full Length"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
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
              <Label htmlFor="centerPrice">Center Price</Label>
              <Input
                id="centerPrice"
                type="number"
                step="0.01"
                value={form.centerPrice}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, centerPrice: e.target.value }))
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={form.discountType}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, discountType: value }))
                }
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
                step="0.01"
                value={form.discountValue}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    discountValue: e.target.value,
                  }))
                }
                placeholder="0"
              />
            </div>
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
              placeholder="Mock test description"
              rows={3}
            />
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
              {isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
