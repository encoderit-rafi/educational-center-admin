import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  GripVertical,
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
  onReorder?: (items: { id: string; order_index: number }[]) => void
  isDragDisabled?: boolean
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

function SortableExamRow({
  exam,
  courseMap,
  onEdit,
  onDelete,
  isDragDisabled,
}: {
  exam: Exam
  courseMap: Record<string, string>
  onEdit: (exam: Exam) => void
  onDelete: (exam: Exam) => void
  isDragDisabled?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: exam.id, disabled: isDragDisabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-8">
        {!isDragDisabled && (
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors inline-flex"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </span>
        )}
      </TableCell>
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
        <Badge variant={exam.isActive ? 'success' : 'destructive'}>
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
  )
}

export function ExamsTable({
  exams,
  onEdit,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
  onReorder,
  isDragDisabled,
}: ExamsTableProps) {
  const { data: courses = [] } = useGetCourseOptions()
  const courseMap = Object.fromEntries(
    courses.map((c) => [c.id, c.title ?? c.name ?? c.id]),
  )

  const [items, setItems] = useState<Exam[]>(exams)

  // sync when exams prop changes (e.g. after server refetch)
  if (items.length !== exams.length || items.some((it, i) => it.id !== exams[i]?.id)) {
    setItems(exams)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((e) => e.id === active.id)
    const newIndex = items.findIndex((e) => e.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex)
    setItems(reordered)
    onReorder?.(reordered.map((e, i) => ({ id: e.id, order_index: i })))
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <Table containerClassName="flex-1">
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8" />
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
              {items.map((exam) => (
                <SortableExamRow
                  key={exam.id}
                  exam={exam}
                  courseMap={courseMap}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDragDisabled={isDragDisabled}
                />
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No exams found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  )
}
