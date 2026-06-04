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
import type { TestSchedule } from '../-types'
import {
  MoreHorizontal,
  Trash2,
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

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

interface ExamTestSchedulesTableProps {
  schedules: TestSchedule[]
  onEdit: (schedule: TestSchedule) => void
  onDelete: (schedule: TestSchedule) => void
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

export function ExamTestSchedulesTable({
  schedules,
  onEdit,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: ExamTestSchedulesTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="month" label="Month" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="year" label="Year" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="startDate" label="Start Date" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="endDate" label="End Date" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Course ID</TableHead>
            <TableHead>Exam ID</TableHead>
            <TableHead>Visible</TableHead>
            <SortHeader column="createdAt" label="Created At" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>
                {schedule.month ? monthNames[schedule.month - 1] ?? schedule.month : '-'}
              </TableCell>
              <TableCell>{schedule.year ?? '-'}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(schedule.startDate)}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(schedule.endDate)}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {schedule.courseId ?? '-'}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {schedule.examId ?? '-'}
              </TableCell>
              <TableCell>
                <Badge variant={schedule.isVisible ? 'default' : 'secondary'}>
                  {schedule.isVisible ? 'Visible' : 'Hidden'}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(schedule.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(schedule)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(schedule)}
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
          {schedules.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground"
              >
                No test schedules found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
