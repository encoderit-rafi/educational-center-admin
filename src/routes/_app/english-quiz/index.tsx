import { useState, useEffect } from "react";
import {
  PageBody,
  PageContainer,
  PageHeader,
  PageTitle,
} from "@/components/blocks/app-page";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { EnglishQuizSubmissionsTable } from "./-components/english-quiz-submissions-table";
import { EnglishQuizSubmissionDeleteDialog } from "./-components/english-quiz-submission-delete-dialog";
import { EnglishQuizSubmissionDetailsSheet } from "./-components/english-quiz-submission-details-sheet";
import { useGetSubmissions, useDeleteSubmission } from "./-api";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import type { EnglishQuizSubmission } from "./-types";

export const Route = createFileRoute("/_app/english-quiz/")({
  component: EnglishQuizPage,
});

function EnglishQuizPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>English Quiz Submissions</PageTitle>
      </PageHeader>
      <PageBody>
        <SubmissionsTab />
      </PageBody>
    </PageContainer>
  );
}

function SubmissionsTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isFetching, isError } = useQuery({
    ...useGetSubmissions({ page, limit, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const submissions = data?.data ?? [];
  const total = data?.total ?? submissions.length;
  const totalPages = data?.totalPages ?? Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  // Reset to page 1 on search or limit change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, limit]);

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: page,
    totalPages,
    paginationItemsToDisplay: 5,
  });

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsTarget, setDetailsTarget] =
    useState<EnglishQuizSubmission | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<EnglishQuizSubmission | null>(null);
  const deleteMutation = useDeleteSubmission();

  const handleView = (submission: EnglishQuizSubmission) => {
    setDetailsTarget(submission);
    setIsDetailsOpen(true);
  };

  const handleDelete = (submission: EnglishQuizSubmission) => {
    setDeleteTarget(submission);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Submission deleted successfully");
        setIsDeleteOpen(false);
        setDeleteTarget(null);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete submission",
        );
      },
    });
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <Select
              value={limit.toString()}
              onValueChange={(val) => {
                setLimit(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-17.5">
                <SelectValue placeholder={limit.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            Total: <span className="font-semibold text-foreground">{total}</span> submissions
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-destructive font-medium">
            Failed to load submissions
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          {isFetching && (
            <div className="h-1 w-full bg-muted overflow-hidden rounded-full mb-2">
              <div className="h-full w-full bg-primary animate-pulse rounded-full" />
            </div>
          )}
          <EnglishQuizSubmissionsTable
            submissions={submissions}
            onView={handleView}
            onDelete={handleDelete}
          />
          {total > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} total items)
              </p>
              <Pagination className="w-auto mx-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {showLeftEllipsis && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {pages.map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => setPage(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {showRightEllipsis && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
      <EnglishQuizSubmissionDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        submissionId={deleteTarget?.id ?? ""}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
      <EnglishQuizSubmissionDetailsSheet
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        submissionId={detailsTarget?.id}
        submissionData={detailsTarget}
      />
    </div>
  );
}
