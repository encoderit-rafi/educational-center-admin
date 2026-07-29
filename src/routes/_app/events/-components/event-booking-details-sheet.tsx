import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useGetEventBooking } from '../-api'
import { Loader2 } from 'lucide-react'

interface EventBookingDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bookingId?: string | null
}

export function EventBookingDetailsSheet({
  isOpen,
  onOpenChange,
  bookingId,
}: EventBookingDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetEventBooking(bookingId ?? ''),
    enabled: !!bookingId && isOpen,
  })

  const booking = data

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Booking Details</SheetTitle>
          <SheetDescription>
            View full details of the event booking.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Failed to load booking details.
            </div>
          ) : booking ? (
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Booking Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Booking Ref</div>
                    <div className="font-mono text-xs">{booking.bookingRef ?? '-'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Attended</div>
                    <Badge variant={booking.attended ? 'default' : 'secondary'}>
                      {booking.attended ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Name</div>
                    <div className="font-medium">
                      {booking.firstName} {booking.middleName ? `${booking.middleName} ` : ''}{booking.lastName}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Email</div>
                    <div className="font-medium">{booking.email}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Phone</div>
                    <div>{booking.phone ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Country</div>
                    <div>{booking.country ?? '-'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Address</div>
                    <div>{booking.address ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Created At</div>
                    <div>{new Date(booking.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">PDF</div>
                    <div>
                      {booking.pdfUrl ? (
                        <a
                          href={booking.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          View PDF
                        </a>
                      ) : '-'}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No booking data found.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
