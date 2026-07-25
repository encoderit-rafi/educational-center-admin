import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { useGetCareer } from '../-api'
import type { CareerApplication } from '../-types'
import { Loader2, FileText, Download } from 'lucide-react'

interface CareerDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  careerId?: string | null
  careerData?: CareerApplication | null
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

export function CareerDetailsSheet({
  isOpen,
  onOpenChange,
  careerId,
  careerData,
}: CareerDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetCareer(careerId ?? ''),
    enabled: !!careerId && isOpen && !careerData,
  })

  const career = careerData ?? data

  const fullName = career
    ? [career.firstName, career.middleName, career.lastName]
        .filter(Boolean)
        .join(' ') || 'N/A'
    : 'N/A'

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Applicant Details</SheetTitle>
          <SheetDescription>
            View full details of the career application.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          {isLoading && !careerData ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError && !careerData ? (
            <div className="text-center py-20 text-destructive">
              Failed to load applicant details.
            </div>
          ) : career ? (
            <div className="space-y-6">
              {/* Personal Information */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/40 p-3 rounded-lg">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Full Name</div>
                    <div className="font-semibold text-base">{fullName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Gender</div>
                    <div className="font-medium capitalize">{career.gender || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Date of Birth</div>
                    <div className="font-medium">{formatDate(career.dob)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Nationality</div>
                    <div className="font-medium uppercase">{career.nationality || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Applied Date</div>
                    <div className="font-medium">{formatDate(career.createdAt)}</div>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Contact Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/40 p-3 rounded-lg">
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="font-medium truncate" title={career.email || ''}>
                      {career.email ? (
                        <a
                          href={`mailto:${career.email}`}
                          className="text-primary hover:underline"
                        >
                          {career.email}
                        </a>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Mobile Phone</div>
                    <div className="font-medium">{career.mobile || '-'}</div>
                  </div>
                </div>
              </section>

              {/* Address Details */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Address Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/40 p-3 rounded-lg">
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Address</div>
                    <div className="font-medium">{career.address || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">City</div>
                    <div className="font-medium">{career.city || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">PO Box</div>
                    <div className="font-medium">{career.pobox || '-'}</div>
                  </div>
                </div>
              </section>

              {/* Resume / Document */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resume / CV Document
                </h3>
                <div className="bg-muted/40 p-4 rounded-lg flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Applicant Resume</p>
                      <p className="text-xs text-muted-foreground">
                        {career.resume
                          ? career.resume.split('/').pop() || 'Resume Document'
                          : 'No resume attached'}
                      </p>
                    </div>
                  </div>
                  {career.resume ? (
                    <Button asChild size="sm" variant="default" className="gap-1.5">
                      <a
                        href={career.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      No File
                    </Button>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No applicant data found.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
