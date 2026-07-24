import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useGetAttemptDetail } from "../-api";
import { Loader2 } from "lucide-react";

interface EnglishTestAttemptDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  attemptId?: string | null;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="text-sm">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{value ?? "-"}</div>
    </div>
  );
}

function formatDate(val: string | null | undefined) {
  if (!val) return "-";
  return new Date(val).toLocaleDateString();
}

function formatDateTime(val: string | null | undefined) {
  if (!val) return "-";
  return new Date(val).toLocaleString();
}

export function EnglishTestAttemptDetailsSheet({
  isOpen,
  onOpenChange,
  attemptId,
}: EnglishTestAttemptDetailsSheetProps) {
  const { data, isLoading, isError } = useQuery({
    ...useGetAttemptDetail(attemptId ?? ""),
    enabled: !!attemptId && isOpen,
  });

  const attempt = data?.attempt;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto p-4">
        <SheetHeader className="p-0 pb-4 border-b border-muted">
          <SheetTitle>Attempt Details</SheetTitle>
          <SheetDescription>
            View full details of the English test attempt.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Failed to load attempt details.
            </div>
          ) : attempt ? (
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="First Name" value={attempt.first_name} />
                  <DetailRow label="Middle Name" value={attempt.middle_name} />
                  <DetailRow label="Last Name" value={attempt.last_name} />
                  <div className="col-span-2">
                    <DetailRow label="Email" value={attempt.email} />
                  </div>
                  <DetailRow label="Phone" value={attempt.phone} />
                  <DetailRow label="Country" value={attempt.country} />
                  <div className="col-span-2">
                    <DetailRow label="City" value={attempt.city} />
                  </div>
                  <div className="col-span-2">
                    <DetailRow label="Address" value={attempt.address} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Contact Preferences
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow
                    label="Preferred Contact Method"
                    value={attempt.preferred_contact_method}
                  />
                  <DetailRow
                    label="Preferred Time"
                    value={attempt.preferred_time_to_contact_you}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Test Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow
                    label="Total Score"
                    value={attempt.total_score?.toString() ?? "0"}
                  />
                  {data?.english_level && (
                    <div>
                      <div className="text-muted-foreground text-sm">
                        English Level
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {data.english_level.label}
                      </Badge>
                    </div>
                  )}
                  <DetailRow
                    label="Started At"
                    value={formatDateTime(attempt.started_at)}
                  />
                  <DetailRow
                    label="Submitted At"
                    value={formatDateTime(attempt.submitted_at)}
                  />
                  <div className="col-span-2">
                    <DetailRow label="PDF URL" value={attempt.pdf_url} />
                  </div>
                </div>
              </section>

              {data?.questions_and_answers &&
                data.questions_and_answers.length > 0 && (
                  <section className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Questions & Answers
                    </h3>
                    <div className="space-y-3">
                      {data.questions_and_answers.map((qa) => (
                        <div
                          key={qa.question_id}
                          className="border rounded-md p-3 space-y-2"
                        >
                          <div className="text-sm font-medium">
                            {qa.question_text}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Answer:{" "}
                            </span>
                            {qa.answer_text ?? (
                              <span className="italic text-muted-foreground">
                                No answer
                              </span>
                            )}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Correct Answer:{" "}
                            </span>
                            {qa.correct_answer}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                qa.is_correct ? "default" : "destructive"
                              }
                            >
                              {qa.is_correct ? "Correct" : "Incorrect"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Score: {qa.score}/{qa.max_score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Metadata
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow
                    label="Created At"
                    value={formatDateTime(attempt.created_at)}
                  />
                  <DetailRow
                    label="Updated At"
                    value={formatDateTime(attempt.updated_at)}
                  />
                </div>
              </section>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No attempt data found.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
