import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { useUpdateConsultationStatus } from '../-api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { Consultation, ConsultationStatus } from '../-types'

interface ConsultationStatusSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  consultation: Consultation | null
}

const STATUS_OPTIONS: { label: string; value: ConsultationStatus }[] = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Completed', value: 'COMPLETED' },
]

export function ConsultationStatusSheet({
  isOpen,
  onOpenChange,
  consultation,
}: ConsultationStatusSheetProps) {
  const [status, setStatus] = useState<ConsultationStatus>('PENDING')
  const updateStatus = useUpdateConsultationStatus()

  useEffect(() => {
    if (consultation) {
      setStatus(consultation.status)
    }
  }, [consultation])

  const handleSave = () => {
    if (!consultation) return

    updateStatus.mutate(
      { id: consultation.id, status },
      {
        onSuccess: () => {
          toast.success('Status updated successfully')
          onOpenChange(false)
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to update status')
        },
      },
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md dark:bg-card">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Update Status</SheetTitle>
          <SheetDescription>
            Change the current status of consultation{' '}
            <span className="font-mono text-xs font-bold">
              {consultation?.bookingRef}
            </span>
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Consultation Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ConsultationStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            Updating the status will notify the relevant departments and update
            the customer's dashboard.
          </div>
        </div>
        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateStatus.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateStatus.isPending}>
            {updateStatus.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
