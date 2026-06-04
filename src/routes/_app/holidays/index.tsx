import { useState, useEffect, useRef } from 'react'
import {
  PageBody,
  PageContainer,
  PageHeader,
  PageTitle,
} from '@/components/blocks/app-page'
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
import { HolidaysTable } from './-components/holidays-table'
import { HolidayFormDialog } from './-components/holiday-form-dialog'
import { HolidayDeleteDialog } from './-components/holiday-delete-dialog'
import {
  useGetHolidays,
  useCreateHoliday,
  useUpdateHoliday,
  useDeleteHoliday,
} from './-api'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Holiday } from './-types'

export const Route = createFileRoute('/_app/holidays/')({
  component: HolidaysPage,
})

function HolidaysPage() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('startDate')
  const [sortOrder, setSortOrder] = useState('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [holidayTypeFilter, setHolidayTypeFilter] = useState('')
  const isFirstRender = useRef(true)
  const limit = 20

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setPage(1)
  }, [debouncedSearch, holidayTypeFilter])

  const { data, isLoading, isFetching, isError } = useQuery({
    ...useGetHolidays({
      page,
      limit,
      sortBy,
      sortOrder,
      keyword: debouncedSearch || undefined,
      holidayType: holidayTypeFilter || undefined,
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

  const holidays = data?.data ?? []
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
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Holiday | null>(null)

  const createMutation = useCreateHoliday()
  const updateMutation = useUpdateHoliday()
  const deleteMutation = useDeleteHoliday()

  const handleView = (holiday: Holiday) => {
    setSelectedHoliday(holiday)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setSelectedHoliday(null)
    setIsFormOpen(true)
  }

  const handleEdit = (holiday: Holiday) => {
    setSelectedHoliday(holiday)
    setIsFormOpen(true)
  }

  const handleDelete = (holiday: Holiday) => {
    setDeleteTarget(holiday)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Holiday deleted successfully')
        setIsDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete holiday',
        )
      },
    })
  }

  const handleSave = (formData: any) => {
    if (selectedHoliday) {
      updateMutation.mutate(
        { id: selectedHoliday.id, ...formData },
        {
          onSuccess: () => {
            toast.success('Holiday updated successfully')
            setIsFormOpen(false)
            setSelectedHoliday(null)
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : 'Failed to update holiday',
            )
          },
        },
      )
      return
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Holiday created successfully')
        setIsFormOpen(false)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to create holiday',
        )
      },
    })
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Holidays</PageTitle>
      </PageHeader>
      <PageBody>
        <div className="flex items-center justify-between gap-2 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <InputGroup className="w-full max-w-[300px]">
              <InputGroupAddon align="inline-start">
                <Search className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search holidays..."
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
            <Select value={holidayTypeFilter} onValueChange={setHolidayTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="NATIONAL">National</SelectItem>
                <SelectItem value="RELIGIOUS">Religious</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            Add Holiday
          </Button>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-destructive font-medium">
              Failed to load holidays
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
            <HolidaysTable
              holidays={holidays}
              onView={handleView}
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
      </PageBody>
      <HolidayFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        holiday={selectedHoliday}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
      <HolidayDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        holidayTitle={deleteTarget?.title ?? ''}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </PageContainer>
  )
}
