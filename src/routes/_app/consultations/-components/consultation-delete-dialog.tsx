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

interface ConsultationDeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bookingRef: string
  onConfirm: () => void
  isPending: boolean
}

export function ConsultationDeleteDialog({
  isOpen,
  onOpenChange,
  bookingRef,
  onConfirm,
  isPending,
}: ConsultationDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Consultation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete consultation{' '}
            <span className="font-mono font-medium text-foreground">
              {bookingRef}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
