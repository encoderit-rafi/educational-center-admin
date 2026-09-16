import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useGetExam } from '../-api'
import {
  Loader2,
  GraduationCap,
  Calendar,
  Clock,
  CreditCard,
  Layers,
  Copy,
  FileText,
  ExternalLink,
  Globe,
  Users,
  CheckCircle2,
  XCircle,
  BookOpen,
  Hash,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Exam, ExamTypeItem } from '../-types'

interface ExamDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  examId?: string | null
  examData?: Exam | null
  courseName?: string | null
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.success('Copied to clipboard')
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatTime(timeStr?: string | null) {
  if (!timeStr) return '-'

  if (/am|pm/i.test(timeStr)) return timeStr

  let hours = 0
  let minutes = 0
  let isValid = false

  if (timeStr.includes('T') || timeStr.includes('Z')) {
    const d = new Date(timeStr)
    if (!isNaN(d.getTime())) {
      hours = d.getUTCHours()
      minutes = d.getUTCMinutes()
      isValid = true
    }
  }

  if (!isValid) {
    const parts = timeStr.split(':')
    if (parts.length >= 2) {
      hours = parseInt(parts[0], 10)
      minutes = parseInt(parts[1], 10)
      if (!isNaN(hours) && !isNaN(minutes)) {
        isValid = true
      }
    }
  }

  if (!isValid) return timeStr

  const period = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12
  const mStr = minutes.toString().padStart(2, '0')
  return `${h12}:${mStr} ${period}`
}

export function ExamDetailsSheet({
  isOpen,
  onOpenChange,
  examId,
  examData,
  courseName,
}: ExamDetailsSheetProps) {
  const targetId = examId || examData?.id || ''

  const { data, isLoading, isError } = useQuery({
    ...useGetExam(targetId),
    enabled: !!targetId && isOpen && !examData,
  })

  const exam = examData ?? data

  const examTypes: ExamTypeItem[] = Array.isArray(exam?.examType)
    ? (exam.examType as ExamTypeItem[])
    : typeof exam?.examType === 'string'
      ? [{ id: '0', name: exam.examType }]
      : []

  const courseTitle =
    exam?.course?.title ||
    exam?.course?.name ||
    courseName ||
    (exam?.courseId ? exam.courseId : null)

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl dark:bg-card p-6 overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Exam Details
          </SheetTitle>
          <SheetDescription>
            View full details and configuration of this exam.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {isLoading && !exam ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading exam details...</p>
            </div>
          ) : isError && !exam ? (
            <div className="text-center py-20 text-destructive font-medium">
              Failed to load exam details.
            </div>
          ) : exam ? (
            <div className="space-y-6">
              {/* Header Title & Status */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {exam.name || 'Untitled Exam'}
                  </h2>
                  {exam.slug && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-mono">
                      <span>/{exam.slug}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(exam.slug!)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="Copy slug"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={exam.isActive ? 'default' : 'destructive'}
                    className="font-semibold flex items-center gap-1"
                  >
                    {exam.isActive ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" /> Inactive
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Exam Types */}
              {examTypes.length > 0 && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Layers className="h-4 w-4 text-primary" /> Exam Type / Categories
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {examTypes.map((t) => (
                      <Badge
                        key={t.id || t.name}
                        variant="secondary"
                        className="px-2.5 py-1 text-xs uppercase font-semibold tracking-wide"
                      >
                        {t.name}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {/* Overview Information */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-primary" /> Overview Information
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Exam ID</div>
                    <div className="font-mono text-xs text-foreground flex items-center gap-2 mt-0.5">
                      <span className="truncate">{exam.id}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(exam.id)}
                        className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                        title="Copy Exam ID"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Course</div>
                    <div className="font-medium text-foreground mt-0.5 truncate">
                      {courseTitle || '-'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> Available Seats
                    </div>
                    <div className="font-semibold text-foreground mt-0.5">
                      {exam.availableSeats ?? 0}
                    </div>
                  </div>

                  {exam.parentId && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">Parent Exam ID</div>
                      <div className="font-mono text-xs text-foreground flex items-center gap-2 mt-0.5">
                        <span className="truncate">{exam.parentId}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(exam.parentId!)}
                          className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                          title="Copy Parent ID"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {exam.orderIndex != null && (
                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Hash className="h-3 w-3" /> Order Index
                      </div>
                      <div className="font-medium text-foreground mt-0.5">
                        {exam.orderIndex}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Created At
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatDate(exam.createdAt)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Updated At
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatDate(exam.updatedAt)}
                    </div>
                  </div>
                </div>
              </section>

              {/* Schedule & Timing */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" /> Schedule & Timing
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border/40">
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Exam Date
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatDate(exam.examDate)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Registration Date
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatDate(exam.registrationDate)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Start Time
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatTime(exam.examStartTime)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> End Time
                    </div>
                    <div className="font-medium text-foreground mt-0.5">
                      {formatTime(exam.examEndTime)}
                    </div>
                  </div>
                </div>
              </section>

              {/* Fees & Pricing Breakdown */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-primary" /> Fee Breakdown
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-muted/30 p-4 rounded-xl border border-border/40 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Exam Fee</div>
                    <div className="font-semibold text-foreground mt-0.5">
                      {exam.examFee != null ? `$${exam.examFee}` : '-'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">USD Exam Fee</div>
                    <div className="font-semibold text-foreground mt-0.5">
                      {exam.usdExamFee != null ? `$${exam.usdExamFee}` : '-'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Additional Fee</div>
                    <div className="font-semibold text-foreground mt-0.5">
                      {exam.additionalFee != null ? `$${exam.additionalFee}` : '-'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">VAT Rate</div>
                    <div className="font-semibold text-foreground mt-0.5">
                      {exam.vatRate != null ? `${exam.vatRate}%` : '0%'}
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-2 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-xs font-medium text-primary uppercase tracking-wider">
                      Total Fee
                    </div>
                    <div className="font-bold text-primary text-lg mt-0.5">
                      {exam.totalFee != null ? `$${exam.totalFee}` : '-'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Exam Form Redirect URL */}
              {exam.examFormRedirectUrl && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <ExternalLink className="h-4 w-4 text-primary" /> Exam Form Redirect URL
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm flex items-center justify-between gap-3">
                    <a
                      href={exam.examFormRedirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs font-mono truncate flex items-center gap-1.5"
                    >
                      {exam.examFormRedirectUrl}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(exam.examFormRedirectUrl!)}
                      className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                      title="Copy URL"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </section>
              )}

              {/* Course Info Card (if nested course is available) */}
              {exam.course && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <BookOpen className="h-4 w-4 text-primary" /> Associated Course
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-foreground">
                          {exam.course.title || exam.course.name}
                        </div>
                        {exam.course.subTitle && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {exam.course.subTitle}
                          </div>
                        )}
                      </div>
                      {exam.course.slug && (
                        <Badge variant="outline" className="font-mono text-xs">
                          /{exam.course.slug}
                        </Badge>
                      )}
                    </div>

                    {(exam.course.logo || exam.course.bannerImage) && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {exam.course.logo && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Logo</div>
                            <img
                              src={exam.course.logo}
                              alt="Course logo"
                              className="max-h-20 rounded-lg border border-border/60 bg-background p-1.5 object-contain"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                        {exam.course.bannerImage && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Banner</div>
                            <img
                              src={exam.course.bannerImage}
                              alt="Course banner"
                              className="max-h-20 rounded-lg border border-border/60 bg-background p-1.5 object-contain"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {exam.course.shortDescription && (
                      <div className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/30">
                        {exam.course.shortDescription}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Description */}
              {exam.description && (
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" /> Description
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/40 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {exam.description}
                  </div>
                </section>
              )}

              {/* Translations */}
              {exam.translations && Object.keys(exam.translations).length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Globe className="h-4 w-4 text-primary" /> Translations
                  </div>
                  <div className="space-y-3">
                    {Object.entries(exam.translations).map(([lang, trans]) => (
                      <div
                        key={lang}
                        className="bg-muted/30 p-4 rounded-xl border border-border/40 space-y-2 text-sm"
                      >
                        <div className="text-xs font-semibold uppercase text-primary">
                          Language: {lang}
                        </div>
                        {trans?.name && (
                          <div>
                            <span className="text-xs text-muted-foreground">Name: </span>
                            <span className="font-medium text-foreground">{trans.name}</span>
                          </div>
                        )}
                        {trans?.description && (
                          <div>
                            <span className="text-xs text-muted-foreground block mb-0.5">
                              Description:
                            </span>
                            <p className="text-foreground whitespace-pre-wrap">
                              {trans.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No exam data found.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
