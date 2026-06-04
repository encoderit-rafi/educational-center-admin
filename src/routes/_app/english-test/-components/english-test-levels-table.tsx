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
import type { EnglishLevelDefinition } from '../-types'
import {
  MoreHorizontal,
  Trash2,
  Edit,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface EnglishTestLevelsTableProps {
  levels: EnglishLevelDefinition[]
  onEdit: (level: EnglishLevelDefinition) => void
  onDelete: (level: EnglishLevelDefinition) => void
}

export function EnglishTestLevelsTable({
  levels,
  onEdit,
  onDelete,
}: EnglishTestLevelsTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead>Level Code</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Min Score</TableHead>
            <TableHead>Max Score</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.map((level) => (
            <TableRow key={level.id}>
              <TableCell className="font-mono text-xs font-medium">
                {level.levelCode ?? '-'}
              </TableCell>
              <TableCell>{level.label ?? '-'}</TableCell>
              <TableCell>{level.minScore ?? '-'}</TableCell>
              <TableCell>{level.maxScore ?? '-'}</TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {level.description ?? '-'}
              </TableCell>
              <TableCell>
                <Badge variant={level.isActive ? 'default' : 'destructive'}>
                  {level.isActive ? 'Active' : 'Inactive'}
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
                    <DropdownMenuItem onClick={() => onEdit(level)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(level)}
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
          {levels.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No level definitions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
