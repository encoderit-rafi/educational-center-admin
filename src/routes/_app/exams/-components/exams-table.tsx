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
import type { Exam } from '../-types'
import { useGetCourseOptions } from '../-api'
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

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

interface ExamsTableProps {
  exams: Exam[]
  onEdit: (exam: Exam) => void
  onDelete: (exam: Exam) => void
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

export function ExamsTable({
  exams,
  onEdit,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: ExamsTableProps) {
  const { data: courses = [] } = useGetCourseOptions()
  const courseMap = Object.fromEntries(
    courses.map((c) => [c.id, c.title ?? c.name ?? c.id]),
  )

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="name" label="Name" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Course</TableHead>
            <TableHead>Seats</TableHead>
            <SortHeader column="examDate" label="Exam Date" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Total Fee</TableHead>
            <TableHead>Active</TableHead>
            <SortHeader column="createdAt" label="Created At" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell className="font-medium max-w-[200px] truncate">
                {exam.name ?? '-'}
              </TableCell>
              <TableCell>
                {exam.courseId ? (courseMap[exam.courseId] ?? exam.courseId) : '-'}
              </TableCell>
              <TableCell>{exam.availableSeats ?? '-'}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(exam.examDate)}
              </TableCell>
              <TableCell>
                {exam.totalFee ? `$${exam.totalFee}` : '-'}
              </TableCell>
              <TableCell>
                <Badge variant={exam.isActive ? 'default' : 'destructive'}>
                  {exam.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(exam.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(exam)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(exam)}
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
          {exams.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No exams found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
