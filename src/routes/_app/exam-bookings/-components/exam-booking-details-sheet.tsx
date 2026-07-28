import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useGetExamBooking } from '../-api'
import { Loader2, User, Mail, Phone, MapPin, CreditCard, Calendar, GraduationCap, FileCheck } from 'lucide-react'

interface ExamBookingDetailsSheetProps {
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

export function ExamBookingDetailsSheet({
  isOpen,
  onOpenChange,
  bookingId,
}: ExamBookingDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetExamBooking(bookingId ?? ''),
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
          <SheetTitle className="text-xl font-bold">Exam Booking Details</SheetTitle>
          <SheetDescription>
            View full details of the exam booking registration.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading exam booking details...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Failed to load exam booking details.
            </div>
          ) : booking ? (
            <div className="space-y-6">
              {/* Summary Header */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">Booking Status</span>
                    <Badge variant={booking.status === 'CONFIRMED' ? 'success' : booking.status === 'CANCELLED' ? 'destructive' : 'warning'} className="mt-1 font-semibold">
                      {booking.status ?? 'PENDING'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block font-medium">Total Amount</span>
                    <span className="text-lg font-bold text-primary">
                      {formatAmount(booking.totalAmount)}
                    </span>
                  </div>
                </div>
                {(booking.bookingReference || booking.booking_reference) && (
                  <div className="pt-2 border-t border-border/30 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Booking Reference:</span>
                    <Badge variant="outline" className="font-mono font-semibold bg-background">
                      {booking.bookingReference || booking.booking_reference}
                    </Badge>
                  </div>
                )}
              </div>

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
                  <div>
                    <div className="text-xs text-muted-foreground">Date of Birth</div>
                    <div className="font-medium text-foreground">{formatDate(booking.dateOfBirth)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Gender</div>
                    <div className="font-medium text-foreground capitalize">{booking.gender || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Nationality</div>
                    <div className="font-medium text-foreground uppercase">{booking.nationality || '-'}</div>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" /> Contact & Location
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Email Address</div>
                    <a href={`mailto:${booking.email}`} className="font-medium text-primary hover:underline truncate block">
                      {booking.email}
                    </a>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </div>
                    <div className="font-medium text-foreground">{booking.phone || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Country
                    </div>
                    <div className="font-medium text-foreground">{booking.country || '-'}</div>
                  </div>
                  {booking.address && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">Address</div>
                      <div className="font-medium text-foreground">{booking.address}</div>
                    </div>
                  )}
                </div>
              </section>

              {/* ID Documentation */}
              {(booking.idType || booking.idNumber) && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileCheck className="h-4 w-4 text-primary" /> Identification Documents
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                    <div>
                      <div className="text-xs text-muted-foreground">ID Type</div>
                      <div className="font-medium text-foreground">{booking.idType || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">ID Number</div>
                      <div className="font-mono text-xs text-foreground font-semibold">{booking.idNumber || '-'}</div>
                    </div>
                  </div>
                </section>
              )}

              {/* Session & Exam Information */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" /> Session & Exam Info
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  {booking.examId && (
                    <div>
                      <div className="text-xs text-muted-foreground">Exam ID</div>
                      <div className="font-mono text-xs text-foreground mt-0.5">{booking.examId}</div>
                    </div>
                  )}
                  {booking.courseId && (
                    <div>
                      <div className="text-xs text-muted-foreground">Course ID</div>
                      <div className="font-mono text-xs text-foreground mt-0.5">{booking.courseId}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Session Date
                    </div>
                    <div className="font-medium text-foreground">{formatDate(booking.sessionDate)}</div>
                  </div>
                  {booking.sessionTime && (
                    <div>
                      <div className="text-xs text-muted-foreground">Session Time</div>
                      <div className="font-medium text-foreground">{booking.sessionTime}</div>
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
                    <div className="text-xs text-muted-foreground">Exam Fee</div>
                    <div className="font-medium text-foreground">{formatAmount(booking.examFee)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Additional Fee</div>
                    <div className="font-medium text-foreground">{formatAmount(booking.additionalFee)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Discount</div>
                    <div className="font-medium text-foreground">{formatAmount(booking.discountAmount)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">VAT Amount</div>
                    <div className="font-medium text-foreground">{formatAmount(booking.vatAmount)}</div>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-border/30 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Total Amount</span>
                    <span className="text-base font-bold text-primary">{formatAmount(booking.totalAmount)}</span>
                  </div>
                  {(booking.bookingReference || booking.booking_reference || booking.paymentId) && (
                    <div className="col-span-2 pt-2 border-t border-border/30 grid grid-cols-2 gap-4">
                      {(booking.bookingReference || booking.booking_reference) && (
                        <div>
                          <div className="text-xs text-muted-foreground">Booking Reference</div>
                          <div className="font-mono text-xs text-foreground font-semibold mt-0.5">
                            {booking.bookingReference || booking.booking_reference}
                          </div>
                        </div>
                      )}
                      {booking.paymentId && (
                        <div>
                          <div className="text-xs text-muted-foreground">Payment ID</div>
                          <div className="font-mono text-xs text-foreground mt-0.5">{booking.paymentId}</div>
                        </div>
                      )}
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
