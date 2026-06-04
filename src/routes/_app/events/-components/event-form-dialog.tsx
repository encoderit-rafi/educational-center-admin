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
import { format } from 'date-fns'
import type { Event } from '../-types'

interface EventFormData {
  title: string
  event_type: string
  description: string
  location: string
  is_online: boolean
  meeting_link: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  total_seats: number | null
  price: number | null
  vat_rate: number | null
  is_active: boolean
  banner: File | null
}

interface EventFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  event?: Event | null
  onSave: (data: EventFormData) => void
  isPending?: boolean
}

const emptyForm: EventFormData = {
  title: '',
  event_type: '',
  description: '',
  location: '',
  is_online: false,
  meeting_link: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  total_seats: null,
  price: null,
  vat_rate: 0,
  is_active: true,
  banner: null,
}

export function EventFormDialog({
  isOpen,
  onOpenChange,
  event,
  onSave,
  isPending,
}: EventFormDialogProps) {
  const [form, setForm] = useState<EventFormData>(emptyForm)

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title ?? '',
        event_type: event.eventType ?? '',
        description: event.description ?? '',
        location: event.location ?? '',
        is_online: event.isOnline ?? false,
        meeting_link: event.meetingLink ?? '',
        start_date: event.startDate
          ? format(new Date(event.startDate), 'yyyy-MM-dd')
          : '',
        end_date: event.endDate
          ? format(new Date(event.endDate), 'yyyy-MM-dd')
          : '',
        start_time: event.startTime ?? '',
        end_time: event.endTime ?? '',
        total_seats: event.totalSeats,
        price: event.price ? Number(event.price) : null,
        vat_rate: event.vatRate ? Number(event.vatRate) : null,
        is_active: event.isActive ?? true,
        banner: null,
      })
    } else {
      setForm(emptyForm)
    }
  }, [event, isOpen])

  const isEditing = !!event
  const isValid = form.title.trim() && form.event_type && form.start_date && form.end_date && form.price !== null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>{isEditing ? 'Edit Event' : 'Create Event'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the event details.'
              : 'Enter the details for the new event.'}
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
              placeholder="Event title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="event_type">
              Event Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.event_type}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, event_type: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEMINAR">Seminar</SelectItem>
                <SelectItem value="WORKSHOP">Workshop</SelectItem>
                <SelectItem value="WEBINAR">Webinar</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Event description"
              rows={3}
            />
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
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={form.start_time}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, start_time: e.target.value }))
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
                  setForm((prev) => ({ ...prev, end_time: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Event location"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="is_online"
              checked={form.is_online}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  is_online: checked === true,
                }))
              }
            />
            <Label htmlFor="is_online" className="cursor-pointer">
              Online Event
            </Label>
          </div>

          {form.is_online && (
            <div className="grid gap-2">
              <Label htmlFor="meeting_link">Meeting Link</Label>
              <Input
                id="meeting_link"
                value={form.meeting_link}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, meeting_link: e.target.value }))
                }
                placeholder="https://meet.example.com/..."
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="total_seats">Total Seats</Label>
              <Input
                id="total_seats"
                type="number"
                value={form.total_seats ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    total_seats: e.target.value ? Number(e.target.value) : null,
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
                step="0.01"
                value={form.price ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    price: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="0.00"
              />
            </div>
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="banner">Banner Image</Label>
            <Input
              id="banner"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  banner: e.target.files?.[0] ?? null,
                }))
              }
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

export type { EventFormData }
