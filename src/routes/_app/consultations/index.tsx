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
import { DatePicker } from '@/components/blocks/date-picker'
import { usePagination } from '@/hooks/use-pagination'
import { useDebounce } from '@/hooks/use-debounce'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { ConsultationsTable } from './-components/consultations-table'
import { useGetConsultations, useDeleteConsultation } from './-api'
import { ConsultationDetailsSheet } from './-components/consultation-details-sheet'
import { ConsultationStatusSheet } from './-components/consultation-status-sheet'
import { ConsultationDeleteDialog } from './-components/consultation-delete-dialog'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { Consultation } from './-types'

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'IN', label: 'India' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SG', label: 'Singapore' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'ZA', label: 'South Africa' },
]

export const Route = createFileRoute('/_app/consultations/')({
  component: ConsultationsPage,
})

function ConsultationsPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Consultations</PageTitle>
      </PageHeader>
      <PageBody>
        <BookingsTab />
      </PageBody>
    </PageContainer>
  )
}

function BookingsTab() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [country, setCountry] = useState('')
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()
  const isFirstRender = useRef(true)
  const limit = 20

  const dateFromStr = dateFrom ? format(dateFrom, 'yyyy-MM-dd') : ''
  const dateToStr = dateTo ? format(dateTo, 'yyyy-MM-dd') : ''
  const hasActiveFilters = !!country || !!dateFrom || !!dateTo

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setPage(1)
  }, [debouncedSearch, country, dateFromStr, dateToStr])

  const { data, isLoading, isFetching, isError } = useQuery({
    ...useGetConsultations({
      page,
      limit,
      sortBy,
      sortOrder,
      keyword: debouncedSearch || undefined,
      country: country || undefined,
      createdAtFrom: dateFromStr || undefined,
      createdAtTo: dateToStr || undefined,
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

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date)
    if (date && dateTo && date > dateTo) {
      setDateTo(undefined)
    }
  }

  const handleClearFilters = () => {
    setCountry('')
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  const consultations = data?.data ?? []
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
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Consultation | null>(null)

  const deleteMutation = useDeleteConsultation()

  const handleView = (consultation: any) => {
    setSelectedId(consultation.id)
    setIsViewOpen(true)
  }

  const handleUpdateStatus = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
    setIsStatusOpen(true)
  }

  const handleDelete = (consultation: Consultation) => {
    setDeleteTarget(consultation)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Consultation deleted successfully')
        setIsDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to delete consultation')
      },
    })
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 pb-4">
        <InputGroup className="w-full max-w-[300px]">
          <InputGroupAddon align="inline-start">
            <Search className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search consultations..."
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
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker
          value={dateFrom}
          onChange={handleDateFromChange}
          placeholder="From date"
          className="w-[150px]"
        />
        <DatePicker
          value={dateTo}
          onChange={setDateTo}
          placeholder="To date"
          className="w-[150px]"
        />
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-destructive font-medium">
            Failed to load consultations
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
          <ConsultationsTable
            consultations={consultations}
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
      <ConsultationDetailsSheet
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        consultationId={selectedId}
      />
      <ConsultationStatusSheet
        isOpen={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        consultation={selectedConsultation}
      />
      <ConsultationDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        bookingRef={deleteTarget?.bookingRef ?? ''}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
