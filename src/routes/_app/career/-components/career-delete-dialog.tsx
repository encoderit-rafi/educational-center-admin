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

interface CareerDeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  applicantName: string
  onConfirm: () => void
  isPending: boolean
}

export function CareerDeleteDialog({
  isOpen,
  onOpenChange,
  applicantName,
  onConfirm,
  isPending,
}: CareerDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Career Application</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the application from{' '}
            <span className="font-medium text-foreground">{applicantName}</span>?
            This action cannot be undone.
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
