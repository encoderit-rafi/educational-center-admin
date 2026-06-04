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

interface EnglishTestAttemptDeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  attemptId: string
  onConfirm: () => void
  isPending: boolean
}

export function EnglishTestAttemptDeleteDialog({
  isOpen,
  onOpenChange,
  attemptId,
  onConfirm,
  isPending,
}: EnglishTestAttemptDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Attempt</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete attempt{' '}
            <span className="font-medium text-foreground font-mono text-xs">
              {attemptId}
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
