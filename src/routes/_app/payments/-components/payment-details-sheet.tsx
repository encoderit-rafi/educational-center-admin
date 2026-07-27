import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useGetPayment } from '../-api'
import { Loader2 } from 'lucide-react'

interface PaymentDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  paymentId?: string | null
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  COMPLETED: 'success',
  PENDING: 'warning',
  INITIATED: 'warning',
  FAILED: 'destructive',
  REFUNDED: 'destructive',
  PARTIALLY_REFUNDED: 'warning',
}

function formatAmount(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return '-'
  return (amount / 100).toFixed(2)
}

export function PaymentDetailsSheet({
  isOpen,
  onOpenChange,
  paymentId,
}: PaymentDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetPayment(paymentId ?? ''),
    enabled: !!paymentId && isOpen,
  })

  const payment = data

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Payment Details</SheetTitle>
          <SheetDescription>
            View full details of the payment.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Failed to load payment details.
            </div>
          ) : payment ? (
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Payment Ref</div>
                    <div className="font-mono text-xs">{payment.paymentRef ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <Badge variant={statusVariant[payment.status] ?? 'secondary'}>
                      {payment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Payer Email</div>
                    <div className="font-medium">{payment.payerEmail ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Provider</div>
                    <div>{payment.provider ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Amount</div>
                    <div className="font-medium">
                      ${formatAmount(payment.amount)} {payment.currency ?? 'USD'}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">VAT Amount</div>
                    <div>${formatAmount(payment.vatAmount)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Discount Amount</div>
                    <div>${formatAmount(payment.discountAmount)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Payment Type</div>
                    <div>{payment.paymentType ? payment.paymentType.replace(/_/g, ' ') : '-'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Created At</div>
                    <div>{new Date(payment.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Paid At</div>
                    <div>{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : '-'}</div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No payment data found.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
