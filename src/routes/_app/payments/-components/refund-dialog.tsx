import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import type { Payment } from '../-types'

interface RefundDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  payment: Payment | null
  onConfirm: (data: { paymentId: string; amount: number; reason?: string }) => void
  isPending?: boolean
}

export function RefundDialog({
  isOpen,
  onOpenChange,
  payment,
  onConfirm,
  isPending,
}: RefundDialogProps) {
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount ? String(payment.amount / 100) : '')
      setReason('')
    }
  }, [payment, isOpen])

  const maxAmount = payment?.amount ? payment.amount / 100 : 0
  const numAmount = parseFloat(amount)
  const isValid = !isNaN(numAmount) && numAmount > 0 && numAmount <= maxAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!payment || !isValid) return
    onConfirm({
      paymentId: payment.id,
      amount: Math.round(numAmount * 100),
      reason: reason || undefined,
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Process Refund</SheetTitle>
          <SheetDescription>
            Enter the refund amount and reason. Max refundable: ${maxAmount.toFixed(2)}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-6">
          <div className="grid gap-2">
            <Label htmlFor="refundAmount">
              Amount ($) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="refundAmount"
              type="number"
              min="0.01"
              step="0.01"
              max={maxAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="refundReason">Reason</Label>
            <Textarea
              id="refundReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional reason for refund"
              rows={3}
            />
          </div>
          <SheetFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Process Refund
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
