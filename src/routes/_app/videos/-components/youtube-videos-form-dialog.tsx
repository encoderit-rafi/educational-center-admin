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
import { Loader2 } from 'lucide-react'
import type { YoutubeVideo } from '../-types'

interface VideoFormData {
  title: string
  youtubeUrl: string
  youtubeVideoId: string
  isActive: boolean
}

interface YoutubeVideosFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  video?: YoutubeVideo | null
  onSave: (data: VideoFormData) => void
  isPending?: boolean
}

const emptyForm: VideoFormData = {
  title: '',
  youtubeUrl: '',
  youtubeVideoId: '',
  isActive: true,
}

export function YoutubeVideosFormDialog({
  isOpen,
  onOpenChange,
  video,
  onSave,
  isPending,
}: YoutubeVideosFormDialogProps) {
  const [form, setForm] = useState<VideoFormData>(emptyForm)

  useEffect(() => {
    if (video) {
      setForm({
        title: video.title ?? '',
        youtubeUrl: video.youtubeUrl ?? '',
        youtubeVideoId: video.youtubeVideoId ?? '',
        isActive: video.isActive ?? true,
      })
    } else {
      setForm(emptyForm)
    }
  }, [video, isOpen])

  const isEditing = !!video
  const isValid = form.title.trim() && form.youtubeUrl.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>{isEditing ? 'Edit Video' : 'Create Video'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the YouTube video details.'
              : 'Enter the details for the new YouTube video.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          <div className="grid gap-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Video title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="youtubeUrl">
              YouTube URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="youtubeUrl"
              value={form.youtubeUrl}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, youtubeUrl: e.target.value }))
              }
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="youtubeVideoId">YouTube Video ID</Label>
            <Input
              id="youtubeVideoId"
              value={form.youtubeVideoId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  youtubeVideoId: e.target.value,
                }))
              }
              placeholder="dQw4w9WgXcQ"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  isActive: checked === true,
                }))
              }
            />
            <Label htmlFor="isActive" className="cursor-pointer">
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

export type { VideoFormData }
