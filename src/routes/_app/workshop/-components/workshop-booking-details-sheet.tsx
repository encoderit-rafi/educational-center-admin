import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useGetWorkshopBooking } from '../-api'
import { Loader2, Calendar, User, CreditCard, MapPin, BookOpen, Wrench, Mail, Phone, FileText } from 'lucide-react'
import type { WorkshopBookingStatus } from '../-types'

const statusVariants: Record<
  WorkshopBookingStatus,
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
> = {
  PENDING: 'warning',
  PAYMENT_PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
}

interface WorkshopBookingDetailsSheetProps {
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

export function WorkshopBookingDetailsSheet({
  isOpen,
  onOpenChange,
  bookingId,
}: WorkshopBookingDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetWorkshopBooking(bookingId ?? ''),
    enabled: !!bookingId && isOpen,
  })

  const booking = data

  const fullName = booking
    ? [booking.firstName, booking.middleName, booking.lastName]
        .filter(Boolean)
        .join(' ') || booking.name || 'N/A'
    : 'N/A'

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card p-6 overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold">Booking Details</SheetTitle>
          <SheetDescription>
            View full details of the workshop booking.
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
              {/* Status & Summary Card */}
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
                  <User className="h-4 w-4 text-primary" />
                  Customer Information
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
                      <a href={`mailto:${booking.email}`} className="hover:underline text-primary">
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

              {/* Workshop & Course Details */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Wrench className="h-4 w-4 text-primary" />
                  Workshop & Course Info
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Workshop Title</div>
                    <div className="font-semibold text-foreground">
                      {booking.workshop?.title || booking.workshop?.name || '-'}
                    </div>
                  </div>
                  {booking.course && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> Course
                      </div>
                      <div className="font-medium text-foreground">
                        {booking.course.title || booking.course.name}
                      </div>
                    </div>
                  )}
                  {booking.workshopType && (
                    <div>
                      <div className="text-xs text-muted-foreground">Workshop Type</div>
                      <Badge variant="outline" className="mt-0.5 font-medium">
                        {booking.workshopType}
                      </Badge>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Booking Date
                    </div>
                    <div className="font-medium text-foreground">{formatDate(booking.createdAt)}</div>
                  </div>
                </div>
              </section>

              {/* Location Details */}
              {(booking.city || booking.country || booking.address) && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    Location Details
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                    {booking.city && (
                      <div>
                        <div className="text-xs text-muted-foreground">City</div>
                        <div className="font-medium text-foreground">{booking.city}</div>
                      </div>
                    )}
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

              {/* Financial & Payment Breakdown */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Payment & Price Breakdown
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div>
                    <div className="text-xs text-muted-foreground">Base Price</div>
                    <div className="font-medium text-foreground">
                      {booking.basePrice != null ? `$${booking.basePrice.toLocaleString()}` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Discount Amount</div>
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

              {/* Notes / Additional Info */}
              {booking.notes && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    Notes
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm">
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
