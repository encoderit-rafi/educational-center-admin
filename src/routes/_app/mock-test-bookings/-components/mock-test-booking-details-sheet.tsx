import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useGetMockTestBooking } from '../-api'
import { Loader2, User, Mail, Phone, MapPin, CreditCard, Calendar, TestTube, Hash } from 'lucide-react'

interface MockTestBookingDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bookingId?: string | null
}

function formatAmount(val: string | null | undefined) {
  if (!val) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
  }).format(Number(val))
}

function formatDate(val: string | null | undefined) {
  if (!val) return '-'
  try {
    return new Date(val).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return val
  }
}

export function MockTestBookingDetailsSheet({
  isOpen,
  onOpenChange,
  bookingId,
}: MockTestBookingDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetMockTestBooking(bookingId ?? ''),
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
          <SheetTitle className="text-xl font-bold">Mock Test Booking Details</SheetTitle>
          <SheetDescription>
            View full details of the mock test booking.
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
                  <Badge variant={booking.status === 'CANCELLED' ? 'destructive' : booking.status === 'PENDING' ? 'warning' : 'success'} className="mt-1 font-semibold">
                    {booking.status ?? 'CONFIRMED'}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block font-medium">Total Amount</span>
                  <span className="text-lg font-bold text-primary">
                    {formatAmount(booking.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Booking Reference */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Hash className="h-4 w-4 text-primary" /> Reference & Test Info
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  {booking.bookingRef && (
                    <div>
                      <div className="text-xs text-muted-foreground">Booking Ref</div>
                      <div className="font-mono text-xs font-semibold text-foreground">{booking.bookingRef}</div>
                    </div>
                  )}
                  {booking.variant && (
                    <div>
                      <div className="text-xs text-muted-foreground">Variant</div>
                      <Badge variant="outline" className="mt-0.5 font-medium capitalize">
                        {booking.variant}
                      </Badge>
                    </div>
                  )}
                  {booking.mockTestId && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <TestTube className="h-3 w-3" /> Mock Test ID
                      </div>
                      <div className="font-mono text-xs text-foreground mt-0.5">{booking.mockTestId}</div>
                    </div>
                  )}
                  {booking.scheduleId && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">Schedule ID</div>
                      <div className="font-mono text-xs text-foreground mt-0.5">{booking.scheduleId}</div>
                    </div>
                  )}
                </div>
              </section>

              {/* Personal Information */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <User className="h-4 w-4 text-primary" /> Personal Information
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Full Name</div>
                    <div className="font-semibold text-foreground text-base">{fullName}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email Address
                    </div>
                    <a href={`mailto:${booking.email}`} className="font-medium text-primary hover:underline truncate block">
                      {booking.email}
                    </a>
                  </div>
                  {booking.phone && (
                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Phone
                      </div>
                      <div className="font-medium text-foreground">{booking.phone}</div>
                    </div>
                  )}
                  {booking.country && (
                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Country
                      </div>
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

              {/* Payment Details */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-primary" /> Payment Breakdown
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div>
                    <div className="text-xs text-muted-foreground">Base Price</div>
                    <div className="font-medium text-foreground">{formatAmount(booking.price)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">VAT Amount</div>
                    <div className="font-medium text-foreground">{formatAmount(booking.vatAmount)}</div>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-border/30 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Total Amount</span>
                    <span className="text-base font-bold text-primary">{formatAmount(booking.totalAmount)}</span>
                  </div>
                  {booking.paymentId && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">Payment ID</div>
                      <div className="font-mono text-xs text-foreground mt-0.5">{booking.paymentId}</div>
                    </div>
                  )}
                </div>
              </section>

              {/* Metadata */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" /> Timestamps
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div>
                    <div className="text-xs text-muted-foreground">Created At</div>
                    <div className="font-medium text-foreground">{formatDate(booking.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Updated At</div>
                    <div className="font-medium text-foreground">{formatDate(booking.updatedAt)}</div>
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
