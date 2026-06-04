import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useGetCourseBooking } from '../-api'
import { Loader2 } from 'lucide-react'
import type { CourseBookingStatus } from '../-types'

const statusVariants: Record<
  CourseBookingStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDING: 'secondary',
  PAYMENT_PENDING: 'outline',
  CONFIRMED: 'default',
  CANCELLED: 'destructive',
  REFUNDED: 'outline',
}

interface CourseBookingDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bookingId?: string | null
}

export function CourseBookingDetailsSheet({
  isOpen,
  onOpenChange,
  bookingId,
}: CourseBookingDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetCourseBooking(bookingId ?? ''),
    enabled: !!bookingId && isOpen,
  })

  const booking = data

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Booking Details</SheetTitle>
          <SheetDescription>
            View full details of the course booking.
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
                    <div className="text-muted-foreground">Name</div>
                    <div className="font-medium">
                      {booking.firstName} {booking.middleName ? `${booking.middleName} ` : ''}{booking.lastName ?? ''}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Email</div>
                    <div className="font-medium">{booking.email}</div>
                  </div>
                  {booking.phone && (
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Phone</div>
                      <div className="font-medium">{booking.phone}</div>
                    </div>
                  )}
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Status</div>
                    <Badge
                      variant={
                        booking.status
                          ? statusVariants[booking.status]
                          : 'secondary'
                      }
                    >
                      {booking.status ?? 'UNKNOWN'}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Created At</div>
                    <div className="font-medium">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Course ID</div>
                    <div className="font-mono text-xs">
                      {booking.courseId ?? '-'}
                    </div>
                  </div>
                  {booking.totalAmount != null && (
                    <div>
                      <div className="text-muted-foreground">Total Amount</div>
                      <div className="font-medium">
                        ${booking.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {booking.basePrice != null && (
                    <div>
                      <div className="text-muted-foreground">Base Price</div>
                      <div className="font-medium">
                        ${booking.basePrice.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {booking.vatAmount != null && (
                    <div>
                      <div className="text-muted-foreground">VAT Amount</div>
                      <div className="font-medium">
                        ${booking.vatAmount.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {booking.discountAmount != null && (
                    <div>
                      <div className="text-muted-foreground">Discount</div>
                      <div className="font-medium">
                        ${booking.discountAmount.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {booking.country && (
                    <div>
                      <div className="text-muted-foreground">Country</div>
                      <div className="font-medium">{booking.country}</div>
                    </div>
                  )}
                  {booking.address && (
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Address</div>
                      <div className="font-medium">{booking.address}</div>
                    </div>
                  )}
                  {booking.notes && (
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Notes</div>
                      <div className="font-medium">{booking.notes}</div>
                    </div>
                  )}
                  {booking.paymentId && (
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Payment ID</div>
                      <div className="font-mono text-xs">{booking.paymentId}</div>
                    </div>
                  )}
                  {booking.pdfUrl && (
                    <div className="col-span-2">
                      <div className="text-muted-foreground">PDF URL</div>
                      <div className="font-medium truncate">{booking.pdfUrl}</div>
                    </div>
                  )}
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
