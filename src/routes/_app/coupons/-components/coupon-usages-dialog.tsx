import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useGetCouponUsages } from '../-api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface CouponUsagesDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  couponId: string | null
  couponCode: string
}

export function CouponUsagesDialog({
  isOpen,
  onOpenChange,
  couponId,
  couponCode,
}: CouponUsagesDialogProps) {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError, refetch } = useQuery({
    ...useGetCouponUsages(couponId ?? '', { page, limit }),
    enabled: isOpen && !!couponId,
  })

  const usages = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl dark:bg-card">
        <DialogHeader>
          <DialogTitle>Coupon Usage History</DialogTitle>
          <DialogDescription>
            Usage history for coupon code:{' '}
            <span className="font-semibold text-foreground">{couponCode}</span>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-destructive font-medium">Failed to load usages</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="border rounded-md max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>User Email</TableHead>
                    <TableHead className="text-right">Purchase Amount</TableHead>
                    <TableHead className="text-right">Discount Amount</TableHead>
                    <TableHead className="text-right">Used At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usages.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell className="font-medium">
                        {usage.user?.name ?? 'Anonymous'}
                      </TableCell>
                      <TableCell>{usage.user?.email ?? '-'}</TableCell>
                      <TableCell className="text-right font-mono">
                        {usage.purchaseAmount ? `$${Number(usage.purchaseAmount).toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                        {usage.discountAmount ? `-$${Number(usage.discountAmount).toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {new Date(usage.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {usages.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No usage history found for this coupon.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
