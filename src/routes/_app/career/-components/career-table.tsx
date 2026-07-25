import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { CareerApplication } from '../-types'
import {
  MoreHorizontal,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  FileText,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

interface CareerTableProps {
  careers: CareerApplication[]
  onView: (career: CareerApplication) => void
  onDelete: (career: CareerApplication) => void
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

export function CareerTable({
  careers,
  onView,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: CareerTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="firstName" label="Applicant Name" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Gender</TableHead>
            <SortHeader column="email" label="Contact" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="nationality" label="Nationality / City" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Resume</TableHead>
            <SortHeader column="createdAt" label="Applied Date" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {careers.map((career) => {
            const fullName = [career.firstName, career.middleName, career.lastName]
              .filter(Boolean)
              .join(' ') || 'N/A'

            return (
              <TableRow key={career.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div>
                    <span className="font-semibold text-foreground">{fullName}</span>
                    {career.dob && (
                      <span className="block text-xs text-muted-foreground">
                        DOB: {formatDate(career.dob)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="capitalize text-sm">
                  {career.gender || '-'}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {career.email ? (
                      <a
                        href={`mailto:${career.email}`}
                        className="text-primary hover:underline block truncate max-w-[200px]"
                        title={career.email}
                      >
                        {career.email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                    {career.mobile && (
                      <span className="block text-xs text-muted-foreground">
                        {career.mobile}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {career.nationality && (
                      <span className="font-medium uppercase">{career.nationality}</span>
                    )}
                    {career.city && (
                      <span className="block text-xs text-muted-foreground">
                        {career.city}
                      </span>
                    )}
                    {!career.nationality && !career.city && '-'}
                  </div>
                </TableCell>
                <TableCell>
                  {career.resume ? (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 text-xs font-normal"
                    >
                      <a
                        href={career.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        <span>Resume</span>
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(career.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(career)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {career.resume && (
                        <DropdownMenuItem asChild>
                          <a
                            href={career.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Resume
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(career)}
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
          {careers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                No career applications found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
