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
import { Loader2 } from 'lucide-react'

interface WorkshopDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  workshopId?: string | null
}

export function WorkshopDetailsSheet({
  isOpen,
  onOpenChange,
  workshopId,
}: WorkshopDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetWorkshop(workshopId ?? ''),
    enabled: !!workshopId && isOpen,
  })

  const workshop = data

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Workshop Details</SheetTitle>
          <SheetDescription>
            View full details of the workshop.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Failed to load workshop details.
            </div>
          ) : workshop ? (
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Workshop Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Title</div>
                    <div className="font-medium">{workshop.title ?? '-'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Sub Title</div>
                    <div className="font-medium">{workshop.subTitle ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <Badge variant={workshop.isActive ? 'default' : 'destructive'}>
                      {workshop.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Created At</div>
                    <div className="font-medium">
                      {new Date(workshop.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Price</div>
                    <div className="font-medium">
                      {workshop.price != null ? `$${workshop.price}` : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Duration</div>
                    <div className="font-medium">
                      {workshop.duration != null ? `${workshop.duration}h` : '-'}
                    </div>
                  </div>
                  {workshop.discountType && (
                    <div>
                      <div className="text-muted-foreground">Discount Type</div>
                      <div className="font-medium">{workshop.discountType}</div>
                    </div>
                  )}
                  {workshop.discountValue != null && (
                    <div>
                      <div className="text-muted-foreground">Discount Value</div>
                      <div className="font-medium">{workshop.discountValue}</div>
                    </div>
                  )}
                  {workshop.vatRate != null && (
                    <div>
                      <div className="text-muted-foreground">VAT Rate</div>
                      <div className="font-medium">{workshop.vatRate}%</div>
                    </div>
                  )}
                  {workshop.startTime && (
                    <div>
                      <div className="text-muted-foreground">Start Time</div>
                      <div className="font-medium">{workshop.startTime}</div>
                    </div>
                  )}
                  {workshop.endTime && (
                    <div>
                      <div className="text-muted-foreground">End Time</div>
                      <div className="font-medium">{workshop.endTime}</div>
                    </div>
                  )}
                </div>
              </section>

              {workshop.shortDescription && (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Short Description
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {workshop.shortDescription}
                  </p>
                </section>
              )}

              {workshop.description && (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {workshop.description}
                  </p>
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
