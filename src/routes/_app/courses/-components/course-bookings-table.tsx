import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { CourseBooking, CourseBookingStatus } from '../-types'
import {
  MoreHorizontal,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

const statusVariants: Record<
  CourseBookingStatus,
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
> = {
  PENDING: 'warning',
  PAYMENT_PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
}

interface CourseBookingsTableProps {
  bookings: CourseBooking[]
  onView: (booking: CourseBooking) => void
  onUpdateStatus: (booking: CourseBooking) => void
  onDelete: (booking: CourseBooking) => void
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

export function CourseBookingsTable({
  bookings,
  onView,
  onUpdateStatus,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: CourseBookingsTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <SortHeader column="email" label="Email" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Course</TableHead>
            <SortHeader column="status" label="Status" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="totalAmount" label="Total" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="createdAt" label="Created At" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium max-w-[180px] truncate">
                {booking.firstName} {booking.lastName ?? ''}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {booking.email}
              </TableCell>
              <TableCell className="max-w-[150px] truncate text-muted-foreground">
                {booking.courseId ?? '-'}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    booking.status
                      ? statusVariants[booking.status]
                      : 'secondary'
                  }
                >
                  {booking.status ?? 'UNKNOWN'}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {booking.totalAmount != null
                  ? `$${booking.totalAmount.toLocaleString()}`
                  : '-'}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(booking.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(booking)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus(booking)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Update Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(booking)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {bookings.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No course bookings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
