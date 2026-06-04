import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { Consultation } from '../-types'
import { MoreHorizontal, Trash2, Eye, ClipboardList, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

const statusVariant: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  CONFIRMED: 'default',
  PENDING: 'secondary',
  CANCELLED: 'destructive',
  COMPLETED: 'outline',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

interface ConsultationsTableProps {
  consultations: Consultation[]
  onView: (consultation: Consultation) => void
  onUpdateStatus: (consultation: Consultation) => void
  onDelete: (consultation: Consultation) => void
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

export function ConsultationsTable({
  consultations,
  onView,
  onUpdateStatus,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: ConsultationsTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="bookingRef" label="Booking Ref" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Name</TableHead>
            <SortHeader column="email" label="Email" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="country" label="Country" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="consultationType" label="Type" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Exam</TableHead>
            <SortHeader column="preferredDate" label="Preferred Date" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="status" label="Status" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="createdAt" label="Created At" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations.map((consultation) => (
            <TableRow key={consultation.id}>
              <TableCell className="font-mono text-xs">
                {consultation.bookingRef}
              </TableCell>
              <TableCell className="font-medium">
                {consultation.firstName} {consultation.lastName}
              </TableCell>
              <TableCell>{consultation.email}</TableCell>
              <TableCell>{consultation.country}</TableCell>
              <TableCell className="capitalize">
                {consultation.consultationType.toLowerCase()}
              </TableCell>
              <TableCell>
                {consultation.exam?.name ?? '-'}
              </TableCell>
              <TableCell>
                {formatDate(consultation.preferredDate)}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[consultation.status] ?? 'secondary'}>
                  {consultation.status}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(consultation.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(consultation)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus(consultation)}>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Update Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(consultation)}
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
          {consultations.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-8 text-muted-foreground"
              >
                No consultations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
