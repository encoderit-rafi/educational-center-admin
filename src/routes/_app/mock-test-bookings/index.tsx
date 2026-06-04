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
import { MockTestBookingsTable } from './-components/mock-test-bookings-table'
import { MockTestBookingDetailsSheet } from './-components/mock-test-booking-details-sheet'
import { MockTestBookingStatusDialog } from './-components/mock-test-booking-status-dialog'
import { MockTestBookingDeleteDialog } from './-components/mock-test-booking-delete-dialog'
import {
  useGetMockTestBookings,
  useUpdateMockTestBookingStatus,
  useDeleteMockTestBooking,
} from './-api'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { toast } from 'sonner'
import type { MockTestBooking } from './-types'

export const Route = createFileRoute('/_app/mock-test-bookings/')({
  component: MockTestBookingsPage,
})

function MockTestBookingsPage() {
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
    ...useGetMockTestBookings({
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
  const [selectedBooking, setSelectedBooking] = useState<MockTestBooking | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MockTestBooking | null>(null)

  const updateStatusMutation = useUpdateMockTestBookingStatus()
  const deleteMutation = useDeleteMockTestBooking()

  const handleView = (booking: MockTestBooking) => {
    setSelectedId(booking.id)
    setIsViewOpen(true)
  }

  const handleUpdateStatus = (booking: MockTestBooking) => {
    setSelectedBooking(booking)
    setIsStatusOpen(true)
  }

  const handleDelete = (booking: MockTestBooking) => {
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
        toast.success('Mock test booking deleted successfully')
        setIsDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to delete mock test booking',
        )
      },
    })
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Mock Test Bookings</PageTitle>
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
              Failed to load mock test bookings
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
            <MockTestBookingsTable
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
      <MockTestBookingDetailsSheet
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        bookingId={selectedId}
      />
      <MockTestBookingStatusDialog
        isOpen={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        currentStatus={selectedBooking?.status ?? ''}
        onConfirm={handleConfirmStatus}
        isPending={updateStatusMutation.isPending}
      />
      <MockTestBookingDeleteDialog
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
