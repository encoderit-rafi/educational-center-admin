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
import type { Workshop } from '../-types'
import {
  MoreHorizontal,
  Trash2,
  Eye,
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

interface WorkshopsTableProps {
  workshops: Workshop[]
  onView: (workshop: Workshop) => void
  onEdit: (workshop: Workshop) => void
  onDelete: (workshop: Workshop) => void
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

function SortableWorkshopRow({
  workshop,
  onView,
  onEdit,
  onDelete,
  isDragDisabled,
}: {
  workshop: Workshop
  onView: (workshop: Workshop) => void
  onEdit: (workshop: Workshop) => void
  onDelete: (workshop: Workshop) => void
  isDragDisabled?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: workshop.id, disabled: isDragDisabled })

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
        {workshop.title ?? '-'}
      </TableCell>
      <TableCell className="max-w-[200px] truncate text-muted-foreground">
        {workshop.subTitle ?? '-'}
      </TableCell>
      <TableCell>
        {workshop.price != null ? `$${workshop.price}` : '-'}
      </TableCell>
      <TableCell>
        {workshop.duration != null ? `${workshop.duration}h` : '-'}
      </TableCell>
      <TableCell>
        <Badge variant={workshop.isActive ? 'default' : 'destructive'}>
          {workshop.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {formatDate(workshop.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(workshop)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(workshop)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(workshop)}
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

export function WorkshopsTable({
  workshops,
  onView,
  onEdit,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
  onReorder,
  isDragDisabled,
}: WorkshopsTableProps) {
  const [items, setItems] = useState<Workshop[]>(workshops)

  if (items.length !== workshops.length || items.some((it, i) => it.id !== workshops[i]?.id)) {
    setItems(workshops)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((w) => w.id === active.id)
    const newIndex = items.findIndex((w) => w.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex)
    setItems(reordered)
    onReorder?.(reordered.map((w, i) => ({ id: w.id, order_index: i })))
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((w) => w.id)} strategy={verticalListSortingStrategy}>
          <Table containerClassName="flex-1">
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8" />
                <SortHeader column="title" label="Title" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                <SortHeader column="name" label="Sub Title" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Active</TableHead>
                <SortHeader column="createdAt" label="Created At" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((workshop) => (
                <SortableWorkshopRow
                  key={workshop.id}
                  workshop={workshop}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDragDisabled={isDragDisabled}
                />
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No workshops found.
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
