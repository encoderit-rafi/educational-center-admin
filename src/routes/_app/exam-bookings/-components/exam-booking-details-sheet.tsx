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
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  GraduationCap,
  FileCheck,
  FileText,
  ExternalLink,
  ClipboardList,
} from 'lucide-react'

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

function formatSectionTitle(key: string): string {
  const map: Record<string, string> = {
    fees: 'Fee Details',
    documents: 'Uploaded Documents',
    exam_info: 'Exam Information',
    personal_info: 'Personal Information',
  }
  if (map[key]) return map[key]

  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function getSectionIcon(key: string) {
  const normalizedKey = key.toLowerCase()
  if (normalizedKey.includes('fee') || normalizedKey.includes('payment')) {
    return <CreditCard className="h-4 w-4 text-primary" />
  }
  if (normalizedKey.includes('doc') || normalizedKey.includes('file')) {
    return <FileCheck className="h-4 w-4 text-primary" />
  }
  if (normalizedKey.includes('exam') || normalizedKey.includes('info')) {
    return <ClipboardList className="h-4 w-4 text-primary" />
  }
  return <FileText className="h-4 w-4 text-primary" />
}

function renderValue(val: unknown) {
  if (val === null || val === undefined || val === '') {
    return <span className="text-muted-foreground">-</span>
  }

  if (typeof val === 'boolean') {
    return val ? 'Yes' : 'No'
  }

  if (typeof val === 'string') {
    if (val.startsWith('http://') || val.startsWith('https://')) {
      const filename = val.split('/').pop() || 'View File'
      return (
        <a
          href={val}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium break-all"
        >
          <FileText className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-[220px]">{filename}</span>
          <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
        </a>
      )
    }
    return val
  }

  if (typeof val === 'number') {
    return String(val)
  }

  if (Array.isArray(val)) {
    return (
      <ul className="list-disc list-inside space-y-1">
        {val.map((item, i) => (
          <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</li>
        ))}
      </ul>
    )
  }

  if (typeof val === 'object') {
    return (
      <pre className="text-xs bg-muted p-2 rounded max-h-40 overflow-auto font-mono">
        {JSON.stringify(val, null, 2)}
      </pre>
    )
  }

  return String(val)
}

interface FormDataItem {
  name?: string
  key?: string
  label?: string
  value?: unknown
}

function FormDataSection({ formData }: { formData: Record<string, unknown> }) {
  if (!formData || typeof formData !== 'object' || Object.keys(formData).length === 0) {
    return null
  }

  const entries = Object.entries(formData)

  return (
    <div className="space-y-6 pt-4 border-t border-border/40">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Form Data Details
      </div>
      {entries.map(([sectionKey, sectionContent]) => {
        const title = formatSectionTitle(sectionKey)
        const icon = getSectionIcon(sectionKey)

        if (Array.isArray(sectionContent)) {
          return (
            <section key={sectionKey} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {icon} {title}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                {sectionContent.map((item: FormDataItem | unknown, index: number) => {
                  if (
                    item &&
                    typeof item === 'object' &&
                    ('label' in item || 'name' in item || 'key' in item || 'value' in item)
                  ) {
                    const typedItem = item as FormDataItem
                    const label =
                      typedItem.label || typedItem.name || typedItem.key || `Field ${index + 1}`
                    const val = typedItem.value
                    const isLongText = typeof val === 'string' && val.length > 40

                    return (
                      <div key={index} className={isLongText ? 'col-span-2' : 'col-span-1'}>
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="font-medium text-foreground mt-0.5">{renderValue(val)}</div>
                      </div>
                    )
                  }

                  return (
                    <div key={index} className="col-span-2">
                      <div className="font-medium text-foreground">{renderValue(item)}</div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        }

        if (sectionContent && typeof sectionContent === 'object') {
          const subEntries = Object.entries(sectionContent as Record<string, unknown>)
          return (
            <section key={sectionKey} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {icon} {title}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                {subEntries.map(([subKey, subVal]) => {
                  const label = formatSectionTitle(subKey)
                  const isLongText = typeof subVal === 'string' && subVal.length > 40

                  return (
                    <div key={subKey} className={isLongText ? 'col-span-2' : 'col-span-1'}>
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="font-medium text-foreground mt-0.5">{renderValue(subVal)}</div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        }

        return (
          <section key={sectionKey} className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {icon} {title}
            </div>
            <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm font-medium text-foreground">
              {renderValue(sectionContent)}
            </div>
          </section>
        )
      })}
    </div>
  )
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

              {/* Dynamic Form Data Sections */}
              {booking.formData && (
                <FormDataSection formData={booking.formData as Record<string, unknown>} />
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

