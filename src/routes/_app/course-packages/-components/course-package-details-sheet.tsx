import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useGetCoursePackage } from '../-api'
import type { CoursePackage } from '../-types'
import {
  Loader2,
  Copy,
  Package,
  Clock,
  DollarSign,
  Globe,
  Tag,
  CheckCircle2,
  FileText,
  BookOpen,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

interface CoursePackageDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  packageSlugOrId?: string | null
  initialData?: CoursePackage | null
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.success('Copied to clipboard')
}

function formatPrice(price?: number | string | null) {
  if (price == null || price === '') return '-'
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
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

function renderHtml(content: string) {
  return <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
}

export function CoursePackageDetailsSheet({
  isOpen,
  onOpenChange,
  packageSlugOrId,
  initialData,
}: CoursePackageDetailsSheetProps) {
  const targetKey = packageSlugOrId || initialData?.slug || initialData?.id || ''

  const { data, isLoading, isError } = useQuery({
    ...useGetCoursePackage(targetKey),
    enabled: !!targetKey && isOpen,
  })

  const pkg = data ?? initialData
  const subCourseObj = pkg?.subCourse ?? pkg?.sub_course

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card p-6 overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold">Course Package Details</SheetTitle>
          <SheetDescription>
            View full details and configuration of this package.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {isLoading && !initialData ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading package details...</p>
            </div>
          ) : isError && !initialData ? (
            <div className="text-center py-20 text-destructive font-medium">
              Failed to load package details.
            </div>
          ) : pkg ? (
            <div className="space-y-6">
              {/* Header Title & Status */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{pkg.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={pkg.deliveryType === 'CLASSROOM' ? 'outline' : 'secondary'}>
                    {pkg.deliveryType === 'CLASSROOM' ? 'Classroom' : 'Online'}
                  </Badge>
                  <Badge variant={pkg.isActive ? 'success' : 'destructive'} className="font-semibold">
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {/* Package Image */}
              {pkg.image && (
                <section className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Package Image
                  </div>
                  <div className="bg-muted/30 p-2 rounded-xl border border-border/40 flex justify-center">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="max-h-48 rounded-lg object-contain bg-background border border-border/60"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                </section>
              )}

              {/* General Overview Information */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Package className="h-4 w-4 text-primary" /> Overview Information
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Package ID</div>
                    <div className="font-mono text-xs text-foreground flex items-center gap-2 mt-0.5">
                      <span>{pkg.id}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(pkg.id)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Copy package ID"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Course</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {pkg.course?.title ?? pkg.course?.name ?? '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Sub-Course</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {subCourseObj?.title ?? subCourseObj?.name ?? '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Created At</div>
                    <div className="font-medium text-foreground mt-0.5">{formatDate(pkg.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Updated At</div>
                    <div className="font-medium text-foreground mt-0.5">{formatDate(pkg.updatedAt)}</div>
                  </div>
                </div>
              </section>

              {/* Pricing & Discounts */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <DollarSign className="h-4 w-4 text-primary" /> Pricing & Discounts
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-4 rounded-xl border border-border/40 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="font-bold text-primary text-base mt-0.5">
                      {formatPrice(pkg.price)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Discount</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {pkg.discountType && pkg.discountValue != null && pkg.discountValue !== ''
                        ? `${pkg.discountValue}${pkg.discountType === 'PERCENTAGE' ? '%' : '$'}`
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Special Discount</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {pkg.specialDiscountType && pkg.specialDiscount != null && pkg.specialDiscount !== ''
                        ? `${pkg.specialDiscount}${pkg.specialDiscountType === 'PERCENTAGE' ? '%' : '$'}`
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">VAT Rate</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {pkg.vatRate != null && pkg.vatRate !== '' ? `${pkg.vatRate}%` : '-'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Duration & Schedule Info */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" /> Duration & Schedule
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-4 rounded-xl border border-border/40 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {pkg.duration ? `${pkg.duration} hrs` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Days per Week</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {pkg.noOfDaysPerWeek != null ? `${pkg.noOfDaysPerWeek} days` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Total Hours</div>
                    <div className="font-medium text-foreground mt-0.5">
                      {pkg.totalHours ? `${pkg.totalHours} hrs` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> Class Size
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {pkg.classSize != null ? String(pkg.classSize) : '-'}
                    </div>
                  </div>
                </div>
                {pkg.scheduleInfo && (
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm">
                    <div className="text-xs text-muted-foreground mb-1 font-semibold">
                      Schedule Details
                    </div>
                    <div className="text-foreground whitespace-pre-wrap">
                      {pkg.scheduleInfo}
                    </div>
                  </div>
                )}
              </section>

              {/* Description */}
              {pkg.description && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <BookOpen className="h-4 w-4 text-primary" /> Description
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm text-foreground">
                    {renderHtml(pkg.description)}
                  </div>
                </section>
              )}

              {/* Requirements */}
              {pkg.requirements && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" /> Requirements
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm text-foreground">
                    {renderHtml(pkg.requirements)}
                  </div>
                </section>
              )}

              {/* Best For */}
              {Array.isArray(pkg.bestFor) && pkg.bestFor.length > 0 && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Tag className="h-4 w-4 text-primary" /> Best For
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40">
                    <ul className="space-y-1.5 text-sm text-foreground">
                      {pkg.bestFor.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Arabic Translation Details if available */}
              {pkg.translations?.ar && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Globe className="h-4 w-4 text-primary" /> Arabic Translation
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 space-y-3 text-sm" dir="rtl">
                    {pkg.translations.ar.name && (
                      <div>
                        <div className="text-xs text-muted-foreground font-sans">Name (Arabic)</div>
                        <div className="font-bold text-foreground mt-0.5">{pkg.translations.ar.name}</div>
                      </div>
                    )}
                    {pkg.translations.ar.description && (
                      <div>
                        <div className="text-xs text-muted-foreground font-sans">Description (Arabic)</div>
                        <div className="text-foreground mt-0.5">{renderHtml(pkg.translations.ar.description)}</div>
                      </div>
                    )}
                    {pkg.translations.ar.requirements && (
                      <div>
                        <div className="text-xs text-muted-foreground font-sans">Requirements (Arabic)</div>
                        <div className="text-foreground mt-0.5">{renderHtml(pkg.translations.ar.requirements)}</div>
                      </div>
                    )}
                    {pkg.translations.ar.best_for && (
                      <div>
                        <div className="text-xs text-muted-foreground font-sans">Best For (Arabic)</div>
                        <div className="text-foreground mt-0.5 whitespace-pre-wrap">{pkg.translations.ar.best_for}</div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No package details found.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
