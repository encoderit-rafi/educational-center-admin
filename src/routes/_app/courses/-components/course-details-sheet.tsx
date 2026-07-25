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
import { Loader2, Copy, BookOpen, Layers, Package, GraduationCap, ExternalLink, Image as ImageIcon } from 'lucide-react'
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
      <SheetContent className="sm:max-w-2xl dark:bg-card p-6 overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold">Course Details</SheetTitle>
          <SheetDescription>
            View full details and linked options of the course.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading course details...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Failed to load course details.
            </div>
          ) : course ? (
            <div className="space-y-6">
              {/* Status Header */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{course.title as string ?? 'Course'}</h2>
                  {course.subTitle ? (
                    <p className="text-xs text-muted-foreground mt-0.5">{course.subTitle as string}</p>
                  ) : null}
                </div>
                <Badge variant={course.isActive as boolean ? 'success' : 'destructive'} className="font-semibold">
                  {course.isActive as boolean ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Media Section */}
              {(course.logo || course.bannerImage) ? (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <ImageIcon className="h-4 w-4 text-primary" /> Media Assets
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/40">
                    {course.logo ? (
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Logo</div>
                        <img
                          src={course.logo as string}
                          alt="Course logo"
                          className="max-h-24 rounded-lg border border-border/60 bg-background p-2 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                    ) : null}
                    {course.bannerImage ? (
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Banner Image</div>
                        <img
                          src={course.bannerImage as string}
                          alt="Course banner"
                          className="max-h-24 rounded-lg border border-border/60 bg-background p-2 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {/* Course Overview Information */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-primary" /> Overview Information
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Course ID</div>
                    <div className="font-mono text-xs text-foreground flex items-center gap-2 mt-0.5">
                      <span>{course.id as string}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(course.id as string)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Slug</div>
                    <div className="font-mono text-xs text-foreground">{course.slug as string ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Status</div>
                    <Badge variant={course.isActive as boolean ? 'success' : 'destructive'} className="mt-0.5">
                      {course.isActive as boolean ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {course.websiteUrl ? (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">Website URL</div>
                      <a
                        href={course.websiteUrl as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium text-xs flex items-center gap-1 mt-0.5 truncate"
                      >
                        {course.websiteUrl as string}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : null}
                  <div>
                    <div className="text-xs text-muted-foreground">Created At</div>
                    <div className="font-medium text-foreground">{new Date(course.createdAt as string).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Updated At</div>
                    <div className="font-medium text-foreground">{new Date(course.updatedAt as string).toLocaleDateString()}</div>
                  </div>
                </div>
              </section>

              {/* Descriptions */}
              {course.shortDescription ? (
                <section className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Short Description
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {course.shortDescription as string}
                  </div>
                </section>
              ) : null}

              {course.description ? (
                <section className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Full Description
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm text-foreground">
                    {renderHtml(course.description as string)}
                  </div>
                </section>
              ) : null}

              {/* Key Benefits */}
              {Array.isArray(course.keyBenefits) && (course.keyBenefits as unknown[]).length > 0 && (
                <section className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Benefits
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40">
                    <ul className="list-disc list-inside text-sm text-foreground space-y-1">
                      {(course.keyBenefits as string[]).map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Sub Courses */}
              {Array.isArray(course.sub_courses) && (course.sub_courses as unknown[]).length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Layers className="h-4 w-4 text-primary" />
                    Sub Courses ({(course.sub_courses as unknown[]).length})
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {(course.sub_courses as Array<Record<string, unknown>>).map((sc) => (
                      <div key={sc.id as string} className="bg-muted/30 p-3.5 rounded-xl border border-border/40 flex items-center justify-between text-sm">
                        <div>
                          <p className="font-semibold text-foreground">{sc.title as string ?? sc.name as string}</p>
                          <p className="text-xs text-muted-foreground font-mono">{sc.slug as string}</p>
                        </div>
                        <span className="font-bold text-primary">
                          {sc.price != null ? `$${sc.price}` : '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Packages */}
              {Array.isArray(course.packages) && (course.packages as unknown[]).length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Package className="h-4 w-4 text-primary" />
                    Packages ({(course.packages as unknown[]).length})
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {(course.packages as Array<Record<string, unknown>>).map((pkg) => (
                      <div key={pkg.id as string} className="bg-muted/30 p-3.5 rounded-xl border border-border/40 flex items-center justify-between text-sm">
                        <span className="font-semibold text-foreground">{pkg.name as string}</span>
                        <span className="font-bold text-primary">
                          {pkg.price != null ? `$${pkg.price}` : '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Exams */}
              {Array.isArray(course.exams) && (course.exams as unknown[]).length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Exams ({(course.exams as unknown[]).length})
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {(course.exams as Array<Record<string, unknown>>).map((exam) => (
                      <div key={exam.id as string} className="bg-muted/30 p-3.5 rounded-xl border border-border/40 flex items-center justify-between text-sm">
                        <span className="font-semibold text-foreground">{exam.title as string}</span>
                        <Badge variant="outline" className="text-xs">
                          {exam.type as string ?? 'EXAM'}
                        </Badge>
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
