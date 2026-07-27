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
import { Loader2, User, Mail, Phone, MapPin, CreditCard, Calendar, BookOpen, FileText } from 'lucide-react'
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

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
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

  const fullName = booking
    ? [booking.firstName, booking.middleName, booking.lastName]
        .filter(Boolean)
        .join(' ') || 'N/A'
    : 'N/A'

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card p-6 overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold">Course Booking Details</SheetTitle>
          <SheetDescription>
            View full details of the course booking.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading booking details...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Failed to load booking details.
            </div>
          ) : booking ? (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Booking Status</span>
                  <Badge
                    variant={
                      booking.status
                        ? statusVariants[booking.status]
                        : 'secondary'
                    }
                    className="mt-1 font-semibold"
                  >
                    {booking.status ?? 'UNKNOWN'}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block font-medium">Total Amount</span>
                  <span className="text-lg font-bold text-primary">
                    {booking.totalAmount != null ? `$${booking.totalAmount.toLocaleString()}` : '-'}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <User className="h-4 w-4 text-primary" /> Customer Details
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Full Name</div>
                    <div className="font-semibold text-foreground text-base">{fullName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </div>
                    <div className="font-medium text-foreground truncate" title={booking.email}>
                      <a href={`mailto:${booking.email}`} className="text-primary hover:underline">
                        {booking.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </div>
                    <div className="font-medium text-foreground">{booking.phone ?? '-'}</div>
                  </div>
                </div>
              </section>

              {/* Course Info */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-primary" /> Course Info
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Course ID</div>
                    <div className="font-mono text-xs text-foreground mt-0.5">{booking.courseId ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Created At
                    </div>
                    <div className="font-medium text-foreground">{formatDate(booking.createdAt)}</div>
                  </div>
                </div>
              </section>

              {/* Location */}
              {(booking.country || booking.address) && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> Location
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                    {booking.country && (
                      <div>
                        <div className="text-xs text-muted-foreground">Country</div>
                        <div className="font-medium text-foreground">{booking.country}</div>
                      </div>
                    )}
                    {booking.address && (
                      <div className="col-span-2">
                        <div className="text-xs text-muted-foreground">Address</div>
                        <div className="font-medium text-foreground">{booking.address}</div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Payment & Price Breakdown */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-primary" /> Price & Payment Breakdown
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div>
                    <div className="text-xs text-muted-foreground">Base Price</div>
                    <div className="font-medium text-foreground">
                      {booking.basePrice != null ? `$${booking.basePrice.toLocaleString()}` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Discount</div>
                    <div className="font-medium text-foreground">
                      {booking.discountAmount != null ? `$${booking.discountAmount.toLocaleString()}` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">VAT Amount</div>
                    <div className="font-medium text-foreground">
                      {booking.vatAmount != null ? `$${booking.vatAmount.toLocaleString()}` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Total Amount</div>
                    <div className="font-bold text-primary">
                      {booking.totalAmount != null ? `$${booking.totalAmount.toLocaleString()}` : '-'}
                    </div>
                  </div>
                  {booking.paymentId && (
                    <div className="col-span-2 pt-2 border-t border-border/30">
                      <div className="text-xs text-muted-foreground">Payment ID</div>
                      <div className="font-mono text-xs text-foreground mt-0.5">{booking.paymentId}</div>
                    </div>
                  )}
                </div>
              </section>

              {/* Notes */}
              {booking.notes && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" /> Notes
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm text-foreground">
                    {booking.notes}
                  </div>
                </section>
              )}
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
