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
import { usePagination } from '@/hooks/use-pagination'
import { useDebounce } from '@/hooks/use-debounce'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { ExamBookingsTable } from './-components/exam-bookings-table'
import { ExamBookingDetailsSheet } from './-components/exam-booking-details-sheet'
import { ExamBookingStatusDialog } from './-components/exam-booking-status-dialog'
import { ExamBookingDeleteDialog } from './-components/exam-booking-delete-dialog'
import {
  useGetExamBookings,
  useUpdateExamBookingStatus,
  useDeleteExamBooking,
} from './-api'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { toast } from 'sonner'
import type { ExamBooking } from './-types'

export const Route = createFileRoute('/_app/exam-bookings/')({
  component: ExamBookingsPage,
})

function ExamBookingsPage() {
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

  const filter = debouncedSearch ? { keyword: debouncedSearch } : undefined

  const { data, isLoading, isFetching, isError } = useQuery({
    ...useGetExamBookings({
      page,
      limit,
      sortBy,
      sortOrder,
      filter,
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

  const bookings = data?.data ?? []
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

  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<ExamBooking | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ExamBooking | null>(null)

  const updateStatusMutation = useUpdateExamBookingStatus()
  const deleteMutation = useDeleteExamBooking()

  const handleView = (booking: ExamBooking) => {
    setSelectedId(booking.id)
    setIsViewOpen(true)
  }

  const handleUpdateStatus = (booking: ExamBooking) => {
    setSelectedBooking(booking)
    setIsStatusOpen(true)
  }

  const handleDelete = (booking: ExamBooking) => {
    setDeleteTarget(booking)
    setIsDeleteOpen(true)
  }

  const handleConfirmStatus = (status: string) => {
    if (!selectedBooking) return
    updateStatusMutation.mutate(
      { id: selectedBooking.id, status },
      {
        onSuccess: () => {
          toast.success('Booking status updated successfully')
          setIsStatusOpen(false)
          setSelectedBooking(null)
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Failed to update booking status',
          )
        },
      },
    )
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Exam booking deleted successfully')
        setIsDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to delete exam booking',
        )
      },
    })
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Exam Bookings</PageTitle>
      </PageHeader>
      <PageBody>
        <div className="pb-4">
          <InputGroup className="min-w-[280px]">
            <InputGroupAddon align="inline-start">
              <Search className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search bookings..."
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
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-destructive font-medium">
              Failed to load exam bookings
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
            <ExamBookingsTable
              bookings={bookings}
              onView={handleView}
              onUpdateStatus={handleUpdateStatus}
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
      <ExamBookingDetailsSheet
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        bookingId={selectedId}
      />
      <ExamBookingStatusDialog
        isOpen={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        currentStatus={selectedBooking?.status ?? ''}
        onConfirm={handleConfirmStatus}
        isPending={updateStatusMutation.isPending}
      />
      <ExamBookingDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        bookingName={
          deleteTarget
            ? `${deleteTarget.firstName} ${deleteTarget.lastName}`
            : ''
        }
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </PageContainer>
  )
}
