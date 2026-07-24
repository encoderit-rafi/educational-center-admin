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

interface EnglishQuizSubmissionDeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  submissionId: string
  onConfirm: () => void
  isPending: boolean
}

export function EnglishQuizSubmissionDeleteDialog({
  isOpen,
  onOpenChange,
  submissionId,
  onConfirm,
  isPending,
}: EnglishQuizSubmissionDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Submission</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete submission{' '}
            <span className="font-medium text-foreground font-mono text-xs">
              {submissionId}
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
