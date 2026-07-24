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
import { usePagination } from "@/hooks/use-pagination";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { EnglishQuizSubmissionsTable } from "./-components/english-quiz-submissions-table";
import { EnglishQuizSubmissionDeleteDialog } from "./-components/english-quiz-submission-delete-dialog";
import { EnglishQuizSubmissionDetailsSheet } from "./-components/english-quiz-submission-details-sheet";
import { useGetSubmissions, useDeleteSubmission } from "./-api";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import type { EnglishQuizSubmission } from "./-types";

export const Route = createFileRoute("/_app/english-quiz/")({
  component: EnglishQuizPage,
});

function EnglishQuizPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>English Quiz</PageTitle>
      </PageHeader>
      <PageBody>
        <SubmissionsTab />
      </PageBody>
    </PageContainer>
  );
}

function SubmissionsTab() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isFetching, isError } = useQuery({
    ...useGetSubmissions({ page, limit }),
    placeholderData: keepPreviousData,
  });

  const submissions = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    if (data && page > data.totalPages && data.totalPages > 0) {
      setPage(data.totalPages);
    }
  }, [data?.totalPages]);

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
    <>
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
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
      />
    </>
  );
}
