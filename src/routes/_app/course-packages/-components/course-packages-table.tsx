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
import type { CoursePackage } from '../-types'
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

function formatPrice(price?: number | string | null) {
  if (price == null || price === '') return '-'
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
}

interface CoursePackagesTableProps {
  packages: CoursePackage[]
  onView: (pkg: CoursePackage) => void
  onEdit: (pkg: CoursePackage) => void
  onDelete: (pkg: CoursePackage) => void
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
          className={`h-3 w-3 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
            }`}
        />
      </div>
    </TableHead>
  )
}

function SortablePackageRow({
  pkg,
  onView,
  onEdit,
  onDelete,
  isDragDisabled,
}: {
  pkg: CoursePackage
  onView: (pkg: CoursePackage) => void
  onEdit: (pkg: CoursePackage) => void
  onDelete: (pkg: CoursePackage) => void
  isDragDisabled?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: pkg.id, disabled: isDragDisabled })

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
      <TableCell className="font-medium max-w-50 truncate">
        {pkg.name}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground max-w-40 truncate">
        {pkg.course?.title ?? '-'}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {formatPrice(pkg.price)}
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          {pkg.deliveryType === 'CLASSROOM' ? 'Classroom' : 'Online'}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {pkg.discountType
          ? `${pkg.discountValue}${pkg.discountType === 'PERCENTAGE' ? '%' : '$'}`
          : '-'}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {pkg.duration ? `${pkg.duration} hrs` : '-'}
      </TableCell>
      <TableCell>
        <Badge variant={pkg.isActive ? 'success' : 'destructive'}>
          {pkg.isActive ? 'Active' : 'Inactive'}
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
            <DropdownMenuItem onClick={() => onView(pkg)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(pkg)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(pkg)}
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

export function CoursePackagesTable({
  packages,
  onView,
  onEdit,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
  onReorder,
  isDragDisabled,
}: CoursePackagesTableProps) {
  const [items, setItems] = useState<CoursePackage[]>(packages)

  if (items.length !== packages.length || items.some((it, i) => it.id !== packages[i]?.id)) {
    setItems(packages)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((p) => p.id === active.id)
    const newIndex = items.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex)
    setItems(reordered)
    onReorder?.(reordered.map((p, i) => ({ id: p.id, order_index: i })))
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <Table containerClassName="flex-1">
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8" />
                <SortHeader column="name" label="Name" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                <TableHead>Course</TableHead>
                <SortHeader column="price" label="Price" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                <TableHead>Delivery Type</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Duration</TableHead>
                <SortHeader column="createdAt" label="Active" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((pkg) => (
                <SortablePackageRow
                  key={pkg.id}
                  pkg={pkg}
                  onView={onView}
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
                    No packages found.
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
