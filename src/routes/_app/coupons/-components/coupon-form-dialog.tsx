import { useState, useEffect } from 'react'
import { DatePicker } from '@/components/blocks/date-picker'
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
import {
  useGetCourseOptions,
  useGetExamOptions,
  useGetMockTestOptions,
  useGetCoursePackageOptions,
  useGetWorkshopOptions,
} from '../-api'
import type { Coupon } from '../-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import MultipleSelector from '@/components/ui/multiselect'
import type { Option } from '@/components/ui/multiselect'

interface CouponFormData {
  code: string
  description: string
  discount_type: 'percentage' | 'flat'
  discount_value: number | null
  max_uses: number | null
  min_purchase_amount: number | null
  max_discount_amount: number | null
  start_date: string
  end_date: string
  is_active: boolean
  applicable_to: string[]
  applicable_entity_ids: string[]
}

interface CouponFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  coupon?: Coupon | null
  onSave: (data: CouponFormData) => void
  isPending?: boolean
}

const emptyForm: CouponFormData = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: null,
  max_uses: null,
  min_purchase_amount: null,
  max_discount_amount: null,
  start_date: '',
  end_date: '',
  is_active: true,
  applicable_to: [],
  applicable_entity_ids: [],
}

const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return undefined
  const parts = dateStr.split('-')
  if (parts.length !== 3) return undefined
  const [year, month, day] = parts.map(Number)
  return new Date(year, month - 1, day)
}

const formatLocalDate = (date: Date | undefined) => {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const ENTITY_TYPES = [
  { value: 'course', label: 'Courses' },
  { value: 'exam', label: 'Exams' },
  { value: 'mock_test', label: 'Mock Tests' },
  { value: 'package', label: 'Packages' },
  { value: 'workshop', label: 'Workshops' },
]

export function CouponFormDialog({
  isOpen,
  onOpenChange,
  coupon,
  onSave,
  isPending,
}: CouponFormDialogProps) {
  const [form, setForm] = useState<CouponFormData>(emptyForm)
  const [selectedEntities, setSelectedEntities] = useState<Option[]>([])

  // Options hooks
  const { data: courses = [] } = useGetCourseOptions()
  const { data: exams = [] } = useGetExamOptions()
  const { data: mockTests = [] } = useGetMockTestOptions()
  const { data: packages = [] } = useGetCoursePackageOptions()
  const { data: workshops = [] } = useGetWorkshopOptions()

  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code ?? '',
        description: coupon.description ?? '',
        discount_type: (coupon.discountType?.toLowerCase() as 'percentage' | 'flat') ?? 'percentage',
        discount_value: coupon.discountValue !== undefined && coupon.discountValue !== null ? Number(coupon.discountValue) : null,
        max_uses: coupon.maxUses,
        min_purchase_amount: coupon.minPurchaseAmount,
        max_discount_amount: coupon.maxDiscountAmount,
        start_date: coupon.startDate ? coupon.startDate.split('T')[0] : '',
        end_date: coupon.endDate ? coupon.endDate.split('T')[0] : '',
        is_active: coupon.isActive ?? true,
        applicable_to: coupon.applicableTo ?? [],
        applicable_entity_ids: coupon.applicableEntityIds ?? [],
      })
    } else {
      setForm(emptyForm)
      setSelectedEntities([])
    }
  }, [coupon, isOpen])

  // Sync selected entities when coupon and choices datasets are available
  useEffect(() => {
    if (coupon && coupon.applicableEntityIds) {
      const selected: Option[] = []
      coupon.applicableEntityIds.forEach((id) => {
        const course = courses.find((c) => c.id === id)
        if (course) {
          selected.push({ value: id, label: course.title ?? course.name ?? id, type: 'Course' })
          return
        }
        const exam = exams.find((e) => e.id === id)
        if (exam) {
          selected.push({ value: id, label: exam.name ?? id, type: 'Exam' })
          return
        }
        const mockTest = mockTests.find((m) => m.id === id)
        if (mockTest) {
          selected.push({ value: id, label: mockTest.name ?? id, type: 'Mock Test' })
          return
        }
        const pkg = packages.find((p) => p.id === id)
        if (pkg) {
          selected.push({
            value: id,
            label: pkg.course?.title ? `${pkg.course.title} - ${pkg.name}` : (pkg.name ?? id),
            type: 'Package',
          })
          return
        }
        const ws = workshops.find((w) => w.id === id)
        if (ws) {
          selected.push({ value: id, label: ws.title ?? ws.name ?? id, type: 'Workshop' })
          return
        }
        // fallback
        selected.push({ value: id, label: id, type: 'Unknown' })
      })
      setSelectedEntities(selected)
    }
  }, [coupon, courses, exams, mockTests, packages, workshops, isOpen])

  const isEditing = !!coupon
  const isValid = form.code.trim() && form.discount_value !== null && form.discount_value > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  // Build options list for multi select based on selected entity types
  const selectableOptions: Option[] = []
  if (form.applicable_to.includes('course')) {
    courses.forEach((c) =>
      selectableOptions.push({
        value: c.id,
        label: c.title ?? c.name ?? c.id,
        type: 'Course',
      })
    )
  }
  if (form.applicable_to.includes('exam')) {
    exams.forEach((e) =>
      selectableOptions.push({
        value: e.id,
        label: e.name ?? e.id,
        type: 'Exam',
      })
    )
  }
  if (form.applicable_to.includes('mock_test')) {
    mockTests.forEach((m) =>
      selectableOptions.push({
        value: m.id,
        label: m.name ?? m.id,
        type: 'Mock Test',
      })
    )
  }
  if (form.applicable_to.includes('package')) {
    packages.forEach((p) =>
      selectableOptions.push({
        value: p.id,
        label: p.course?.title ? `${p.course.title} - ${p.name}` : p.name,
        type: 'Package',
      })
    )
  }
  if (form.applicable_to.includes('workshop')) {
    workshops.forEach((w) =>
      selectableOptions.push({
        value: w.id,
        label: w.title ?? w.name ?? w.id,
        type: 'Workshop',
      })
    )
  }

  const handleEntityTypeToggle = (type: string, checked: boolean) => {
    const newApplicableTo = checked
      ? [...form.applicable_to, type]
      : form.applicable_to.filter((t) => t !== type)

    const typeMap: Record<string, string> = {
      course: 'Course',
      exam: 'Exam',
      mock_test: 'Mock Test',
      package: 'Package',
      workshop: 'Workshop',
    }

    const filteredEntities = selectedEntities.filter((item) => {
      const isThisType = item.type === typeMap[type]
      return isThisType ? checked : true
    })

    setSelectedEntities(filteredEntities)
    setForm((prev) => ({
      ...prev,
      applicable_to: newApplicableTo,
      applicable_entity_ids: filteredEntities.map((e) => e.value),
    }))
  }

  const handleEntitiesChange = (selected: Option[]) => {
    setSelectedEntities(selected)
    setForm((prev) => ({
      ...prev,
      applicable_entity_ids: selected.map((s) => s.value),
    }))
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>{isEditing ? 'Edit Coupon' : 'Create Coupon'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the coupon details.'
              : 'Enter the details for the new coupon.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="code">
                Coupon Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                }
                placeholder="e.g. SAVE20"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount_type">Discount Type</Label>
              <Select
                value={form.discount_type}
                onValueChange={(val: 'percentage' | 'flat') =>
                  setForm((prev) => ({
                    ...prev,
                    discount_type: val,
                    // clear max discount amount if flat is selected
                    max_discount_amount: val === 'flat' ? null : prev.max_discount_amount,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="flat">Flat Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="discount_value">
                Discount Value <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discount_value"
                type="number"
                min="0.01"
                step="0.01"
                value={form.discount_value ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    discount_value: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder={form.discount_type === 'percentage' ? '20' : '10.00'}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_uses">Max Uses Limit</Label>
              <Input
                id="max_uses"
                type="number"
                min="1"
                value={form.max_uses ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    max_uses: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="Unlimited if empty"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="min_purchase_amount">Minimum Purchase Amount</Label>
              <Input
                id="min_purchase_amount"
                type="number"
                min="0"
                step="0.01"
                value={form.min_purchase_amount ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    min_purchase_amount: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="0.00"
              />
            </div>
            {form.discount_type === 'percentage' && (
              <div className="grid gap-2">
                <Label htmlFor="max_discount_amount">Max Discount Cap</Label>
                <Input
                  id="max_discount_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.max_discount_amount ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      max_discount_amount: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  placeholder="No limit"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start_date">Start Date</Label>
              <DatePicker
                value={parseLocalDate(form.start_date)}
                onChange={(date) =>
                  setForm((prev) => ({ ...prev, start_date: formatLocalDate(date) }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">End Date</Label>
              <DatePicker
                value={parseLocalDate(form.end_date)}
                onChange={(date) =>
                  setForm((prev) => ({ ...prev, end_date: formatLocalDate(date) }))
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Coupon details and terms..."
              rows={2}
            />
          </div>

          <div className="border p-3 rounded-md bg-muted/20">
            <Label className="block mb-2 font-semibold">Applicable To</Label>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
              {ENTITY_TYPES.map((type) => {
                const checked = form.applicable_to.includes(type.value)
                return (
                  <div key={type.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`type-${type.value}`}
                      checked={checked}
                      onCheckedChange={(c) => handleEntityTypeToggle(type.value, c === true)}
                    />
                    <Label htmlFor={`type-${type.value}`} className="cursor-pointer text-sm">
                      {type.label}
                    </Label>
                  </div>
                )
              })}
            </div>

            {form.applicable_to.length > 0 ? (
              <div className="grid gap-2 mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                <Label>Specific Entities (leave empty for all of checked types)</Label>
                <MultipleSelector
                  value={selectedEntities}
                  options={selectableOptions}
                  onChange={handleEntitiesChange}
                  placeholder="Select products..."
                  groupBy="type"
                  emptyIndicator={
                    <p className="text-center text-sm text-muted-foreground py-2">
                      No matching entities found
                    </p>
                  }
                />
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">
                Note: Checking no boxes means this coupon applies to all products.
              </p>
            )}
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
              Active (Available for checkouts)
            </Label>
          </div>

          <SheetFooter className="p-0 pt-4 border-t mt-2">
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
