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

interface MockTestBookingDeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bookingName: string
  onConfirm: () => void
  isPending: boolean
}

export function MockTestBookingDeleteDialog({
  isOpen,
  onOpenChange,
  bookingName,
  onConfirm,
  isPending,
}: MockTestBookingDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Mock Test Booking</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the booking for{' '}
            <span className="font-medium text-foreground">
              {bookingName}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
