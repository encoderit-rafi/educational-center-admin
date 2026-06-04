import { useState, useEffect } from 'react'
import {
  PageActions,
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
import { Button } from '@/components/ui/button'
import { usePagination } from '@/hooks/use-pagination'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { PaymentsTable } from './-components/payments-table'
import { PaymentDetailsSheet } from './-components/payment-details-sheet'
import { RefundDialog } from './-components/refund-dialog'
import {
  useGetPayments,
  useCreateRefund,
} from './-api'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { Payment } from './-types'

export const Route = createFileRoute('/_app/payments/')({
  component: PaymentsPage,
})

function PaymentsPage() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const limit = 20

  const { data, isLoading, isFetching, isError } = useQuery({
    ...useGetPayments({
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

  const payments = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  useEffect(() => {
    if (data && page > data.totalPages && data.totalPages > 0) {
      setPage(data.totalPages)
    }
  }, [data?.totalPages])

  const { pages: paginationPages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: page,
    totalPages,
    paginationItemsToDisplay: 5,
  })

  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isRefundOpen, setIsRefundOpen] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const refundMutation = useCreateRefund()

  const handleView = (payment: Payment) => {
    setSelectedPaymentId(payment.id)
    setIsViewOpen(true)
  }

  const handleRefundClick = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsRefundOpen(true)
  }

  const handleConfirmRefund = (refundData: { paymentId: string; amount: number; reason?: string }) => {
    refundMutation.mutate(refundData, {
      onSuccess: () => {
        toast.success('Refund processed successfully')
        setIsRefundOpen(false)
        setSelectedPayment(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to process refund',
        )
      },
    })
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Payments</PageTitle>
        <PageActions />
      </PageHeader>
      <PageBody>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-destructive font-medium">
              Failed to load payments
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
            <PaymentsTable
              payments={payments}
              onView={handleView}
              onRefund={handleRefundClick}
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
                    {paginationPages.map((p) => (
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
      <PaymentDetailsSheet
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        paymentId={selectedPaymentId}
      />
      <RefundDialog
        isOpen={isRefundOpen}
        onOpenChange={setIsRefundOpen}
        payment={selectedPayment}
        onConfirm={handleConfirmRefund}
        isPending={refundMutation.isPending}
      />
    </PageContainer>
  )
}
