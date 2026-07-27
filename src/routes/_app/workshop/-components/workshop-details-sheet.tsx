import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useGetWorkshop } from '../-api'
import { Loader2, Wrench, Clock, CreditCard, Layers, Package, Copy, Calendar, FileText, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

import type { Workshop } from '../-types'

interface WorkshopDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  workshopId?: string | null
  workshopData?: Workshop | null
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.success('Copied to clipboard')
}

export function WorkshopDetailsSheet({
  isOpen,
  onOpenChange,
  workshopId,
  workshopData,
}: WorkshopDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetWorkshop(workshopId ?? ''),
    enabled: !!workshopId && isOpen && !workshopData,
  })

  const workshop = workshopData ?? data

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card p-6 overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold">Workshop Details</SheetTitle>
          <SheetDescription>
            View full details of the workshop module.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading workshop details...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Failed to load workshop details.
            </div>
          ) : workshop ? (
            <div className="space-y-6">
              {/* Header Title & Status */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {workshop.title || workshop.name || 'Workshop'}
                  </h2>
                  {workshop.subTitle && (
                    <p className="text-xs text-muted-foreground mt-0.5">{workshop.subTitle}</p>
                  )}
                </div>
                <Badge variant={workshop.isActive ? 'default' : 'destructive'} className="font-semibold">
                  {workshop.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Media Section */}
              {(workshop.logo || workshop.bannerImage) ? (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <ImageIcon className="h-4 w-4 text-primary" /> Media Assets
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/40">
                    {workshop.logo ? (
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Logo</div>
                        <img
                          src={workshop.logo}
                          alt="Workshop logo"
                          className="max-h-24 rounded-lg border border-border/60 bg-background p-2 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                    ) : null}
                    {workshop.bannerImage ? (
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Banner Image</div>
                        <img
                          src={workshop.bannerImage}
                          alt="Workshop banner"
                          className="max-h-24 rounded-lg border border-border/60 bg-background p-2 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {/* Overview Information */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Wrench className="h-4 w-4 text-primary" /> Overview Information
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Workshop ID</div>
                    <div className="font-mono text-xs text-foreground flex items-center gap-2 mt-0.5">
                      <span>{workshop.id}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(workshop.id)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Slug</div>
                    <div className="font-mono text-xs text-foreground mt-0.5">{workshop.slug || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Type</div>
                    <Badge variant="outline" className="mt-0.5 font-medium">
                      {workshop.type || 'WORKSHOP'}
                    </Badge>
                  </div>
                  {workshop.courseId && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">Course ID</div>
                      <div className="font-mono text-xs text-foreground mt-0.5">{workshop.courseId}</div>
                    </div>
                  )}
                  {workshop.orderIndex != null && (
                    <div>
                      <div className="text-xs text-muted-foreground">Order Index</div>
                      <div className="font-medium text-foreground">{workshop.orderIndex}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Created At
                    </div>
                    <div className="font-medium text-foreground">
                      {new Date(workshop.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </section>

              {/* Pricing & Duration Breakdown */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-primary" /> Pricing & Duration
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div>
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="font-bold text-primary text-base">
                      {workshop.price != null ? `$${workshop.price}` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Duration
                    </div>
                    <div className="font-semibold text-foreground text-base">
                      {workshop.duration != null ? `${workshop.duration} hours` : '-'}
                    </div>
                  </div>
                  {workshop.discountType && (
                    <div>
                      <div className="text-xs text-muted-foreground">Discount Type</div>
                      <div className="font-medium text-foreground">{workshop.discountType}</div>
                    </div>
                  )}
                  {workshop.discountValue != null && (
                    <div>
                      <div className="text-xs text-muted-foreground">Discount Value</div>
                      <div className="font-medium text-foreground">{workshop.discountValue}</div>
                    </div>
                  )}
                  {workshop.vatRate != null && (
                    <div>
                      <div className="text-xs text-muted-foreground">VAT Rate</div>
                      <div className="font-medium text-foreground">{workshop.vatRate}%</div>
                    </div>
                  )}
                  {(workshop.startTime || workshop.endTime) && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">Timing</div>
                      <div className="font-medium text-foreground">
                        {workshop.startTime || 'N/A'} - {workshop.endTime || 'N/A'}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Descriptions */}
              {workshop.shortDescription && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" /> Short Description
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm text-foreground leading-relaxed">
                    {workshop.shortDescription}
                  </div>
                </section>
              )}

              {workshop.description && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" /> Full Description
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {workshop.description}
                  </div>
                </section>
              )}

              {/* Sub Courses */}
              {Array.isArray(workshop.sub_courses) && workshop.sub_courses.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Layers className="h-4 w-4 text-primary" /> Sub Courses ({workshop.sub_courses.length})
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {workshop.sub_courses.map((sc, i) => (
                      <div key={i} className="bg-muted/30 p-3.5 rounded-xl border border-border/40 text-sm font-medium text-foreground">
                        {(sc.title || sc.name || `Sub Course #${i + 1}`) as string}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Packages */}
              {Array.isArray(workshop.packages) && workshop.packages.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Package className="h-4 w-4 text-primary" /> Packages ({workshop.packages.length})
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {workshop.packages.map((pkg, i) => (
                      <div key={i} className="bg-muted/30 p-3.5 rounded-xl border border-border/40 text-sm font-medium text-foreground">
                        {(pkg.name || `Package #${i + 1}`) as string}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No workshop data found.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
