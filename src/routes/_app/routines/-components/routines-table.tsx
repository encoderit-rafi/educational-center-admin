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
import type { Routine } from '../-types'
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

function formatTime(timeStr: string | null) {
  if (!timeStr) return '-'
  try {
    return new Date(`1970-01-01T${timeStr}Z`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return timeStr
  }
}

function formatDayOfWeek(day: string | null) {
  if (!day) return '-'
  return day.charAt(0) + day.slice(1).toLowerCase()
}

const ALLOWED_SORTS = ['dayOfWeek', 'startTime', 'createdAt']

interface RoutinesTableProps {
  routines: Routine[]
  onView: (routine: Routine) => void
  onEdit: (routine: Routine) => void
  onDelete: (routine: Routine) => void
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

  const handleClick = () => {
    if (ALLOWED_SORTS.includes(column)) {
      onSort?.(column)
    }
  }

  return (
    <TableHead
      className={`select-none group ${ALLOWED_SORTS.includes(column) ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1">
        {label}
        {ALLOWED_SORTS.includes(column) && (
          <Icon
            className={`h-3 w-3 transition-opacity ${
              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
            }`}
          />
        )}
      </div>
    </TableHead>
  )
}

export function RoutinesTable({
  routines,
  onView,
  onEdit,
  onDelete,
  sortBy = 'dayOfWeek',
  sortOrder = 'asc',
  onSort,
}: RoutinesTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="dayOfWeek" label="Day" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Title</TableHead>
            <TableHead>Instructor</TableHead>
            <SortHeader column="startTime" label="Start Time" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>End Time</TableHead>
            <TableHead>Location</TableHead>
            <SortHeader column="createdAt" label="Active" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routines.map((routine) => (
            <TableRow key={routine.id}>
              <TableCell>
                <Badge variant="outline">
                  {formatDayOfWeek(routine.dayOfWeek)}
                </Badge>
              </TableCell>
              <TableCell className="font-medium max-w-50 truncate">
                {routine.title ?? '-'}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {routine.instructorName ?? '-'}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatTime(routine.startTime)}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatTime(routine.endTime)}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground max-w-37.5 truncate">
                {routine.location ?? '-'}
              </TableCell>
              <TableCell>
                <Badge variant={routine.isActive ? 'success' : 'destructive'}>
                  {routine.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(routine)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(routine)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(routine)}
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
          {routines.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No routines found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
