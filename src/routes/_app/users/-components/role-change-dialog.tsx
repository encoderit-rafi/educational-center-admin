import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { User } from '../-types'

const ROLES = [
  'admin',
  'student',
  'guest',
  'staff',
  'consultant',
  'instructor',
  'support',
  'sales',
  'partner',
  'marketing',
  'content_creator',
] as const

interface RoleChangeDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onConfirm: (role: string) => void
  isPending: boolean
}

export function RoleChangeDialog({
  isOpen,
  onOpenChange,
  user,
  onConfirm,
  isPending,
}: RoleChangeDialogProps) {
  const [selectedRole, setSelectedRole] = useState('')

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedRole('')
    onOpenChange(open)
  }

  const handleConfirm = () => {
    if (!selectedRole) return
    onConfirm(selectedRole)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="sm:max-w-md dark:bg-card">
        <SheetHeader>
          <SheetTitle>Change User Role</SheetTitle>
          <SheetDescription>
            Update role for{' '}
            <span className="font-medium text-foreground">
              {user?.email ?? 'this user'}
            </span>
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role} className="capitalize">
                  {role.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedRole || isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
