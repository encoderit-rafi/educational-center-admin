import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { useGetEvent } from '../-api'
import type { Event, EventBooking } from '../-types'
import {
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Video,
  Users,
  Copy,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Ticket,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EventBookingDetailsSheet } from './event-booking-details-sheet'

interface EventDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  eventSlugOrId?: string | null
  eventData?: Event | null
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

export function EventDetailsSheet({
  isOpen,
  onOpenChange,
  eventSlugOrId,
  eventData,
}: EventDetailsSheetProps) {
  const targetKey = eventSlugOrId || eventData?.slug || eventData?.id || ''
  const [selectedBooking, setSelectedBooking] = useState<EventBooking | null>(null)

  const { data, isLoading, isError } = useQuery({
    ...useGetEvent(targetKey),
    enabled: !!targetKey && isOpen,
  })

  const event = data ?? eventData

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card p-6 overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold">Event Details</SheetTitle>
          <SheetDescription>
            View detailed information and bookings for this event.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {isLoading && !eventData ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading event details...</p>
            </div>
          ) : isError && !eventData ? (
            <div className="text-center py-20 text-destructive font-medium">
              Failed to load event details.
            </div>
          ) : event ? (
            <div className="space-y-6">
              {/* Header Title & Status */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {event.title || 'Untitled Event'}
                  </h2>
                  {event.slug && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-mono">
                      <span>/{event.slug}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(event.slug!)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="Copy slug"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {event.eventType && (
                    <Badge variant="outline" className="capitalize font-semibold">
                      {event.eventType.toLowerCase()}
                    </Badge>
                  )}
                  <Badge
                    variant={event.isActive ? 'default' : 'destructive'}
                    className="font-semibold"
                  >
                    {event.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {/* Banner Image */}
              {event.bannerImage && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <ImageIcon className="h-4 w-4 text-primary" /> Banner Image
                  </div>
                  <div className="rounded-xl border border-border/50 overflow-hidden bg-muted/20">
                    <img
                      src={event.bannerImage}
                      alt={event.title || 'Event Banner'}
                      className="w-full max-h-56 object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                </section>
              )}

              {/* General Information */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" /> Date & Location
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Start Date
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatDate(event.startDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> End Date
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatDate(event.endDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Start Time
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatTime(event.startTime)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> End Time
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatTime(event.endTime)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Format
                    </div>
                    <div className="font-medium text-foreground mt-0.5 flex items-center gap-1.5">
                      {event.isOnline ? (
                        <>
                          <Video className="h-3.5 w-3.5 text-primary" /> Online
                        </>
                      ) : (
                        <>
                          <MapPin className="h-3.5 w-3.5 text-amber-500" /> In-Person
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </div>
                    <div className="font-medium text-foreground mt-0.5 truncate">
                      {event.location || '-'}
                    </div>
                  </div>
                  {event.isOnline && event.meetingLink && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Video className="h-3 w-3" /> Meeting Link
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <a
                          href={event.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline text-xs font-mono truncate flex items-center gap-1 hover:text-primary/80"
                        >
                          {event.meetingLink}
                          <ExternalLink className="h-3 w-3 inline" />
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(event.meetingLink!)}
                          className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                          title="Copy meeting link"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Seats */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" /> Seats
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> Seats Booked
                    </div>
                    <div className="font-bold text-foreground text-base mt-0.5">
                      {event.bookedSeats ?? 0} / {event.totalSeats ?? '∞'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Created At</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatDate(event.createdAt)}
                    </div>
                  </div>
                </div>
              </section>

              {/* Description */}
              {event.description && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" /> Description
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {event.description}
                  </div>
                </section>
              )}

              {/* Translations */}
              {event.translations && Object.keys(event.translations).length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Globe className="h-4 w-4 text-primary" /> Translations
                  </div>
                  <div className="space-y-3">
                    {Object.entries(event.translations).map(([lang, trans]) => (
                      <div
                        key={lang}
                        className="bg-muted/30 p-4 rounded-xl border border-border/40 space-y-2 text-sm"
                      >
                        <div className="text-xs font-semibold uppercase text-primary">
                          Language: {lang}
                        </div>
                        {trans?.title && (
                          <div>
                            <span className="text-xs text-muted-foreground">Title: </span>
                            <span className="font-medium text-foreground">{trans.title}</span>
                          </div>
                        )}
                        {trans?.description && (
                          <div>
                            <span className="text-xs text-muted-foreground block mb-0.5">
                              Description:
                            </span>
                            <p className="text-foreground whitespace-pre-wrap">
                              {trans.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Bookings List */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Ticket className="h-4 w-4 text-primary" /> Event Bookings (
                    {event.bookings?.length ?? 0})
                  </div>
                </div>
                {event.bookings && event.bookings.length > 0 ? (
                  <div className="rounded-xl border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent bg-muted/40 text-xs">
                          <TableHead>Ref</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Country / City</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {event.bookings.map((b) => (
                          <TableRow key={b.id} className="hover:bg-muted/30">
                            <TableCell className="font-mono text-xs font-medium">
                              {b.bookingRef ?? '-'}
                            </TableCell>
                            <TableCell className="font-medium text-xs">
                              {[b.firstName, b.middleName, b.lastName]
                                .filter(Boolean)
                                .join(' ')}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-32 truncate">
                              {b.email}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {b.phone ?? '-'}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {[b.country, b.address].filter(Boolean).join(', ') || '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => setSelectedBooking({ ...b, event })}
                                title="View booking details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="bg-muted/30 p-6 rounded-xl border border-border/40 text-center text-sm text-muted-foreground">
                    No bookings found for this event.
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No event data found.
            </div>
          )}
        </div>
      </SheetContent>
      <EventBookingDetailsSheet
        isOpen={!!selectedBooking}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
        bookingData={selectedBooking}
      />
    </Sheet>
  )
}
