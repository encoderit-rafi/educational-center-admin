import { useState, useEffect, useRef } from "react";
import {
  PageBody,
  PageContainer,
  PageHeader,
  PageTitle,
} from "@/components/blocks/app-page";
import { AppTabs } from "@/components/blocks/app-tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
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
import { EnglishTestLevelsTable } from "./-components/english-test-levels-table";
import { EnglishTestLevelFormDialog } from "./-components/english-test-level-form-dialog";
import { EnglishTestLevelDeleteDialog } from "./-components/english-test-level-delete-dialog";
import {
  useGetAttempts,
  useDeleteAttempt,
  useGetLevelDefinitions,
  useCreateLevelDefinition,
  useUpdateLevelDefinition,
  useDeleteLevelDefinition,
} from "./-api";
import { createFileRoute } from "@tanstack/react-router";
import { Search, X, Plus } from "lucide-react";
import { toast } from "sonner";
import type { EnglishLevelDefinition, EnglishTestAttempt } from "./-types";

export const Route = createFileRoute("/_app/english-test/")({
  component: EnglishTestPage,
});

function EnglishTestPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>English Test</PageTitle>
      </PageHeader>
      <PageBody>
        {/*  <AppTabs
          tabs={[
            { value: 'attempts', label: 'Attempts', content: <AttemptsTab /> },
            { value: 'levels', label: 'Level Definitions', content: <LevelsTab /> },
          ]}
        /> */}
        <AttemptsTab />
      </PageBody>
    </PageContainer>
  );
}

function AttemptsTab() {
  const [page, setPage] = useState(1);
  const [sortBy] = useState("createdAt");
  const [sortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const isFirstRender = useRef(true);
  const limit = 20;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, levelFilter]);

  const { data, isLoading, isFetching, isError } = useQuery({
    ...useGetAttempts({
      page,
      limit,
      sortBy,
      sortOrder,
      keyword: debouncedSearch || undefined,
      level: levelFilter || undefined,
    }),
    placeholderData: keepPreviousData,
  });

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const attempts = data?.data ?? [];
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
    <>
      {/* <div className="flex items-center gap-2 pb-4">
        <InputGroup className="w-full max-w-[300px]">
          <InputGroupAddon align="inline-start">
            <Search className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search attempts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="A1">A1</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
            <SelectItem value="C2">C2</SelectItem>
          </SelectContent>
        </Select>
      </div> */}
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
      />
    </>
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
