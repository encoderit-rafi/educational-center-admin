import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { EnglishTestAttempt } from '../-types'
import {
  Eye,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

interface EnglishTestAttemptsTableProps {
  attempts: EnglishTestAttempt[]
  onView: (attempt: EnglishTestAttempt) => void
  onDelete: (attempt: EnglishTestAttempt) => void
}

export function EnglishTestAttemptsTable({
  attempts,
  onView,
  onDelete,
}: EnglishTestAttemptsTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 border rounded-lg overflow-hidden bg-card">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10 bg-muted/60">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Full Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Country</TableHead>
            <TableHead className="font-semibold">City</TableHead>
            <TableHead className="font-semibold">Submitted At</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.map((attempt) => {
            const fullName =
              attempt.fullName ||
              attempt.full_name ||
              [attempt.firstName || attempt.first_name, attempt.middleName || attempt.middle_name, attempt.lastName || attempt.last_name]
                .filter(Boolean)
                .join(' ') ||
              '-'

            return (
              <TableRow key={attempt.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-foreground">
                  {fullName}
                </TableCell>
                <TableCell className="text-sm">
                  {attempt.email || '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {attempt.phone || '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {attempt.country || '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {attempt.city || '-'}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(attempt.submittedAt || attempt.submitted_at || attempt.createdAt || attempt.created_at || attempt.startedAt || attempt.started_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(attempt)}>
                        <Eye className="mr-2 h-4 w-4 text-primary" />
                        View Answers
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(attempt)}
                        className="text-destructive focus:text-destructive"
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
          {attempts.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-12 text-muted-foreground"
              >
                No test attempts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
