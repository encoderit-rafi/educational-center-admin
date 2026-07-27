import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useGetSubmissionDetail } from "../-api";
import { Loader2, Mail, Phone, MapPin, Calendar, HelpCircle, User } from "lucide-react";
import type { EnglishQuizSubmission } from "../-types";

interface EnglishQuizSubmissionDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId?: string | null;
  submissionData?: EnglishQuizSubmission | null;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="text-sm space-y-1">
      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        <span>{label}</span>
      </div>
      <div className="font-medium text-foreground">{value || "-"}</div>
    </div>
  );
}

function formatDateTime(val: string | null | undefined) {
  if (!val) return "-";
  return new Date(val).toLocaleString();
}

export function EnglishQuizSubmissionDetailsSheet({
  isOpen,
  onOpenChange,
  submissionId,
  submissionData,
}: EnglishQuizSubmissionDetailsSheetProps) {
  const {
    data: fetchedData,
    isLoading,
    isError,
  } = useQuery({
    ...useGetSubmissionDetail(submissionId ?? ""),
    enabled: !!submissionId && isOpen && !submissionData,
  });

  const submission = submissionData ?? fetchedData;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto p-6">
        <SheetHeader className="p-0 pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {submission?.fullName || "Submission Details"}
          </SheetTitle>
          <SheetDescription>
            Full details and responses for this English quiz submission.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {isLoading && !submission ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError && !submission ? (
            <div className="text-center py-20 text-destructive">
              Failed to load submission details.
            </div>
          ) : submission ? (
            <div className="space-y-6">
              <section className="bg-muted/40 rounded-xl p-4 border border-border/50 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Personal Information</span>
                  {submission.followUp && (
                    <Badge variant={submission.followUp.toLowerCase() === 'yes' ? 'default' : 'secondary'}>
                      Follow Up: {submission.followUp}
                    </Badge>
                  )}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <DetailRow icon={User} label="Full Name" value={submission.fullName} />
                  </div>
                  <div className="col-span-2">
                    <DetailRow icon={Mail} label="Email Address" value={submission.email} />
                  </div>
                  <DetailRow icon={Phone} label="Phone Number" value={submission.phone} />
                  <DetailRow icon={MapPin} label="Country" value={submission.country} />
                  <DetailRow icon={MapPin} label="City" value={submission.city} />
                  <DetailRow icon={Calendar} label="Submitted At" value={formatDateTime(submission.createdAt)} />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4" />
                    <span>Questions & Answers ({submission.questions?.length ?? 0})</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {(!submission.questions || submission.questions.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-6 border rounded-lg">
                      No questions recorded in this submission.
                    </p>
                  )}
                  {submission.questions?.map((qa, index) => (
                    <div
                      key={index}
                      className="border border-border/60 bg-card rounded-lg p-3.5 space-y-2 shadow-xs"
                    >
                      <div className="text-sm font-medium leading-relaxed">
                        <span className="text-primary font-semibold mr-1.5">
                          Q{index + 1}:
                        </span>
                        {qa.question}
                      </div>
                      <div className="text-sm flex items-center gap-2 pt-1 border-t border-border/40">
                        <span className="text-xs text-muted-foreground font-medium">Your Answer:</span>
                        <Badge variant="outline" className="font-semibold text-primary bg-primary/5">
                          {qa.answer || "No answer"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No submission data available.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
