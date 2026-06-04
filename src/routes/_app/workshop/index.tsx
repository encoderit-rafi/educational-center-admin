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
import { usePagination } from '@/hooks/use-pagination'
import { useDebounce } from '@/hooks/use-debounce'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { WorkshopsTable } from './-components/workshops-table'
import { WorkshopFormDialog } from './-components/workshop-form-dialog'
import { WorkshopDeleteDialog } from './-components/workshop-delete-dialog'
import { WorkshopDetailsSheet } from './-components/workshop-details-sheet'
import { WorkshopBookingsTable } from './-components/workshop-bookings-table'
import { WorkshopBookingDetailsSheet } from './-components/workshop-booking-details-sheet'
import { WorkshopBookingStatusDialog } from './-components/workshop-booking-status-dialog'
import { WorkshopBookingDeleteDialog } from './-components/workshop-booking-delete-dialog'
import { WorkshopPackagesTable } from './-components/workshop-packages-table'
import { WorkshopPackageFormDialog } from './-components/workshop-package-form-dialog'
import { WorkshopPackageDeleteDialog } from './-components/workshop-package-delete-dialog'
import {
  useGetWorkshops,
  useCreateWorkshop,
  useUpdateWorkshop,
  useDeleteWorkshop,
  useGetWorkshopBookings,
  useUpdateWorkshopBookingStatus,
  useDeleteWorkshopBooking,
  useGetWorkshopPackages,
  useCreateWorkshopPackage,
  useUpdateWorkshopPackage,
  useDeleteWorkshopPackage,
} from './-api'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type {
  Workshop,
  WorkshopBooking,
  WorkshopPackage,
  WorkshopBookingStatus,
} from './-types'
import type { WorkshopFormData } from './-components/workshop-form-dialog'
import type { WorkshopPackageFormData } from './-components/workshop-package-form-dialog'

export const Route = createFileRoute('/_app/workshop/')({
  component: WorkshopsPage,
})

function WorkshopsPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Workshops</PageTitle>
      </PageHeader>
      <PageBody>
        <AppTabs
          tabs={[
            { value: 'workshops', label: 'Workshops', content: <WorkshopsTab /> },
            { value: 'bookings', label: 'Bookings', content: <BookingsTab /> },
            { value: 'packages', label: 'Packages', content: <PackagesTab /> },
          ]}
        />
      </PageBody>
    </PageContainer>
  )
}

function WorkshopsTab() {
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
    ...useGetWorkshops({
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

  const workshops = data?.data ?? []
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
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Workshop | null>(null)

  const createMutation = useCreateWorkshop()
  const updateMutation = useUpdateWorkshop()
  const deleteMutation = useDeleteWorkshop()

  const handleView = (workshop: Workshop) => {
    setSelectedId(workshop.id)
    setIsViewOpen(true)
  }

  const handleAddNew = () => {
    setSelectedWorkshop(null)
    setIsFormOpen(true)
  }

  const handleEdit = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setIsFormOpen(true)
  }

  const handleDelete = (workshop: Workshop) => {
    setDeleteTarget(workshop)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Workshop deleted successfully')
        setIsDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete workshop',
        )
      },
    })
  }

  const handleSave = (formData: WorkshopFormData) => {
    if (selectedWorkshop) {
      updateMutation.mutate(
        { id: selectedWorkshop.id, ...formData },
        {
          onSuccess: () => {
            toast.success('Workshop updated successfully')
            setIsFormOpen(false)
            setSelectedWorkshop(null)
          },
          onError: (error) => {
            toast.error(
              error instanceof Error
                ? error.message
                : 'Failed to update workshop',
            )
          },
        },
      )
      return
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Workshop created successfully')
        setIsFormOpen(false)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to create workshop',
        )
      },
    })
  }

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <InputGroup className="w-full max-w-[300px]">
          <InputGroupAddon align="inline-start">
            <Search className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search workshops..."
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
          Add Workshop
        </Button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-destructive font-medium">
            Failed to load workshops
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
          <WorkshopsTable
            workshops={workshops}
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
      <WorkshopDetailsSheet
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        workshopId={selectedId}
      />
      <WorkshopFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        workshop={selectedWorkshop}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
      <WorkshopDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        workshopTitle={deleteTarget?.title ?? ''}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}

function BookingsTab() {
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
        toast.success('Booking deleted successfully')
        setIsDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to delete booking',
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

  return (
    <>
      <div className="pb-4">
        <InputGroup className="w-full max-w-[300px]">
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
            ? `${deleteTarget.firstName} ${deleteTarget.lastName ?? ''}`
            : ''
        }
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}

function PackagesTab() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const limit = 20

  const { data, isLoading, isFetching, isError } = useQuery({
    ...useGetWorkshopPackages({
      page,
      limit,
      sortBy,
      sortOrder,
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

  const packages = data?.data ?? []
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
  const [selectedPackage, setSelectedPackage] = useState<WorkshopPackage | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<WorkshopPackage | null>(null)

  const createMutation = useCreateWorkshopPackage()
  const updateMutation = useUpdateWorkshopPackage()
  const deleteMutation = useDeleteWorkshopPackage()

  const handleAddNew = () => {
    setSelectedPackage(null)
    setIsFormOpen(true)
  }

  const handleEdit = (pkg: WorkshopPackage) => {
    setSelectedPackage(pkg)
    setIsFormOpen(true)
  }

  const handleDelete = (pkg: WorkshopPackage) => {
    setDeleteTarget(pkg)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Package deleted successfully')
        setIsDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete package',
        )
      },
    })
  }

  const handleSave = (formData: WorkshopPackageFormData) => {
    if (selectedPackage) {
      updateMutation.mutate(
        { id: selectedPackage.id, ...formData },
        {
          onSuccess: () => {
            toast.success('Package updated successfully')
            setIsFormOpen(false)
            setSelectedPackage(null)
          },
          onError: (error) => {
            toast.error(
              error instanceof Error
                ? error.message
                : 'Failed to update package',
            )
          },
        },
      )
      return
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Package created successfully')
        setIsFormOpen(false)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to create package',
        )
      },
    })
  }

  return (
    <>
      <div className="flex justify-end pb-4">
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4" />
          Add Package
        </Button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-destructive font-medium">
            Failed to load workshop packages
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
          <WorkshopPackagesTable
            packages={packages}
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
      <WorkshopPackageFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        pkg={selectedPackage}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
      <WorkshopPackageDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        packageInfo={
          deleteTarget
            ? `$${deleteTarget.price ?? 0} / ${deleteTarget.duration ?? 0}h`
            : ''
        }
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
