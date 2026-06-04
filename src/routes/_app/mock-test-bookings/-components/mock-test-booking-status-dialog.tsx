import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { MOCK_TEST_BOOKING_STATUSES } from '../-types'

interface MockTestBookingStatusDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentStatus: string
  onConfirm: (status: string) => void
  isPending: boolean
}

export function MockTestBookingStatusDialog({
  isOpen,
  onOpenChange,
  currentStatus,
  onConfirm,
  isPending,
}: MockTestBookingStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<string>(currentStatus)

  const handleConfirm = () => {
    if (newStatus && newStatus !== currentStatus) {
      onConfirm(newStatus)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Booking Status</AlertDialogTitle>
          <AlertDialogDescription>
            Change the status from{' '}
            <span className="font-medium text-foreground">
              {currentStatus}
            </span>{' '}
            to a new status below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_TEST_BOOKING_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending || newStatus === currentStatus}
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
