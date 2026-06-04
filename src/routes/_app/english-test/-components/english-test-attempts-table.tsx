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
import type { EnglishTestAttempt } from '../-types'
import {
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

interface EnglishTestAttemptsTableProps {
  attempts: EnglishTestAttempt[]
  onDelete: (attempt: EnglishTestAttempt) => void
}

export function EnglishTestAttemptsTable({
  attempts,
  onDelete,
}: EnglishTestAttemptsTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead>User ID</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Started At</TableHead>
            <TableHead>Completed At</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.map((attempt) => (
            <TableRow key={attempt.id}>
              <TableCell className="font-mono text-xs">
                {attempt.userId ?? '-'}
              </TableCell>
              <TableCell>{attempt.score ?? '-'}</TableCell>
              <TableCell>
                <Badge variant="outline">{attempt.level ?? '-'}</Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(attempt.startedAt)}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(attempt.completedAt)}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(attempt.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onDelete(attempt)}
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
          {attempts.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No attempts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
