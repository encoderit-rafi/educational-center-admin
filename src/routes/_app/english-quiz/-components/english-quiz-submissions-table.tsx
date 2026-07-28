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
  return new Date(dateStr).toLocaleString()
}

function formatScore(scoreStr: string | null | undefined) {
  if (!scoreStr) return '-'
  return scoreStr.replace(/\s*\([^)]*%\)/g, '').replace(/\s*[\d.]*%/g, '').trim()
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
    <div className="flex-1 flex flex-col min-h-0 border rounded-lg overflow-hidden bg-card">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10 bg-muted/60">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Full Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Country</TableHead>
            <TableHead className="font-semibold">City</TableHead>
            <TableHead className="font-semibold">Score</TableHead>
            <TableHead className="font-semibold">Questions</TableHead>
            <TableHead className="font-semibold">Follow Up</TableHead>
            <TableHead className="font-semibold">Submitted At</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => {
            const followUpYes = submission.followUp?.toLowerCase() === 'yes'
            return (
              <TableRow key={submission.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-foreground">
                  {submission.fullName || '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {submission.email || '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {submission.phone || '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {submission.country || '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {submission.city || '-'}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {submission.score ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold">
                      {formatScore(submission.score)}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {submission.questions?.length ?? 0} Qs
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {submission.followUp ? (
                    <Badge variant={followUpYes ? 'default' : 'secondary'} className="capitalize">
                      {submission.followUp}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(submission.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(submission)}>
                        <Eye className="mr-2 h-4 w-4 text-primary" />
                        View Answers
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(submission)}
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
          {submissions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-12 text-muted-foreground"
              >
                No quiz submissions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
