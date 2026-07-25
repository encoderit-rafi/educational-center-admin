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
import type { Event } from '../-types'
import {
  MoreHorizontal,
  Trash2,
  Eye,
  Edit,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

interface EventsTableProps {
  events: Event[]
  onView: (event: Event) => void
  onEdit: (event: Event) => void
  onDelete: (event: Event) => void
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

export function EventsTable({
  events,
  onView,
  onEdit,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: EventsTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="title" label="Title" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Type</TableHead>
            <SortHeader column="startDate" label="Start Date" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Seats</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Active</TableHead>
            <SortHeader column="createdAt" label="Created At" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium max-w-[200px] truncate">
                {event.title ?? '-'}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {event.eventType ? event.eventType.toLowerCase() : '-'}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(event.startDate)}
              </TableCell>
              <TableCell>
                {event.bookedSeats ?? 0}/{event.totalSeats ?? '-'}
              </TableCell>
              <TableCell>{event.price ? `$${event.price}` : '-'}</TableCell>
              <TableCell>
                <Badge variant={event.isActive ? 'success' : 'destructive'}>
                  {event.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(event.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(event)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(event)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(event)}
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
          {events.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No events found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
