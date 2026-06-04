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
import { Loader2 } from 'lucide-react'

interface MockTestBookingDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bookingId?: string | null
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

function formatAmount(val: string | null | undefined) {
  if (!val) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
  }).format(Number(val))
}

function formatDate(val: string | null | undefined) {
  if (!val) return '-'
  return new Date(val).toLocaleDateString()
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

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Mock Test Booking Details</SheetTitle>
          <SheetDescription>
            View full details of the mock test booking.
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
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Booking Ref" value={booking.bookingRef} />
                  <DetailRow label="Mock Test ID" value={booking.mockTestId} />
                  <DetailRow label="Schedule ID" value={booking.scheduleId} />
                  <DetailRow label="Variant" value={booking.variant} />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="First Name" value={booking.firstName} />
                  <DetailRow label="Middle Name" value={booking.middleName} />
                  <DetailRow label="Last Name" value={booking.lastName} />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <DetailRow label="Email" value={booking.email} />
                  </div>
                  <DetailRow label="Phone" value={booking.phone} />
                  <DetailRow label="Country" value={booking.country} />
                  <div className="col-span-2">
                    <DetailRow label="Address" value={booking.address} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Payment
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Price" value={formatAmount(booking.price)} />
                  <DetailRow label="VAT" value={formatAmount(booking.vatAmount)} />
                  <DetailRow label="Total Amount" value={formatAmount(booking.totalAmount)} />
                  <DetailRow label="Payment ID" value={booking.paymentId} />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Status & Metadata
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-muted-foreground text-sm">Status</div>
                    <Badge className="mt-1">{booking.status}</Badge>
                  </div>
                  <DetailRow label="PDF URL" value={booking.pdfUrl} />
                  <DetailRow label="Created At" value={formatDate(booking.createdAt)} />
                  <DetailRow label="Updated At" value={formatDate(booking.updatedAt)} />
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
