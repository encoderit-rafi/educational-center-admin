import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { SubCourse } from '../-types'
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

function formatPrice(price: number | null | undefined) {
  if (price === null || price === undefined) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

function getDiscountLabel(sub: SubCourse) {
  if (!sub.discountType || sub.discountValue === null) return '-'
  return sub.discountType === 'PERCENTAGE'
    ? `${sub.discountValue}%`
    : formatPrice(sub.discountValue)
}

interface SubCoursesTableProps {
  subCourses: SubCourse[]
  onView: (sub: SubCourse) => void
  onEdit: (sub: SubCourse) => void
  onDelete: (sub: SubCourse) => void
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

export function SubCoursesTable({
  subCourses,
  onView,
  onEdit,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: SubCoursesTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="title" label="Title" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Sub Title</TableHead>
            <SortHeader column="price" label="Price" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Discount</TableHead>
            <SortHeader column="createdAt" label="Created At" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subCourses.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell className="font-medium max-w-[200px] truncate">
                {sub.title}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {sub.subTitle ?? '-'}
              </TableCell>
              <TableCell>{formatPrice(sub.price)}</TableCell>
              <TableCell>{getDiscountLabel(sub)}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(sub.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(sub)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(sub)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(sub)}
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
          {subCourses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No sub courses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
