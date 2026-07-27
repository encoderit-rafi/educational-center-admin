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
import type { WorkshopBooking, WorkshopBookingStatus } from '../-types'
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
  WorkshopBookingStatus,
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
> = {
  PENDING: 'warning',
  PAYMENT_PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
}

interface WorkshopBookingsTableProps {
  bookings: WorkshopBooking[]
  onView: (booking: WorkshopBooking) => void
  onUpdateStatus: (booking: WorkshopBooking) => void
  onDelete: (booking: WorkshopBooking) => void
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

export function WorkshopBookingsTable({
  bookings,
  onView,
  onUpdateStatus,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: WorkshopBookingsTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="firstName" label="Name" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="email" label="Contact" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Workshop / Course</TableHead>
            <TableHead>Type</TableHead>
            <SortHeader column="status" label="Status" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="totalAmount" label="Total" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="createdAt" label="Created At" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const fullName = [booking.firstName, booking.middleName, booking.lastName]
              .filter(Boolean)
              .join(' ') || booking.name || 'N/A'
            const workshopTitle = booking.workshop?.title || booking.workshop?.name || 'Workshop'
            const courseTitle = booking.course?.title || booking.course?.name

            return (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  <div>
                    <span className="font-semibold text-foreground">{fullName}</span>
                    {booking.city && (
                      <span className="block text-xs text-muted-foreground">
                        {booking.city}{booking.country ? `, ${booking.country}` : ''}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <span className="text-foreground block">{booking.email}</span>
                    {booking.phone && (
                      <span className="text-xs text-muted-foreground block">
                        {booking.phone}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <span className="font-medium text-foreground text-sm block">
                      {workshopTitle}
                    </span>
                    {courseTitle && (
                      <span className="text-xs text-muted-foreground block">
                        Course: {courseTitle}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                  {booking.workshopType ? (
                    <Badge variant="outline" className="font-medium">
                      {booking.workshopType}
                    </Badge>
                  ) : (
                    '-'
                  )}
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
                <TableCell className="text-sm font-semibold">
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
            )
          })}
          {bookings.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No workshop bookings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
