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
import { MockTestsTable } from './-components/mock-tests-table'
import { MockTestFormDialog } from './-components/mock-test-form-dialog'
import { MockTestDeleteDialog } from './-components/mock-test-delete-dialog'
import {
  useGetMockTests,
  useCreateMockTest,
  useUpdateMockTest,
  useDeleteMockTest,
} from './-api'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { MockTest } from './-types'
import type { MockTestFormData } from './-components/mock-test-form-dialog'

export const Route = createFileRoute('/_app/mock-tests/')({
  component: MockTestsPage,
})

function MockTestsPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Mock Tests</PageTitle>
      </PageHeader>
      <PageBody>
        <MockTestsTab />
      </PageBody>
    </PageContainer>
  )
}

function MockTestsTab() {
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

  const {
    data: mockTestsData,
    isLoading: isMtLoading,
    isFetching: isMtFetching,
    isError: isMtError,
  } = useQuery({
    ...useGetMockTests({
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

  const mockTests = mockTestsData?.data ?? []
  const mtTotalPages = mockTestsData?.totalPages ?? 1

  useEffect(() => {
    if (mockTestsData && page > mockTestsData.totalPages && mockTestsData.totalPages > 0) {
      setPage(mockTestsData.totalPages)
    }
  }, [mockTestsData?.totalPages])

  const {
    pages: mtPages,
    showLeftEllipsis: mtShowLeft,
    showRightEllipsis: mtShowRight,
  } = usePagination({
    currentPage: page,
    totalPages: mtTotalPages,
    paginationItemsToDisplay: 5,
  })

  const [isMtFormOpen, setIsMtFormOpen] = useState(false)
  const [isMtDeleteOpen, setIsMtDeleteOpen] = useState(false)
  const [selectedMockTest, setSelectedMockTest] = useState<MockTest | null>(null)
  const [deleteMtTarget, setDeleteMtTarget] = useState<MockTest | null>(null)

  const createMtMutation = useCreateMockTest()
  const updateMtMutation = useUpdateMockTest()
  const deleteMtMutation = useDeleteMockTest()

  const handleMtAddNew = () => {
    setSelectedMockTest(null)
    setIsMtFormOpen(true)
  }

  const handleMtEdit = (mt: MockTest) => {
    setSelectedMockTest(mt)
    setIsMtFormOpen(true)
  }

  const handleMtDelete = (mt: MockTest) => {
    setDeleteMtTarget(mt)
    setIsMtDeleteOpen(true)
  }

  const handleMtConfirmDelete = () => {
    if (!deleteMtTarget) return
    deleteMtMutation.mutate(deleteMtTarget.id, {
      onSuccess: () => {
        toast.success('Mock test deleted successfully')
        setIsMtDeleteOpen(false)
        setDeleteMtTarget(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to delete mock test',
        )
      },
    })
  }

  const handleMtSave = (formData: MockTestFormData) => {
    const input = {
      name: formData.name || undefined,
      courseId: formData.courseId || undefined,
      type: formData.type || undefined,
      price: formData.price ? Number(formData.price) : undefined,
      discountType: (formData.discountType || undefined) as
        | 'FLAT'
        | 'PERCENTAGE'
        | undefined,
      discountValue: formData.discountValue
        ? Number(formData.discountValue)
        : undefined,
      vatRate: formData.vatRate ? Number(formData.vatRate) : undefined,
      description: formData.description || undefined,
      isActive: formData.isActive,
      translations: {
        ar: {
          name: formData.translations?.ar?.name ?? '',
          description: formData.translations?.ar?.description ?? '',
        },
      },
      details: {
        ...selectedMockTest?.details,
        center_price: formData.centerPrice
          ? Number(formData.centerPrice)
          : undefined,
      },
    }

    if (selectedMockTest) {
      updateMtMutation.mutate(
        { id: selectedMockTest.id, ...input },
        {
          onSuccess: () => {
            toast.success('Mock test updated successfully')
            setIsMtFormOpen(false)
            setSelectedMockTest(null)
          },
          onError: (error) => {
            toast.error(
              error instanceof Error
                ? error.message
                : 'Failed to update mock test',
            )
          },
        },
      )
      return
    }

    createMtMutation.mutate(input, {
      onSuccess: () => {
        toast.success('Mock test created successfully')
        setIsMtFormOpen(false)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to create mock test',
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
            placeholder="Search mock tests..."
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
        <Button onClick={handleMtAddNew}>
          <Plus className="h-4 w-4" />
          Add Mock Test
        </Button>
      </div>
      {isMtLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : isMtError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-destructive font-medium">
            Failed to load mock tests
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
          {isMtFetching && (
            <div className="h-1 w-full bg-muted overflow-hidden rounded-full mb-2">
              <div className="h-full w-full bg-primary animate-pulse rounded-full" />
            </div>
          )}
          <MockTestsTable
            mockTests={mockTests}
            onEdit={handleMtEdit}
            onDelete={handleMtDelete}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          {mtTotalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {mtTotalPages}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
                    />
                  </PaginationItem>
                  {mtShowLeft && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {mtPages.map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {mtShowRight && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage(Math.min(mtTotalPages, page + 1))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
      <MockTestFormDialog
        isOpen={isMtFormOpen}
        onOpenChange={setIsMtFormOpen}
        mockTest={selectedMockTest}
        onSave={handleMtSave}
        isPending={createMtMutation.isPending || updateMtMutation.isPending}
      />
      <MockTestDeleteDialog
        isOpen={isMtDeleteOpen}
        onOpenChange={setIsMtDeleteOpen}
        mockTestName={deleteMtTarget?.name ?? ''}
        onConfirm={handleMtConfirmDelete}
        isPending={deleteMtMutation.isPending}
      />
    </>
  )
}
