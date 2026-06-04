import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useGetConsultation } from '../-api'
import { Loader2 } from 'lucide-react'

interface ConsultationDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  consultationId?: string | null
}

export function ConsultationDetailsSheet({
  isOpen,
  onOpenChange,
  consultationId,
}: ConsultationDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetConsultation(consultationId ?? ''),
    enabled: !!consultationId && isOpen,
  })

  const consultation = data

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Consultation Details</SheetTitle>
          <SheetDescription>
            View full details of the consultation booking.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Failed to load consultation details.
            </div>
          ) : consultation ? (
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Booking Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Booking Ref</div>
                    <div className="font-medium">{consultation.bookingRef}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <div>
                      <Badge variant={
                        consultation.status === 'CONFIRMED' ? 'default' :
                        consultation.status === 'PENDING' ? 'secondary' :
                        consultation.status === 'CANCELLED' ? 'destructive' : 'outline'
                      }>
                        {consultation.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Preferred Date</div>
                    <div className="font-medium">
                      {new Date(consultation.preferredDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Created At</div>
                    <div className="font-medium">
                      {new Date(consultation.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Full Name</div>
                    <div className="font-medium">
                      {consultation.firstName} {consultation.lastName}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Email</div>
                    <div className="font-medium truncate" title={consultation.email}>
                      {consultation.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Country</div>
                    <div className="font-medium">{consultation.country}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Phone</div>
                    <div className="font-medium">{consultation.phone ?? '-'}</div>
                  </div>
                </div>
              </section>

              {consultation.exam && (
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Exam Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Exam Name</div>
                      <div className="font-medium">{consultation.exam.name}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Exam ID</div>
                      <div className="font-mono text-xs">{consultation.exam.id}</div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No consultation data found.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
