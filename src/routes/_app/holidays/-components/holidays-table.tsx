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
import type { Holiday } from '../-types'
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

function formatHolidayType(type: string) {
  return type.charAt(0) + type.slice(1).toLowerCase()
}

interface HolidaysTableProps {
  holidays: Holiday[]
  onView: (holiday: Holiday) => void
  onEdit: (holiday: Holiday) => void
  onDelete: (holiday: Holiday) => void
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

export function HolidaysTable({
  holidays,
  onView,
  onEdit,
  onDelete,
  sortBy = 'startDate',
  sortOrder = 'desc',
  onSort,
}: HolidaysTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="title" label="Title" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Holiday Type</TableHead>
            <SortHeader column="startDate" label="Start Date" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>End Date</TableHead>
            <TableHead>Recurring</TableHead>
            <SortHeader column="createdAt" label="Active" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holidays.map((holiday) => (
            <TableRow key={holiday.id}>
              <TableCell className="font-medium max-w-50 truncate">
                {holiday.title}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {formatHolidayType(holiday.holidayType)}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(holiday.startDate)}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(holiday.endDate)}
              </TableCell>
              <TableCell>
                <Badge variant={holiday.isRecurring ? 'default' : 'secondary'}>
                  {holiday.isRecurring ? 'Yes' : 'No'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={holiday.isActive ? 'success' : 'destructive'}>
                  {holiday.isActive ? 'Active' : 'Inactive'}
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
                    <DropdownMenuItem onClick={() => onView(holiday)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(holiday)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(holiday)}
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
          {holidays.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No holidays found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
