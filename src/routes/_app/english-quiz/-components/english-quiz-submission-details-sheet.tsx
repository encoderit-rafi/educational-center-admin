import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { EnglishQuizSubmission } from '../-types'

interface EnglishQuizSubmissionDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  submission: EnglishQuizSubmission | null
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="text-sm">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{value ?? '-'}</div>
    </div>
  )
}

function formatDateTime(val: string | null | undefined) {
  if (!val) return '-'
  return new Date(val).toLocaleString()
}

export function EnglishQuizSubmissionDetailsSheet({
  isOpen,
  onOpenChange,
  submission,
}: EnglishQuizSubmissionDetailsSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Submission Details</SheetTitle>
          <SheetDescription>
            View full details of the English quiz submission.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          {submission ? (
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <DetailRow label="Full Name" value={submission.fullName} />
                  </div>
                  <div className="col-span-2">
                    <DetailRow label="Email" value={submission.email} />
                  </div>
                  <DetailRow label="Phone" value={submission.phone} />
                  <DetailRow label="Country" value={submission.country} />
                  <DetailRow label="City" value={submission.city} />
                  <DetailRow label="Follow Up" value={submission.followUp} />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Questions & Answers
                </h3>
                <div className="space-y-3">
                  {submission.questions.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No questions in this submission.
                    </p>
                  )}
                  {submission.questions.map((qa, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-3 space-y-2"
                    >
                      <div className="text-sm font-medium">
                        <span className="text-muted-foreground">
                          Q{index + 1}:{' '}
                        </span>
                        {qa.question}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Answer: </span>
                        {qa.answer || (
                          <span className="italic text-muted-foreground">
                            No answer
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Metadata
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow
                    label="Created At"
                    value={formatDateTime(submission.createdAt)}
                  />
                  <DetailRow
                    label="Updated At"
                    value={formatDateTime(submission.updatedAt)}
                  />
                </div>
              </section>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No submission data found.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
