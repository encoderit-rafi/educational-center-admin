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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useGetCourseOptions, useGetSubCourseOptions } from '../-api'
import type { Routine } from '../-types'

interface RoutineFormData {
  title: string
  courseId: string
  subCourseId: string
  instructorName: string
  dayOfWeek: string
  startTime: string
  endTime: string
  location: string
  isOnline: boolean
  meetingLink: string
  isActive: boolean
}

interface RoutineFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  routine?: Routine | null
  onSave: (data: RoutineFormData) => void
  isPending?: boolean
}

const emptyForm: RoutineFormData = {
  title: '',
  courseId: '',
  subCourseId: '',
  instructorName: '',
  dayOfWeek: '',
  startTime: '',
  endTime: '',
  location: '',
  isOnline: false,
  meetingLink: '',
  isActive: true,
}

const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const

function CourseSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const { data: courses = [] } = useGetCourseOptions()

  return (
    <div className="grid gap-2">
      <Label>Course</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a course..." />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.title ?? course.name}
            </SelectItem>
          ))}
          {courses.length === 0 && (
            <SelectItem value="__none__" disabled>
              No courses available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

function SubCourseSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const { data: subCourses = [] } = useGetSubCourseOptions()

  return (
    <div className="grid gap-2">
      <Label>Sub Course</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a sub course..." />
        </SelectTrigger>
        <SelectContent>
          {subCourses.map((sc) => (
            <SelectItem key={sc.id} value={sc.id}>
              {sc.title ?? sc.name}
            </SelectItem>
          ))}
          {subCourses.length === 0 && (
            <SelectItem value="__none__" disabled>
              No sub courses available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

export function RoutineFormDialog({
  isOpen,
  onOpenChange,
  routine,
  onSave,
  isPending,
}: RoutineFormDialogProps) {
  const [form, setForm] = useState<RoutineFormData>(emptyForm)

  useEffect(() => {
    if (routine) {
      const startTime = routine.startTime
        ? routine.startTime.slice(0, 5)
        : ''
      const endTime = routine.endTime
        ? routine.endTime.slice(0, 5)
        : ''

      setForm({
        title: routine.title ?? '',
        courseId: routine.courseId ?? '',
        subCourseId: routine.subCourseId ?? '',
        instructorName: routine.instructorName ?? '',
        dayOfWeek: routine.dayOfWeek ?? '',
        startTime,
        endTime,
        location: routine.location ?? '',
        isOnline: routine.isOnline ?? false,
        meetingLink: routine.meetingLink ?? '',
        isActive: routine.isActive ?? true,
      })
    } else {
      setForm(emptyForm)
    }
  }, [routine, isOpen])

  const isEditing = !!routine
  const isValid = form.title.trim() && form.dayOfWeek

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>{isEditing ? 'Edit Routine' : 'Create Routine'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the routine details.'
              : 'Enter the details for the new routine.'}
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
              placeholder="Routine title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CourseSelect
              value={form.courseId}
              onChange={(v) => setForm((prev) => ({ ...prev, courseId: v }))}
            />
            <SubCourseSelect
              value={form.subCourseId}
              onChange={(v) => setForm((prev) => ({ ...prev, subCourseId: v }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="instructorName">Instructor Name</Label>
            <Input
              id="instructorName"
              value={form.instructorName}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  instructorName: e.target.value,
                }))
              }
              placeholder="Instructor name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dayOfWeek">
              Day of Week <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.dayOfWeek}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, dayOfWeek: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              placeholder="Room or venue"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="meetingLink">Meeting Link</Label>
            <Input
              id="meetingLink"
              value={form.meetingLink}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  meetingLink: e.target.value,
                }))
              }
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isOnline"
                checked={form.isOnline}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    isOnline: checked === true,
                  }))
                }
              />
              <Label htmlFor="isOnline" className="cursor-pointer">
                Online
              </Label>
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

export type { RoutineFormData }
