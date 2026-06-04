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
import type { ContactSubmission } from '../-types'
import {
  MoreHorizontal,
  Trash2,
  MailOpen,
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

function formatName(contact: ContactSubmission) {
  return [contact.firstName, contact.middleName, contact.lastName]
    .filter(Boolean)
    .join(' ') || '-'
}

function formatCategory(category: string | null) {
  if (!category) return '-'
  return category.replace(/_/g, ' ')
}

interface ContactTableProps {
  contacts: ContactSubmission[]
  onMarkRead: (contact: ContactSubmission) => void
  onDelete: (contact: ContactSubmission) => void
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

export function ContactTable({
  contacts,
  onMarkRead,
  onDelete,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
}: ContactTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table containerClassName="flex-1">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <SortHeader column="firstName" label="Name" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <SortHeader column="email" label="Email" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead>Subject</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <SortHeader column="createdAt" label="Created At" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium max-w-[180px] truncate">
                {formatName(contact)}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {contact.email ?? '-'}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {contact.subject ?? '-'}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {formatCategory(contact.category)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={contact.isRead ? 'secondary' : 'default'}>
                  {contact.isRead ? 'Read' : 'Unread'}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(contact.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!contact.isRead && (
                      <DropdownMenuItem onClick={() => onMarkRead(contact)}>
                        <MailOpen className="mr-2 h-4 w-4" />
                        Mark as Read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(contact)}
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
          {contacts.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No contacts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
