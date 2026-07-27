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
import { WorkshopBookingsTable } from '../workshop/-components/workshop-bookings-table'
import { WorkshopBookingDetailsSheet } from '../workshop/-components/workshop-booking-details-sheet'
import { WorkshopBookingStatusDialog } from '../workshop/-components/workshop-booking-status-dialog'
import { WorkshopBookingDeleteDialog } from '../workshop/-components/workshop-booking-delete-dialog'
import {
  useGetWorkshopBookings,
  useUpdateWorkshopBookingStatus,
  useDeleteWorkshopBooking,
} from '../workshop/-api'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { toast } from 'sonner'
import type { WorkshopBooking, WorkshopBookingStatus } from '../workshop/-types'

export const Route = createFileRoute('/_app/workshop-bookings/')({
  component: WorkshopBookingsPage,
})

function WorkshopBookingsPage() {
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
    ...useGetWorkshopBookings({
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
  const [selectedBooking, setSelectedBooking] = useState<WorkshopBooking | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<WorkshopBooking | null>(null)

  const updateStatusMutation = useUpdateWorkshopBookingStatus()
  const deleteMutation = useDeleteWorkshopBooking()

  const handleView = (booking: WorkshopBooking) => {
    setSelectedId(booking.id)
    setIsViewOpen(true)
  }

  const handleUpdateStatus = (booking: WorkshopBooking) => {
    setSelectedBooking(booking)
    setIsStatusOpen(true)
  }

  const handleDelete = (booking: WorkshopBooking) => {
    setDeleteTarget(booking)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Workshop booking deleted successfully')
        setIsDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete workshop booking',
        )
      },
    })
  }

  const handleSaveStatus = (formData: { status: WorkshopBookingStatus }) => {
    if (!selectedBooking) return
    updateStatusMutation.mutate(
      { id: selectedBooking.id, ...formData },
      {
        onSuccess: () => {
          toast.success('Workshop booking status updated successfully')
          setIsStatusOpen(false)
          setSelectedBooking(null)
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Failed to update workshop booking status',
          )
        },
      },
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Workshop Bookings</PageTitle>
      </PageHeader>
      <PageBody>
        <div className="pb-4">
          <InputGroup className="w-full max-w-75">
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
              Failed to load workshop bookings
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
            <WorkshopBookingsTable
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

      <WorkshopBookingDetailsSheet
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        bookingId={selectedId}
      />

      <WorkshopBookingStatusDialog
        isOpen={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        booking={selectedBooking}
        onSave={handleSaveStatus}
        isPending={updateStatusMutation.isPending}
      />

      <WorkshopBookingDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        bookingName={
          deleteTarget
            ? `${deleteTarget.firstName} ${deleteTarget.lastName ?? ''}`.trim()
            : ''
        }
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </PageContainer>
  )
}
