import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { EnglishQuizSubmission } from '../-types'
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

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

interface EnglishQuizSubmissionsTableProps {
  submissions: EnglishQuizSubmission[]
  onView: (submission: EnglishQuizSubmission) => void
  onDelete: (submission: EnglishQuizSubmission) => void
}

export function EnglishQuizSubmissionsTable({
  submissions,
  onView,
  onDelete,
}: EnglishQuizSubmissionsTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Follow Up</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="font-medium">
                {submission.fullName ?? '-'}
              </TableCell>
              <TableCell className="text-xs">
                {submission.email ?? '-'}
              </TableCell>
              <TableCell className="text-xs">
                {submission.phone ?? '-'}
              </TableCell>
              <TableCell className="text-xs">
                {submission.country ?? '-'}
              </TableCell>
              <TableCell className="text-xs">
                {submission.city ?? '-'}
              </TableCell>
              <TableCell className="text-xs">
                {submission.questions.length}
              </TableCell>
              <TableCell className="text-xs">
                {submission.followUp ?? '-'}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(submission.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(submission)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(submission)}
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
          {submissions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground"
              >
                No submissions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
