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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import type { WorkshopBooking, WorkshopBookingStatus } from '../-types'

const statusOptions: { value: WorkshopBookingStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAYMENT_PENDING', label: 'Payment Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
]

interface WorkshopBookingStatusDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  booking?: WorkshopBooking | null
  onSave: (data: { status: WorkshopBookingStatus }) => void
  isPending?: boolean
}

export function WorkshopBookingStatusDialog({
  isOpen,
  onOpenChange,
  booking,
  onSave,
  isPending,
}: WorkshopBookingStatusDialogProps) {
  const [status, setStatus] = useState<WorkshopBookingStatus>('PENDING')

  useEffect(() => {
    if (booking?.status) {
      setStatus(booking.status)
    } else {
      setStatus('PENDING')
    }
  }, [booking, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ status })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md dark:bg-card">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Update Booking Status</SheetTitle>
          <SheetDescription>
            Change the status for booking from{' '}
            <span className="font-medium text-foreground">
              {booking?.firstName} {booking?.lastName}
            </span>
            .
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 p-2">
          <div className="grid gap-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as WorkshopBookingStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
