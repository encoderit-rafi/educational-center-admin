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
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

interface CoursePackagesTableProps {
  packages: CoursePackage[]
  onView: (pkg: CoursePackage) => void
  onEdit: (pkg: CoursePackage) => void
  onDelete: (pkg: CoursePackage) => void
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

export function CoursePackagesTable({
  packages,
  onView,
  onEdit,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: CoursePackagesTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="name" label="Name" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="price" label="Price" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Delivery Type</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Duration</TableHead>
            <SortHeader column="createdAt" label="Active" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell className="font-medium max-w-[200px] truncate">
                {pkg.name}
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
                <Badge variant={pkg.isActive ? 'default' : 'destructive'}>
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
          ))}
          {packages.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No packages found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
