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
import type { Coupon } from '../-types'
import {
  MoreHorizontal,
  Trash2,
  Edit,
  History,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  useGetCourseOptions,
  useGetCoursePackageOptions,
  useGetExamOptions,
  useGetMockTestOptions,
  useGetWorkshopOptions,
} from '../-api'

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

interface CouponsTableProps {
  coupons: Coupon[]
  onEdit: (coupon: Coupon) => void
  onDelete: (coupon: Coupon) => void
  onViewUsages: (coupon: Coupon) => void
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

export function CouponsTable({
  coupons,
  onEdit,
  onDelete,
  onViewUsages,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: CouponsTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const { data: courses = [] } = useGetCourseOptions()
  const { data: packages = [] } = useGetCoursePackageOptions()
  const { data: exams = [] } = useGetExamOptions()
  const { data: mockTests = [] } = useGetMockTestOptions()
  const { data: workshops = [] } = useGetWorkshopOptions()

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Copied "${code}" to clipboard!`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="code" label="Code" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Description</TableHead>
            <SortHeader column="discountValue" label="Discount" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Validity Range</TableHead>
            <TableHead>Min Spend / Max Disc</TableHead>
            <TableHead>Usages Limit</TableHead>
            <TableHead>Applies To</TableHead>
            <TableHead>Active</TableHead>
            <SortHeader column="createdAt" label="Created At" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => {
            const applicableTypes = coupon.applicableTo ?? []

            return (
              <TableRow key={coupon.id}>
                <TableCell className="font-semibold max-w-37.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-sm select-all">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy coupon code"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </TableCell>
                <TableCell className="max-w-50 truncate" title={coupon.description ?? ''}>
                  {coupon.description ?? '-'}
                </TableCell>
                <TableCell className="font-medium">
                  {coupon.discountType?.toLowerCase() === 'percentage' ? (
                    <Badge variant="outline" className="text-indigo-600 dark:text-green-400 font-semibold border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                      {coupon.discountValue}% Off
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-emerald-600 dark:text-green-400 font-semibold border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                      ${coupon.discountValue} Off
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {coupon.startDate ? formatDate(coupon.startDate) : 'Anytime'}
                  {' - '}
                  {coupon.endDate ? formatDate(coupon.endDate) : 'Forever'}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div>Min: ${coupon.minPurchaseAmount ?? 0}</div>
                  {coupon.maxDiscountAmount ? (
                    <div>Max Off: ${coupon.maxDiscountAmount}</div>
                  ) : null}
                </TableCell>
                <TableCell className="text-sm">
                  {coupon.maxUses !== null ? (
                    <span className="font-medium">Limit: {coupon.maxUses}</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">Unlimited</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 max-w-55">
                    <div className="flex flex-wrap gap-1">
                      {applicableTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-[10px] py-0 px-1 capitalize">
                          {type.replace('_', ' ')}
                        </Badge>
                      ))}
                      {applicableTypes.length === 0 && (
                        <span className="text-xs text-muted-foreground">All products</span>
                      )}
                    </div>
                    {coupon.applicableEntityIds && coupon.applicableEntityIds.length > 0 && (
                      <div className="flex flex-col gap-0.5 mt-1 border-t pt-1 border-muted text-[11px] text-muted-foreground">
                        {coupon.applicableEntityIds.map((id) => {
                          const course = courses.find((c) => c.id === id)
                          if (course) {
                            return (
                              <div key={id} className="line-clamp-2 wrap-break-word whitespace-normal" title={course.title ?? course.name ?? ''}>
                                • {course.title ?? course.name}
                              </div>
                            )
                          }
                          const pkg = packages.find((p) => p.id === id)
                          if (pkg) {
                            const pkgName = pkg.course?.title ? `${pkg.course.title} - ${pkg.name}` : pkg.name
                            return (
                              <div key={id} className="line-clamp-2 wrap-break-word whitespace-normal" title={pkgName}>
                                • {pkgName}
                              </div>
                            )
                          }
                          const exam = exams.find((e) => e.id === id)
                          if (exam) {
                            return (
                              <div key={id} className="line-clamp-2 wrap-break-word whitespace-normal" title={exam.name ?? ''}>
                                • {exam.name}
                              </div>
                            )
                          }
                          const mockTest = mockTests.find((m) => m.id === id)
                          if (mockTest) {
                            return (
                              <div key={id} className="line-clamp-2 wrap-break-word whitespace-normal" title={mockTest.name ?? ''}>
                                • {mockTest.name}
                              </div>
                            )
                          }
                          const ws = workshops.find((w) => w.id === id)
                          if (ws) {
                            return (
                              <div key={id} className="line-clamp-2 wrap-break-word whitespace-normal" title={ws.title ?? ws.name ?? ''}>
                                • {ws.title ?? ws.name}
                              </div>
                            )
                          }
                          return <div key={id} className="font-mono text-[9px] truncate">• {id}</div>
                        })}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.isActive ? 'success' : 'destructive'}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(coupon.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(coupon)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewUsages(coupon)}>
                        <History className="mr-2 h-4 w-4" />
                        Usage History
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(coupon)}
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
          })}
          {coupons.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                No coupons found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
