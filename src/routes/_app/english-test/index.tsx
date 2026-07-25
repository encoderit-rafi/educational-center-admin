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
import { EnglishTestAttemptsTable } from "./-components/english-test-attempts-table";
import { EnglishTestAttemptDeleteDialog } from "./-components/english-test-attempt-delete-dialog";
import { EnglishTestAttemptDetailsSheet } from "./-components/english-test-attempt-details-sheet";

import { useGetAttempts, useDeleteAttempt } from "./-api";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import type { EnglishTestAttempt } from "./-types";

export const Route = createFileRoute("/_app/english-test/")({
  component: EnglishTestPage,
});

function EnglishTestPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>English Test Attempts</PageTitle>
      </PageHeader>
      <PageBody>
        <AttemptsTab />
      </PageBody>
    </PageContainer>
  );
}

function AttemptsTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [sortBy] = useState("createdAt");
  const [sortOrder] = useState("desc");

  const { data, isLoading, isFetching, isError } = useQuery({
    ...useGetAttempts({
      page,
      limit,
      sortBy,
      sortOrder,
      keyword: debouncedSearch || undefined,
      search: debouncedSearch || undefined,
    }),
    placeholderData: keepPreviousData,
  });

  const attempts = data?.data ?? [];
  const total = data?.total ?? attempts.length;
  const totalPages = data?.totalPages ?? Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, limit]);

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: page,
    totalPages,
    paginationItemsToDisplay: 5,
  });

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsTarget, setDetailsTarget] = useState<EnglishTestAttempt | null>(
    null,
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EnglishTestAttempt | null>(
    null,
  );
  const deleteMutation = useDeleteAttempt();

  const handleView = (attempt: EnglishTestAttempt) => {
    setDetailsTarget(attempt);
    setIsDetailsOpen(true);
  };

  const handleDelete = (attempt: EnglishTestAttempt) => {
    setDeleteTarget(attempt);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Attempt deleted successfully");
        setIsDeleteOpen(false);
        setDeleteTarget(null);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete attempt",
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
            Total: <span className="font-semibold text-foreground">{total}</span> attempts
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
            Failed to load attempts
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
          <EnglishTestAttemptsTable
            attempts={attempts}
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
      <EnglishTestAttemptDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        attemptId={deleteTarget?.id ?? ""}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
      <EnglishTestAttemptDetailsSheet
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        attemptId={detailsTarget?.id}
        attemptData={detailsTarget}
      />
    </div>
  );
}

// function LevelsTab() {
//   const { data, isLoading, isError } = useQuery({
//     ...useGetLevelDefinitions(),
//     placeholderData: keepPreviousData,
//   })

//   const [isFormOpen, setIsFormOpen] = useState(false)
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false)
//   const [selectedLevel, setSelectedLevel] = useState<EnglishLevelDefinition | null>(null)
//   const [deleteTarget, setDeleteTarget] = useState<EnglishLevelDefinition | null>(null)

//   const createMutation = useCreateLevelDefinition()
//   const updateMutation = useUpdateLevelDefinition()
//   const deleteMutation = useDeleteLevelDefinition()

//   const levels = data?.data ?? []

//   const handleAddNew = () => {
//     setSelectedLevel(null)
//     setIsFormOpen(true)
//   }

//   const handleEdit = (level: EnglishLevelDefinition) => {
//     setSelectedLevel(level)
//     setIsFormOpen(true)
//   }

//   const handleDelete = (level: EnglishLevelDefinition) => {
//     setDeleteTarget(level)
//     setIsDeleteOpen(true)
//   }

//   const handleConfirmDelete = () => {
//     if (!deleteTarget) return
//     deleteMutation.mutate(deleteTarget.id, {
//       onSuccess: () => {
//         toast.success('Level definition deleted successfully')
//         setIsDeleteOpen(false)
//         setDeleteTarget(null)
//       },
//       onError: (error) => {
//         toast.error(
//           error instanceof Error
//             ? error.message
//             : 'Failed to delete level definition',
//         )
//       },
//     })
//   }

//   const handleSave = (formData: any) => {
//     if (selectedLevel) {
//       updateMutation.mutate(
//         { id: selectedLevel.id, ...formData },
//         {
//           onSuccess: () => {
//             toast.success('Level definition updated successfully')
//             setIsFormOpen(false)
//             setSelectedLevel(null)
//           },
//           onError: (error) => {
//             toast.error(
//               error instanceof Error
//                 ? error.message
//                 : 'Failed to update level definition',
//             )
//           },
//         },
//       )
//       return
//     }

//     createMutation.mutate(formData, {
//       onSuccess: () => {
//         toast.success('Level definition created successfully')
//         setIsFormOpen(false)
//       },
//       onError: (error) => {
//         toast.error(
//           error instanceof Error
//             ? error.message
//             : 'Failed to create level definition',
//         )
//       },
//     })
//   }

//   return (
//     <>
//       <div className="flex justify-end pb-4">
//         <Button onClick={handleAddNew}>
//           <Plus className="h-4 w-4" />
//           Add Level
//         </Button>
//       </div>
//       {isLoading ? (
//         <div className="flex items-center justify-center py-20">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
//         </div>
//       ) : isError ? (
//         <div className="flex flex-col items-center justify-center py-20 text-center">
//           <p className="text-destructive font-medium">
//             Failed to load level definitions
//           </p>
//           <Button
//             variant="outline"
//             className="mt-4"
//             onClick={() => window.location.reload()}
//           >
//             Retry
//           </Button>
//         </div>
//       ) : (
//         <EnglishTestLevelsTable
//           levels={levels}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       )}
//       <EnglishTestLevelFormDialog
//         isOpen={isFormOpen}
//         onOpenChange={setIsFormOpen}
//         level={selectedLevel}
//         onSave={handleSave}
//         isPending={createMutation.isPending || updateMutation.isPending}
//       />
//       <EnglishTestLevelDeleteDialog
//         isOpen={isDeleteOpen}
//         onOpenChange={setIsDeleteOpen}
//         levelLabel={deleteTarget?.label ?? ''}
//         onConfirm={handleConfirmDelete}
//         isPending={deleteMutation.isPending}
//       />
//     </>
//   )
// }
