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
import { CouponsTable } from './-components/coupons-table'
import { CouponFormDialog } from './-components/coupon-form-dialog'
import { CouponDeleteDialog } from './-components/coupon-delete-dialog'
import { CouponUsagesDialog } from './-components/coupon-usages-dialog'
import {
  useGetCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from './-api'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Coupon } from './-types'

export const Route = createFileRoute('/_app/coupons/')({
  component: CouponsPage,
})

function CouponsPage() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
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
    ...useGetCoupons({
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

  const coupons = data?.data ?? []
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

  // Component dialog controls
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isUsagesOpen, setIsUsagesOpen] = useState(false)
  
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)
  const [usagesTarget, setUsagesTarget] = useState<Coupon | null>(null)

  const createMutation = useCreateCoupon()
  const updateMutation = useUpdateCoupon()
  const deleteMutation = useDeleteCoupon()

  const handleAddNew = () => {
    setSelectedCoupon(null)
    setIsFormOpen(true)
  }

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setIsFormOpen(true)
  }

  const handleDelete = (coupon: Coupon) => {
    setDeleteTarget(coupon)
    setIsDeleteOpen(true)
  }

  const handleViewUsages = (coupon: Coupon) => {
    setUsagesTarget(coupon)
    setIsUsagesOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Coupon deleted successfully')
        setIsDeleteOpen(false)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to delete coupon',
        )
      },
    })
  }

  const handleSave = (formData: any) => {
    if (selectedCoupon) {
      updateMutation.mutate(
        { id: selectedCoupon.id, ...formData },
        {
          onSuccess: () => {
            toast.success('Coupon updated successfully')
            setIsFormOpen(false)
            setSelectedCoupon(null)
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : 'Failed to update coupon',
            )
          },
        },
      )
      return
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Coupon created successfully')
        setIsFormOpen(false)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to create coupon',
        )
      },
    })
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Coupons</PageTitle>
      </PageHeader>
      <PageBody>
        <div className="flex items-center justify-between pb-4">
          <InputGroup className="w-full max-w-[300px]">
            <InputGroupAddon align="inline-start">
              <Search className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search coupons..."
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
            Add Coupon
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-destructive font-medium">
              Failed to load coupons
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
            <CouponsTable
              coupons={coupons}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewUsages={handleViewUsages}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
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
                  <SelectTrigger className="w-[70px] h-8 text-sm">
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

        <CouponFormDialog
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          coupon={selectedCoupon}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />

        <CouponDeleteDialog
          isOpen={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          couponCode={deleteTarget?.code ?? ''}
          onConfirm={handleConfirmDelete}
          isPending={deleteMutation.isPending}
        />

        <CouponUsagesDialog
          isOpen={isUsagesOpen}
          onOpenChange={setIsUsagesOpen}
          couponId={usagesTarget?.id ?? null}
          couponCode={usagesTarget?.code ?? ''}
        />
      </PageBody>
    </PageContainer>
  )
}
