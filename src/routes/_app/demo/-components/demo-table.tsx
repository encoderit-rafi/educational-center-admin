import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { TQuizSchema } from '../-types'
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DemoTableProps {
  quizzes: TQuizSchema[]
  onView: (quiz: TQuizSchema) => void
  onEdit: (quiz: TQuizSchema) => void
  onDelete: (id: number) => void
}

export function DemoTable({
  quizzes,
  onView,
  onEdit,
  onDelete,
}: DemoTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz) => (
            <TableRow
              key={quiz.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onView(quiz)}
            >
              <TableCell className="font-mono text-xs">{quiz.id}</TableCell>
              <TableCell className="font-medium">{quiz.name}</TableCell>
              <TableCell>{quiz.date}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {quiz.description}
              </TableCell>
              <TableCell
                className="text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(quiz)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Show
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(quiz)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(quiz.id)}
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
          {quizzes.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No quizzes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
