import { useState, useEffect, useRef } from 'react'
import {
  PageBody,
  PageContainer,
  PageHeader,
  PageTitle,
} from '@/components/blocks/app-page'
import { AppTabs } from '@/components/blocks/app-tabs'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePagination } from '@/hooks/use-pagination'
import { useDebounce } from '@/hooks/use-debounce'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { ExamsTable } from './-components/exams-table'
import { ExamFormDialog } from './-components/exam-form-dialog'
import { ExamDeleteDialog } from './-components/exam-delete-dialog'
import { ExamTestSchedulesTable } from './-components/exam-test-schedules-table'
import { ExamTestScheduleFormDialog } from './-components/exam-test-schedule-form-dialog'
import { ExamTestScheduleDeleteDialog } from './-components/exam-test-schedule-delete-dialog'
import {
  useGetExams,
  useCreateExam,
  useUpdateExam,
  useDeleteExam,
  useArrangeExams,
  useGetTestSchedules,
  useCreateTestSchedule,
  useUpdateTestSchedule,
  useDeleteTestSchedule,
} from './-api'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Exam, TestSchedule } from './-types'

export const Route = createFileRoute('/_app/exams/')({
  component: ExamsPage,
})

function ExamsPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Exams</PageTitle>
      </PageHeader>
      <PageBody>
        <AppTabs
          tabs={[
            { value: 'exams', label: 'Exams', content: <ExamsTab /> },
            { value: 'test-schedules', label: 'Test Schedules', content: <TestSchedulesTab /> },
          ]}
        />
      </PageBody>
    </PageContainer>
  )
}

function ExamsTab() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('orderIndex')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [limit, setLimit] = useState(20)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setPage(1)
  }, [debouncedSearch])

  const { data, isLoading, isFetching, isError } = useQuery({
    ...useGetExams({
      page,
      limit,
      sortBy,
      sortOrder,
      keyword: debouncedSearch || undefined,
    }),
    placeholderData: keepPreviousData,
  })

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const exams = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  useEffect(() => {
    if (data && page > data.totalPages && data.totalPages > 0) {
      setPage(data.totalPages)
    }
  }, [data?.totalPages])

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: page,
    totalPages,
    paginationItemsToDisplay: 5,
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null)

  const createMutation = useCreateExam()
  const updateMutation = useUpdateExam()
  const deleteMutation = useDeleteExam()
  const arrangeMutation = useArrangeExams()

  const handleAddNew = () => {
    setSelectedExam(null)
    setIsFormOpen(true)
  }

  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam)
    setIsFormOpen(true)
  }

  const handleDelete = (exam: Exam) => {
    setDeleteTarget(exam)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Exam deleted successfully')
        setIsDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete exam',
        )
      },
    })
  }

  const handleSave = (formData: any) => {
    if (selectedExam) {
      updateMutation.mutate(
        { id: selectedExam.id, ...formData },
        {
          onSuccess: () => {
            toast.success('Exam updated successfully')
            setIsFormOpen(false)
            setSelectedExam(null)
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : 'Failed to update exam',
            )
          },
        },
      )
      return
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Exam created successfully')
        setIsFormOpen(false)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to create exam',
        )
      },
    })
  }

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <InputGroup className="w-full max-w-75">
          <InputGroupAddon align="inline-start">
            <Search className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search exams..."
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
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4" />
          Add Exam
        </Button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-destructive font-medium">
            Failed to load exams
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
          <ExamsTable
            exams={exams}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onReorder={(items) => arrangeMutation.mutate(items)}
            isDragDisabled={!!debouncedSearch}
          />
          <div className="grid grid-cols-3 items-center pt-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            {totalPages > 1 ? (
              <Pagination className="justify-self-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
                  </PaginationItem>
                  {showLeftEllipsis && (
                    <PaginationItem><PaginationEllipsis /></PaginationItem>
                  )}
                  {pages.map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {showRightEllipsis && (
                    <PaginationItem><PaginationEllipsis /></PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage(Math.min(totalPages, page + 1))} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : <div />}
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1) }}>
                <SelectTrigger className="w-17.5 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
      <ExamFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        exam={selectedExam}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
      <ExamDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        examName={deleteTarget?.name ?? ''}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}

function TestSchedulesTab() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)
  const isFirstRender = useRef(true)
  const limit = 20

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setPage(1)
  }, [debouncedSearch])

  const { data, isLoading, isFetching, isError } = useQuery({
    ...useGetTestSchedules({
      page,
      limit,
      sortBy,
      sortOrder,
      keyword: debouncedSearch || undefined,
    }),
    placeholderData: keepPreviousData,
  })

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const schedules = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  useEffect(() => {
    if (data && page > data.totalPages && data.totalPages > 0) {
      setPage(data.totalPages)
    }
  }, [data?.totalPages])

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: page,
    totalPages,
    paginationItemsToDisplay: 5,
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<TestSchedule | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TestSchedule | null>(null)

  const createMutation = useCreateTestSchedule()
  const updateMutation = useUpdateTestSchedule()
  const deleteMutation = useDeleteTestSchedule()

  const handleAddNew = () => {
    setSelectedSchedule(null)
    setIsFormOpen(true)
  }

  const handleEdit = (schedule: TestSchedule) => {
    setSelectedSchedule(schedule)
    setIsFormOpen(true)
  }

  const handleDelete = (schedule: TestSchedule) => {
    setDeleteTarget(schedule)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Test schedule deleted successfully')
        setIsDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to delete test schedule',
        )
      },
    })
  }

  const handleSave = (formData: any) => {
    if (selectedSchedule) {
      updateMutation.mutate(
        { id: selectedSchedule.id, ...formData },
        {
          onSuccess: () => {
            toast.success('Test schedule updated successfully')
            setIsFormOpen(false)
            setSelectedSchedule(null)
          },
          onError: (error) => {
            toast.error(
              error instanceof Error
                ? error.message
                : 'Failed to update test schedule',
            )
          },
        },
      )
      return
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Test schedule created successfully')
        setIsFormOpen(false)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to create test schedule',
        )
      },
    })
  }

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <InputGroup className="w-full max-w-75">
          <InputGroupAddon align="inline-start">
            <Search className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search schedules..."
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
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4" />
          Add Schedule
        </Button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-destructive font-medium">
            Failed to load test schedules
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
          <ExamTestSchedulesTable
            schedules={schedules}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
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
                      onClick={() =>
                        setPage(Math.min(totalPages, page + 1))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
      <ExamTestScheduleFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        schedule={selectedSchedule}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
      <ExamTestScheduleDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        scheduleLabel={
          deleteTarget
            ? `${deleteTarget.month ?? '?'}/${deleteTarget.year ?? '?'}`
            : ''
        }
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
