import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useGetCourse } from '../-api'
import { Loader2, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface CourseDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  courseId?: string | null
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.success('Copied to clipboard')
}

function renderHtml(content: string) {
  return <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
}

export function CourseDetailsSheet({
  isOpen,
  onOpenChange,
  courseId,
}: CourseDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetCourse(courseId ?? ''),
    enabled: !!courseId && isOpen,
  })

  const course = data as Record<string, unknown> | undefined

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card overflow-y-auto">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Course Details</SheetTitle>
          <SheetDescription>
            View full details of the course.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Failed to load course details.
            </div>
          ) : course ? (
            <div className="space-y-6">
              {/* Images */}
              {(course.logo || course.bannerImage) ? (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Media
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {course.logo ? (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Logo</div>
                        <img
                          src={course.logo as string}
                          alt="Course logo"
                          className="max-h-24 rounded border object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                    ) : null}
                    {course.bannerImage ? (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Banner Image</div>
                        <img
                          src={course.bannerImage as string}
                          alt="Course banner"
                          className="max-h-24 rounded border object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {/* Course Information */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Course Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <div className="text-muted-foreground">ID</div>
                    <div className="font-mono text-xs flex items-center gap-2">
                      {course.id as string}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(course.id as string)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Title</div>
                    <div className="font-medium">{course.title as string ?? '-'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Sub Title</div>
                    <div className="font-medium">{course.subTitle as string ?? '-'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Slug</div>
                    <div className="font-mono text-xs">{course.slug as string ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <Badge variant={course.isActive as boolean ? 'default' : 'destructive'}>
                      {course.isActive as boolean ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {course.websiteUrl ? (
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Website URL</div>
                      <div className="font-medium truncate">
                        {course.websiteUrl as string}
                      </div>
                    </div>
                  ) : null}
                  <div>
                    <div className="text-muted-foreground">Created At</div>
                    <div className="font-medium">
                      {new Date(course.createdAt as string).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Updated At</div>
                    <div className="font-medium">
                      {new Date(course.updatedAt as string).toLocaleString()}
                    </div>
                  </div>
                </div>
              </section>

              {/* Short Description */}
              {course.shortDescription ? (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Short Description
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {course.shortDescription as string}
                  </p>
                </section>
              ) : null}

              {/* Description */}
              {course.description ? (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {renderHtml(course.description as string)}
                  </div>
                </section>
              ) : null}

              {/* Key Benefits */}
              {Array.isArray(course.keyBenefits) && (course.keyBenefits as unknown[]).length > 0 && (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Benefits
                  </h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {(course.keyBenefits as string[]).map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Focus Areas */}
              {Array.isArray(course.focusArea) && (course.focusArea as unknown[]).length > 0 && (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Focus Areas
                  </h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {(course.focusArea as string[]).map((area, i) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Test Date Content */}
              {course.testDateContent ? (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Test Date Content
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {renderHtml(course.testDateContent as string)}
                  </div>
                </section>
              ) : null}

              {/* Test Registration Content */}
              {course.testRegistrationContent ? (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Test Registration Content
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {renderHtml(course.testRegistrationContent as string)}
                  </div>
                </section>
              ) : null}

              {/* Sub Courses */}
              {Array.isArray(course.sub_courses) && (course.sub_courses as unknown[]).length > 0 && (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Sub Courses ({((course.sub_courses as unknown[]).length)})
                  </h3>
                  <div className="space-y-2">
                    {(course.sub_courses as Array<Record<string, unknown>>).map((sc) => (
                      <div key={sc.id as string} className="border rounded-md p-3 text-sm">
                        <div className="font-medium">{sc.title as string ?? sc.name as string}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {sc.slug as string} — {sc.price != null ? `${sc.price} Tk` : '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Packages */}
              {Array.isArray(course.packages) && (course.packages as unknown[]).length > 0 && (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Packages ({((course.packages as unknown[]).length)})
                  </h3>
                  <div className="space-y-2">
                    {(course.packages as Array<Record<string, unknown>>).map((pkg) => (
                      <div key={pkg.id as string} className="border rounded-md p-3 text-sm">
                        <div className="font-medium">{pkg.name as string}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {pkg.price != null ? `${pkg.price} Tk` : '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Exams */}
              {Array.isArray(course.exams) && (course.exams as unknown[]).length > 0 && (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Exams ({((course.exams as unknown[]).length)})
                  </h3>
                  <div className="space-y-2">
                    {(course.exams as Array<Record<string, unknown>>).map((exam) => (
                      <div key={exam.id as string} className="border rounded-md p-3 text-sm">
                        <div className="font-medium">{exam.title as string}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {exam.type as string ?? '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No course data found.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
