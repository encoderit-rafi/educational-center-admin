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
import { DateRangePicker } from '@/components/blocks/date-range-picker'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import type { Holiday } from '../-types'

interface HolidayFormData {
  title: string
  description: string
  holidayType: string
  startDate: string
  endDate: string
  isRecurring: boolean
  country: string
  isActive: boolean
  translations: {
    ar: {
      title: string
      description: string
    }
  }
}

interface HolidayFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  holiday?: Holiday | null
  onSave: (data: HolidayFormData) => void
  isPending?: boolean
}

const emptyForm: HolidayFormData = {
  title: '',
  description: '',
  holidayType: '',
  startDate: '',
  endDate: '',
  isRecurring: false,
  country: '',
  isActive: true,
  translations: {
    ar: {
      title: '',
      description: '',
    },
  },
}

const HOLIDAY_TYPES = ['PUBLIC', 'NATIONAL', 'RELIGIOUS', 'CUSTOM'] as const

export function HolidayFormDialog({
  isOpen,
  onOpenChange,
  holiday,
  onSave,
  isPending,
}: HolidayFormDialogProps) {
  const [form, setForm] = useState<HolidayFormData>(emptyForm)

  useEffect(() => {
    if (holiday) {
      setForm({
        title: holiday.title,
        description: holiday.description ?? '',
        holidayType: holiday.holidayType,
        startDate: holiday.startDate
          ? format(new Date(holiday.startDate), 'yyyy-MM-dd')
          : '',
        endDate: holiday.endDate
          ? format(new Date(holiday.endDate), 'yyyy-MM-dd')
          : '',
        isRecurring: holiday.isRecurring,
        country: holiday.country ?? '',
        isActive: holiday.isActive,
        translations: {
          ar: {
            title: holiday.translations?.ar?.title ?? '',
            description: holiday.translations?.ar?.description ?? '',
          },
        },
      })
    } else {
      setForm(emptyForm)
    }
  }, [holiday, isOpen])

  const isEditing = !!holiday
  const isValid = form.title.trim() && form.holidayType && form.startDate && form.endDate

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>{isEditing ? 'Edit Holiday' : 'Create Holiday'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the holiday details.'
              : 'Enter the details for the new holiday.'}
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
              placeholder="Holiday title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ar_title">Arabic Title</Label>
            <Input
              id="ar_title"
              value={form.translations.ar.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  translations: {
                    ...prev.translations,
                    ar: {
                      ...prev.translations.ar,
                      title: e.target.value,
                    },
                  },
                }))
              }
              placeholder="عنوان العطلة"
              dir="rtl"
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
              placeholder="Brief description"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ar_description">Arabic Description</Label>
            <Textarea
              id="ar_description"
              value={form.translations.ar.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  translations: {
                    ...prev.translations,
                    ar: {
                      ...prev.translations.ar,
                      description: e.target.value,
                    },
                  },
                }))
              }
              placeholder="وصف العطلة"
              rows={2}
              dir="rtl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="holidayType">
              Holiday Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.holidayType}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, holidayType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {HOLIDAY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>
              Date Range <span className="text-destructive">*</span>
            </Label>
            <DateRangePicker
              value={{
                from: form.startDate ? new Date(form.startDate) : undefined,
                to: form.endDate ? new Date(form.endDate) : undefined,
              }}
              onChange={(range?: DateRange) =>
                setForm((prev) => ({
                  ...prev,
                  startDate: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
                  endDate: range?.to ? format(range.to, 'yyyy-MM-dd') : '',
                }))
              }
              placeholder="Select start and end date"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={form.country}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
              placeholder="Country (optional)"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isRecurring"
                checked={form.isRecurring}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    isRecurring: checked === true,
                  }))
                }
              />
              <Label htmlFor="isRecurring" className="cursor-pointer">
                Recurring yearly
              </Label>
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

export type { HolidayFormData }
