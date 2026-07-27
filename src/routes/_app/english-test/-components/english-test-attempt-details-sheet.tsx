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
import {
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  HelpCircle,
  User,
  Award,
  Clock,
} from "lucide-react";
import type { EnglishTestAttempt } from "../-types";

interface EnglishTestAttemptDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  attemptId?: string | null;
  attemptData?: EnglishTestAttempt | null;
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

export function EnglishTestAttemptDetailsSheet({
  isOpen,
  onOpenChange,
  attemptId,
  attemptData,
}: EnglishTestAttemptDetailsSheetProps) {
  const {
    data: fetchedData,
    isLoading,
    isError,
  } = useQuery({
    ...useGetAttemptDetail(attemptId ?? ""),
    enabled: !!attemptId && isOpen,
  });
  console.log(
    "👉 ~ EnglishTestAttemptDetailsSheet ~ fetchedData:",
    fetchedData,
  );

  const apiAttempt = fetchedData?.attempt;
  const attempt = attemptData;

  const firstName =
    attempt?.firstName || attempt?.first_name || apiAttempt?.first_name || "";
  const lastName =
    attempt?.lastName || attempt?.last_name || apiAttempt?.last_name || "";
  const fullName =
    attempt?.fullName ||
    attempt?.full_name ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    "Attempt Details";

  const email = attempt?.email || apiAttempt?.email;
  const phone = attempt?.phone || apiAttempt?.phone;
  const country = attempt?.country || apiAttempt?.country;
  const city = attempt?.city || apiAttempt?.city;
  const address = attempt?.address || apiAttempt?.address;

  const preferredContactMethod =
    attempt?.preferredContactMethod ||
    attempt?.preferred_contact_method ||
    apiAttempt?.preferred_contact_method;
  const preferredTimeToContactYou =
    attempt?.preferredTimeToContactYou ||
    attempt?.preferred_time_to_contact_you ||
    apiAttempt?.preferred_time_to_contact_you;

  const totalScore =
    attempt?.totalScore ??
    attempt?.total_score ??
    attempt?.score ??
    apiAttempt?.total_score ??
    0;
  const startedAt =
    attempt?.startedAt || attempt?.started_at || apiAttempt?.started_at;
  const submittedAt =
    attempt?.submittedAt || attempt?.submitted_at || apiAttempt?.submitted_at;
  const pdfUrl = attempt?.pdfUrl || attempt?.pdf_url || apiAttempt?.pdf_url;

  const levelLabel =
    typeof attempt?.englishLevel === "object" && attempt?.englishLevel !== null
      ? attempt.englishLevel.label || attempt.englishLevel.levelCode
      : typeof attempt?.englishLevel === "string"
        ? attempt.englishLevel
        : attempt?.level || fetchedData?.english_level?.label || null;

  const directAnswers = attempt?.answers ?? [];
  const qAndA = fetchedData?.questions_and_answers ?? [];
  console.log("👉 ~ EnglishTestAttemptDetailsSheet ~ qAndA:", qAndA);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg dark:bg-card overflow-y-auto p-6">
        <SheetHeader className="p-0 pb-4 border-b border-border">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {fullName}
          </SheetTitle>
          <SheetDescription>
            Full test attempt details, score breakdown, and questions & answers.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {isLoading && !attempt ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError && !attempt ? (
            <div className="text-center py-20 text-destructive">
              Failed to load attempt details.
            </div>
          ) : (
            <div className="space-y-6">
              <section className="bg-muted/40 rounded-xl p-4 border border-border/50 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow icon={User} label="Full Name" value={fullName} />
                  <DetailRow icon={Mail} label="Email Address" value={email} />
                  <DetailRow icon={Phone} label="Phone Number" value={phone} />
                  <DetailRow icon={MapPin} label="Country" value={country} />
                  <DetailRow icon={MapPin} label="City" value={city} />
                  {address && (
                    <DetailRow icon={MapPin} label="Address" value={address} />
                  )}
                </div>
              </section>

              {(preferredContactMethod || preferredTimeToContactYou) && (
                <section className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contact Preferences
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailRow
                      icon={Phone}
                      label="Preferred Method"
                      value={preferredContactMethod}
                    />
                    <DetailRow
                      icon={Clock}
                      label="Preferred Time"
                      value={preferredTimeToContactYou}
                    />
                  </div>
                </section>
              )}

              <section className="bg-primary/5 rounded-xl p-4 border border-primary/20 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Award className="h-4 w-4" />
                  <span>Test Results</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Total Score
                    </div>
                    <div className="text-2xl font-bold text-primary mt-0.5">
                      {totalScore}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        pts
                      </span>
                    </div>
                  </div>
                  {levelLabel && (
                    <div>
                      <div className="text-xs text-muted-foreground">
                        English Level
                      </div>
                      <Badge
                        variant="outline"
                        className="mt-1 font-semibold text-primary bg-primary/10 border-primary/30"
                      >
                        {levelLabel}
                      </Badge>
                    </div>
                  )}
                  <DetailRow
                    icon={Calendar}
                    label="Started At"
                    value={formatDateTime(startedAt)}
                  />
                  <DetailRow
                    icon={Calendar}
                    label="Submitted At"
                    value={formatDateTime(submittedAt)}
                  />
                  {pdfUrl && (
                    <div className="col-span-2">
                      <DetailRow label="PDF Result URL" value={pdfUrl} />
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4" />
                    <span>
                      Questions & Answers (
                      {qAndA.length || directAnswers.length})
                    </span>
                  </h3>
                  {isLoading && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  )}
                </div>

                <div className="space-y-3">
                  {qAndA.length > 0 ? (
                    qAndA.map((qa, index) => (
                      <div
                        key={qa.question_id || index}
                        className="border border-border/60 bg-card rounded-lg p-3.5 space-y-2 shadow-xs"
                      >
                        <div className="text-sm font-medium leading-relaxed">
                          <span className="text-primary font-semibold mr-1.5">
                            Q{index + 1}:
                          </span>
                          {qa.question_text}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="font-medium">{qa.skill_area}</span>
                          <span>
                            {qa.marks} {qa.marks === 1 ? "mark" : "marks"}
                          </span>
                        </div>
                        <div className="text-sm flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                          <span className="text-xs text-muted-foreground font-medium">
                            Your Answer:
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              "font-semibold " +
                              (qa.selected_option
                                ? qa.is_correct === true
                                  ? "bg-green-50 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                                  : qa.is_correct === false
                                    ? "bg-red-50 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
                                    : "text-primary bg-primary/5"
                                : "text-muted-foreground bg-muted/50")
                            }
                          >
                            {qa.selected_option_text || "Not answered"}
                          </Badge>
                          {/* <span className="text-xs text-muted-foreground">
                            Correct:{" "}
                            <span className="font-medium text-foreground">
                              {qa.correct_option_text} ({qa.correct_option})
                            </span>
                          </span> */}
                          {qa.is_correct === true && (
                            <Badge variant="success" className="ml-auto">
                              Correct
                            </Badge>
                          )}
                          {qa.is_correct === false && (
                            <Badge className="ml-auto">Incorrect</Badge>
                          )}
                          {qa.is_correct === null && (
                            <Badge variant="secondary" className="ml-auto">
                              Pending
                            </Badge>
                          )}
                        </div>
                        {qa.options && qa.options.length > 0 && (
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {qa.options.map((opt) => (
                              <div
                                key={opt.key}
                                className={
                                  "text-xs px-2 py-1 rounded border " +
                                  (opt.key === qa.correct_option
                                    ? "border-green-300 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 dark:border-green-800 font-medium"
                                    : opt.key === qa.selected_option
                                      ? "border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
                                      : "border-border/60 text-muted-foreground")
                                }
                              >
                                {opt.key}. {opt.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : directAnswers.length > 0 ? (
                    directAnswers.map((ans: any, index) => {
                      const questionText =
                        ans.question?.question ||
                        ans.question?.text ||
                        ans.questionText ||
                        ans.question_text ||
                        `Question #${index + 1}`;

                      const answerDisplay =
                        typeof ans === "string"
                          ? ans
                          : (ans.selected_option_text ??
                            ans.selected_option ??
                            ans.answer_text ??
                            ans.answerText ??
                            ans.text ??
                            (typeof ans.answer === "string"
                              ? ans.answer
                              : (ans.answer?.text ??
                                ans.answer?.label ??
                                "Not answered")));

                      const correctDisplay =
                        ans.correct_option_text ??
                        ans.correct_answer_text ??
                        ans.correct_answer ??
                        ans.correct_option ??
                        "";

                      return (
                        <div
                          key={ans.id || index}
                          className="border border-border/60 bg-card rounded-lg p-3.5 space-y-2 shadow-xs"
                        >
                          <div className="text-sm font-medium leading-relaxed">
                            <span className="text-primary font-semibold mr-1.5">
                              Q{index + 1}:
                            </span>
                            {questionText}
                          </div>
                          <div className="text-sm flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                            <span className="text-xs text-muted-foreground font-medium">
                              Your Answer:
                            </span>
                            <Badge
                              variant="outline"
                              className="font-semibold text-primary bg-primary/5"
                            >
                              {answerDisplay}
                            </Badge>
                            {correctDisplay && (
                              <span className="text-xs text-muted-foreground">
                                Correct:{" "}
                                <span className="font-medium text-foreground">
                                  {correctDisplay}
                                </span>
                              </span>
                            )}
                            {ans.isCorrect === true && (
                              <Badge variant="default" className="ml-auto">
                                Correct
                              </Badge>
                            )}
                            {ans.isCorrect === false && (
                              <Badge variant="destructive" className="ml-auto">
                                Incorrect
                              </Badge>
                            )}
                            {ans.isCorrect === null && (
                              <Badge variant="secondary" className="ml-auto">
                                Pending
                              </Badge>
                            )}
                          </div>
                          {ans.options && ans.options.length > 0 && (
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              {ans.options.map((opt: any) => (
                                <div
                                  key={opt.key}
                                  className={
                                    "text-xs px-2 py-1 rounded border " +
                                    (opt.key ===
                                    (ans.correct_option ?? ans.correctOption)
                                      ? "border-green-300 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 dark:border-green-800 font-medium"
                                      : opt.key ===
                                          (ans.selected_option ??
                                            ans.selectedOption)
                                        ? "border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
                                        : "border-border/60 text-muted-foreground")
                                  }
                                >
                                  {opt.key}. {opt.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : isLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6 border rounded-lg">
                      No answers recorded for this attempt.
                    </p>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
