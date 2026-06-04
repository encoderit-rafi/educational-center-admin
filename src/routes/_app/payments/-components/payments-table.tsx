import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { Payment } from '../-types'
import {
  MoreHorizontal,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Undo2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

function formatAmount(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return '-'
  return (amount / 100).toFixed(2)
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  COMPLETED: 'default',
  PENDING: 'secondary',
  INITIATED: 'outline',
  FAILED: 'destructive',
  REFUNDED: 'outline',
  PARTIALLY_REFUNDED: 'secondary',
}

interface PaymentsTableProps {
  payments: Payment[]
  onView: (payment: Payment) => void
  onRefund: (payment: Payment) => void
  sortBy?: string
  sortOrder?: string
  onSort?: (column: string) => void
}

function SortHeader({
  column,
  label,
  sortBy,
  sortOrder,
  onSort,
}: {
  column: string
  label: string
  sortBy?: string
  sortOrder?: string
  onSort?: (column: string) => void
}) {
  const isActive = sortBy === column
  const Icon = isActive
    ? sortOrder === 'asc'
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown

  return (
    <TableHead
      className="cursor-pointer select-none group"
      onClick={() => onSort?.(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        <Icon
          className={`h-3 w-3 transition-opacity ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
          }`}
        />
      </div>
    </TableHead>
  )
}

export function PaymentsTable({
  payments,
  onView,
  onRefund,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: PaymentsTableProps) {
  const canRefund = (status: string) =>
    status === 'COMPLETED' || status === 'PARTIALLY_REFUNDED'

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead>Payment Ref</TableHead>
            <TableHead>Payer Email</TableHead>
            <SortHeader column="amount" label="Amount" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="status" label="Status" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Payment Type</TableHead>
            <TableHead>Provider</TableHead>
            <SortHeader column="createdAt" label="Created At" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-mono text-xs">
                {payment.paymentRef ?? '-'}
              </TableCell>
              <TableCell className="max-w-[180px] truncate">
                {payment.payerEmail ?? '-'}
              </TableCell>
              <TableCell>
                ${formatAmount(payment.amount)}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[payment.status] ?? 'secondary'}>
                  {payment.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">
                {payment.paymentType ? payment.paymentType.replace(/_/g, ' ') : '-'}
              </TableCell>
              <TableCell>{payment.provider ?? '-'}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(payment.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(payment)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {canRefund(payment.status) && (
                      <DropdownMenuItem onClick={() => onRefund(payment)}>
                        <Undo2 className="mr-2 h-4 w-4" />
                        Refund
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {payments.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No payments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
