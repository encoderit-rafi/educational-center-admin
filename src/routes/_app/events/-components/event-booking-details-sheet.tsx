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
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Ticket,
  Calendar,
  FileText,
  ExternalLink,
  Copy,
  Video,
} from 'lucide-react'
import { toast } from 'sonner'
import type { EventBooking } from '../-types'

interface EventBookingDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bookingId?: string | null
  bookingData?: EventBooking | null
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

function formatTime(timeStr?: string | null) {
  if (!timeStr) return '-'

  if (/am|pm/i.test(timeStr)) return timeStr

  let hours = 0
  let minutes = 0
  let isValid = false

  if (timeStr.includes('T') || timeStr.includes('Z')) {
    const d = new Date(timeStr)
    if (!isNaN(d.getTime())) {
      hours = d.getUTCHours()
      minutes = d.getUTCMinutes()
      isValid = true
    }
  }

  if (!isValid) {
    const parts = timeStr.split(':')
    if (parts.length >= 2) {
      hours = parseInt(parts[0], 10)
      minutes = parseInt(parts[1], 10)
      if (!isNaN(hours) && !isNaN(minutes)) {
        isValid = true
      }
    }
  }

  if (!isValid) return timeStr

  const period = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12
  const mStr = minutes.toString().padStart(2, '0')
  return `${h12}:${mStr} ${period}`
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.success('Copied to clipboard')
}

export function EventBookingDetailsSheet({
  isOpen,
  onOpenChange,
  bookingId,
  bookingData,
}: EventBookingDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetEventBooking(bookingId ?? ''),
    enabled: !!bookingId && isOpen && !bookingData,
  })

  const booking = bookingData ?? data

  const fullName = booking
    ? [booking.firstName, booking.middleName, booking.lastName]
        .filter(Boolean)
        .join(' ') || 'N/A'
    : 'N/A'

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl dark:bg-card p-6 overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold">Booking Details</SheetTitle>
          <SheetDescription>
            View complete registration information and event booking details.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {isLoading && !bookingData ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading booking details...</p>
            </div>
          ) : isError && !bookingData ? (
            <div className="text-center py-20 text-destructive font-medium">
              Failed to load booking details.
            </div>
          ) : booking ? (
            <div className="space-y-6">
              {/* Summary Header Box */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">
                    Booking Reference
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {booking.bookingRef ?? booking.id}
                    </span>
                    {booking.bookingRef && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(booking.bookingRef!)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="Copy booking reference"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* User Registration Details Card */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <User className="h-4 w-4 text-primary" /> User Registration Info
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  {/* Full Name */}
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground font-medium">Full Name</div>
                    <div className="font-bold text-foreground text-base mt-0.5">{fullName}</div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email Address
                    </div>
                    <div className="font-medium text-foreground mt-0.5 truncate" title={booking.email}>
                      <a href={`mailto:${booking.email}`} className="text-primary hover:underline">
                        {booking.email}
                      </a>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone Number
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {booking.phone ? (
                        <a href={`tel:${booking.phone}`} className="hover:text-primary hover:underline">
                          {booking.phone}
                        </a>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Country
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {booking.country || '-'}
                    </div>
                  </div>

                  {/* Emirate / City / Address */}
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Emirate / City
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {booking.address || '-'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Event Info (If Populated) */}
              {booking.event && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Ticket className="h-4 w-4 text-primary" /> Event Information
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">Event Title</div>
                      <div className="font-bold text-foreground text-base mt-0.5">
                        {booking.event.title || 'Untitled Event'}
                      </div>
                    </div>

                    {booking.event.eventType && (
                      <div>
                        <div className="text-xs text-muted-foreground">Event Type</div>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {booking.event.eventType.toLowerCase()}
                        </Badge>
                      </div>
                    )}

                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" /> Format & Location
                      </div>
                      <div className="font-medium text-foreground mt-1 flex items-center gap-1.5">
                        {booking.event.isOnline ? (
                          <>
                            <Video className="h-3.5 w-3.5 text-primary" /> Online
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3.5 w-3.5 text-amber-500" /> {booking.event.location || 'In-Person'}
                          </>
                        )}
                      </div>
                    </div>

                    {(booking.event.startDate || booking.event.startTime) && (
                      <div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Event Date & Time
                        </div>
                        <div className="font-medium text-foreground mt-0.5">
                          {formatDate(booking.event.startDate)} {booking.event.startTime ? `@ ${formatTime(booking.event.startTime)}` : ''}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Metadata & Actions */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-4 w-4 text-primary" /> Booking Summary
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div>
                    <div className="text-xs text-muted-foreground">Created Date</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatDate(booking.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">PDF Ticket</div>
                    <div className="mt-0.5">
                      {booking.pdfUrl ? (
                        <a
                          href={booking.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
                        >
                          Download Ticket PDF <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs">Not available</span>
                      )}
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
