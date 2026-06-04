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

interface ExamBookingDeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bookingName: string
  onConfirm: () => void
  isPending: boolean
}

export function ExamBookingDeleteDialog({
  isOpen,
  onOpenChange,
  bookingName,
  onConfirm,
  isPending,
}: ExamBookingDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Exam Booking</AlertDialogTitle>
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
