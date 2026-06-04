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
import type { ExamFormField } from '../-types'
import {
  MoreHorizontal,
  Edit,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ExamFormFieldsTableProps {
  fields: ExamFormField[]
  onEdit: (field: ExamFormField) => void
}

export function ExamFormFieldsTable({
  fields,
  onEdit,
}: ExamFormFieldsTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead>Field Key</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell className="font-mono text-xs font-medium">
                {field.fieldKey ?? '-'}
              </TableCell>
              <TableCell>{field.fieldLabel ?? '-'}</TableCell>
              <TableCell>
                <Badge variant="outline">{field.fieldType ?? '-'}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={field.isRequired ? 'default' : 'secondary'}>
                  {field.isRequired ? 'Required' : 'Optional'}
                </Badge>
              </TableCell>
              <TableCell>{field.orderIndex ?? '-'}</TableCell>
              <TableCell>
                <Badge variant={field.isActive ? 'default' : 'destructive'}>
                  {field.isActive ? 'Active' : 'Inactive'}
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
                    <DropdownMenuItem onClick={() => onEdit(field)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {fields.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No form fields found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
