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
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import type { EnglishLevelDefinition } from '../-types'

interface LevelFormData {
  level_code: string
  label: string
  min_score: number | null
  max_score: number | null
  description: string
  is_active: boolean
}

interface EnglishTestLevelFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  level?: EnglishLevelDefinition | null
  onSave: (data: LevelFormData) => void
  isPending?: boolean
}

const emptyForm: LevelFormData = {
  level_code: '',
  label: '',
  min_score: null,
  max_score: null,
  description: '',
  is_active: true,
}

export function EnglishTestLevelFormDialog({
  isOpen,
  onOpenChange,
  level,
  onSave,
  isPending,
}: EnglishTestLevelFormDialogProps) {
  const [form, setForm] = useState<LevelFormData>(emptyForm)

  useEffect(() => {
    if (level) {
      setForm({
        level_code: level.levelCode ?? '',
        label: level.label ?? '',
        min_score: level.minScore,
        max_score: level.maxScore,
        description: level.description ?? '',
        is_active: level.isActive ?? true,
      })
    } else {
      setForm(emptyForm)
    }
  }, [level, isOpen])

  const isEditing = !!level
  const isValid =
    form.level_code.trim() &&
    form.label.trim() &&
    form.min_score !== null &&
    form.max_score !== null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>
            {isEditing ? 'Edit Level Definition' : 'Create Level Definition'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the level definition details.'
              : 'Enter the details for the new level definition.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="level_code">
                Level Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="level_code"
                value={form.level_code}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    level_code: e.target.value,
                  }))
                }
                placeholder="e.g., A1, B2"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="label">
                Label <span className="text-destructive">*</span>
              </Label>
              <Input
                id="label"
                value={form.label}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, label: e.target.value }))
                }
                placeholder="e.g., Beginner"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="min_score">
                Min Score <span className="text-destructive">*</span>
              </Label>
              <Input
                id="min_score"
                type="number"
                value={form.min_score ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    min_score: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="max_score">
                Max Score <span className="text-destructive">*</span>
              </Label>
              <Input
                id="max_score"
                type="number"
                value={form.max_score ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    max_score: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Description of this level"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="is_active"
              checked={form.is_active}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  is_active: checked === true,
                }))
              }
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Active
            </Label>
          </div>

          <SheetFooter className="p-0 pt-4">
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
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export type { LevelFormData }
