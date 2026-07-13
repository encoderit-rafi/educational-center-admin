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
import { FileUpload } from '@/components/blocks/file-upload'
import { Loader2, Plus, X } from 'lucide-react'
import type { Course } from '../-types'

interface CourseFormData {
  title: string
  sub_title: string
  short_description: string
  description: string
  test_date_content: string
  test_registration_content: string
  website_url: string
  logo: string
  banner_image: string
  key_benefits: string[]
  focus_area: string[]
  is_active: boolean
  translations: {
    ar: {
      title: string
      sub_title: string
      short_description: string
      description: string
    }
  }
}

interface CourseFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  course?: Course | null
  onSave: (data: CourseFormData) => void
  isPending?: boolean
}

const emptyForm: CourseFormData = {
  title: '',
  sub_title: '',
  short_description: '',
  description: '',
  test_date_content: '',
  test_registration_content: '',
  website_url: '',
  logo: '',
  banner_image: '',
  key_benefits: [],
  focus_area: [],
  is_active: true,
  translations: {
    ar: {
      title: '',
      sub_title: '',
      short_description: '',
      description: '',
    },
  },
}

export function CourseFormDialog({
  isOpen,
  onOpenChange,
  course,
  onSave,
  isPending,
}: CourseFormDialogProps) {
  const [form, setForm] = useState<CourseFormData>(emptyForm)

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title ?? '',
        sub_title: course.subTitle ?? '',
        short_description: course.shortDescription ?? '',
        description: course.description ?? '',
        test_date_content: course.testDateContent ?? '',
        test_registration_content: course.testRegistrationContent ?? '',
        website_url: course.websiteUrl ?? '',
        logo: course.logo ?? '',
        banner_image: course.bannerImage ?? '',
        key_benefits: Array.isArray(course.keyBenefits) ? course.keyBenefits.map(String) : [],
        focus_area: Array.isArray(course.focusArea) ? course.focusArea.map(String) : [],
        is_active: course.isActive,
        translations: {
          ar: {
            title: course.translations?.ar?.title ?? '',
            sub_title: course.translations?.ar?.sub_title ?? '',
            short_description: course.translations?.ar?.short_description ?? '',
            description: course.translations?.ar?.description ?? '',
          },
        },
      })
    } else {
      setForm(emptyForm)
    }
  }, [course, isOpen])

  const isEditing = !!course
  const isValid = form.title.trim() && form.sub_title.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSave(form)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card overflow-y-auto">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle>{isEditing ? 'Edit Course' : 'Create Course'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the course details.'
              : 'Enter the details for the new course.'}
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
              placeholder="Course title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ar_title">Arabic Title</Label>
            <Input
              id="ar_title"
              value={form.translations.ar.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  translations: {
                    ...prev.translations,
                    ar: {
                      ...prev.translations.ar,
                      title: e.target.value,
                    },
                  },
                }))
              }
              placeholder="عنوان الدورة"
              dir="rtl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sub_title">
              Sub Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sub_title"
              value={form.sub_title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, sub_title: e.target.value }))
              }
              placeholder="Course sub title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ar_sub_title">Arabic Sub Title</Label>
            <Input
              id="ar_sub_title"
              value={form.translations.ar.sub_title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  translations: {
                    ...prev.translations,
                    ar: {
                      ...prev.translations.ar,
                      sub_title: e.target.value,
                    },
                  },
                }))
              }
              placeholder="العنوان الفرعي للدورة"
              dir="rtl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea
              id="short_description"
              value={form.short_description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  short_description: e.target.value,
                }))
              }
              placeholder="Brief summary of the course"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ar_short_description">Arabic Short Description</Label>
            <Textarea
              id="ar_short_description"
              value={form.translations.ar.short_description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  translations: {
                    ...prev.translations,
                    ar: {
                      ...prev.translations.ar,
                      short_description: e.target.value,
                    },
                  },
                }))
              }
              placeholder="نبذة مختصرة عن الدورة"
              rows={2}
              dir="rtl"
            />
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
              placeholder="Full course description"
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ar_description">Arabic Description</Label>
            <Textarea
              id="ar_description"
              value={form.translations.ar.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  translations: {
                    ...prev.translations,
                    ar: {
                      ...prev.translations.ar,
                      description: e.target.value,
                    },
                  },
                }))
              }
              placeholder="وصف الدورة"
              rows={4}
              dir="rtl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="test_date_content">Test Date Content</Label>
            <Textarea
              id="test_date_content"
              value={form.test_date_content}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  test_date_content: e.target.value,
                }))
              }
              placeholder="Test date information"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="test_registration_content">
              Test Registration Content
            </Label>
            <Textarea
              id="test_registration_content"
              value={form.test_registration_content}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  test_registration_content: e.target.value,
                }))
              }
              placeholder="Test registration information"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              value={form.website_url}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  website_url: e.target.value,
                }))
              }
              placeholder="https://example.com/course"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Logo</Label>
              <FileUpload
                value={form.logo}
                onChange={(url) =>
                  setForm((prev) => ({ ...prev, logo: url }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Banner Image</Label>
              <FileUpload
                value={form.banner_image}
                onChange={(url) =>
                  setForm((prev) => ({ ...prev, banner_image: url }))
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Key Benefits</Label>
            <div className="space-y-2">
              {form.key_benefits.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      setForm((prev) => {
                        const next = [...prev.key_benefits]
                        next[index] = e.target.value
                        return { ...prev, key_benefits: next }
                      })
                    }
                    placeholder={`Benefit ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        key_benefits: prev.key_benefits.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    key_benefits: [...prev.key_benefits, ''],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Benefit
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Focus Areas</Label>
            <div className="space-y-2">
              {form.focus_area.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      setForm((prev) => {
                        const next = [...prev.focus_area]
                        next[index] = e.target.value
                        return { ...prev, focus_area: next }
                      })
                    }
                    placeholder={`Focus area ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        focus_area: prev.focus_area.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    focus_area: [...prev.focus_area, ''],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Focus Area
              </Button>
            </div>
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

export type { CourseFormData }
