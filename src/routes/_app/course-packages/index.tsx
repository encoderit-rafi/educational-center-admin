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
import { CoursePackagesTable } from './-components/course-packages-table'
import { CoursePackageFormDialog } from './-components/course-package-form-dialog'
import { CoursePackageDeleteDialog } from './-components/course-package-delete-dialog'
import {
  useGetCoursePackages,
  useCreateCoursePackage,
  useUpdateCoursePackage,
  useDeleteCoursePackage,
} from './-api'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { CoursePackage } from './-types'

export const Route = createFileRoute('/_app/course-packages/')({
  component: CoursePackagesPage,
})

function CoursePackagesPage() {
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
    ...useGetCoursePackages({
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
  const [selectedPackage, setSelectedPackage] = useState<CoursePackage | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CoursePackage | null>(null)

  const createMutation = useCreateCoursePackage()
  const updateMutation = useUpdateCoursePackage()
  const deleteMutation = useDeleteCoursePackage()

  const handleView = (pkg: CoursePackage) => {
    setSelectedPackage(pkg)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setSelectedPackage(null)
    setIsFormOpen(true)
  }

  const handleEdit = (pkg: CoursePackage) => {
    setSelectedPackage(pkg)
    setIsFormOpen(true)
  }

  const handleDelete = (pkg: CoursePackage) => {
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

  const handleSave = (formData: any) => {
    const payload = {
      ...formData,
      bestFor: formData.bestFor
        ? formData.bestFor.split('\n').filter((s: string) => s.trim())
        : undefined,
    }
    if (selectedPackage) {
      updateMutation.mutate(
        { id: selectedPackage.id, ...payload },
        {
          onSuccess: () => {
            toast.success('Package updated successfully')
            setIsFormOpen(false)
            setSelectedPackage(null)
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : 'Failed to update package',
            )
          },
        },
      )
      return
    }

    createMutation.mutate(payload, {
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
    <PageContainer>
      <PageHeader>
        <PageTitle>Course Packages</PageTitle>
      </PageHeader>
      <PageBody>
        <div className="flex items-center justify-between pb-4">
          <InputGroup className="w-full max-w-[300px]">
            <InputGroupAddon align="inline-start">
              <Search className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search packages..."
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
              Failed to load packages
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
            <CoursePackagesTable
              packages={packages}
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
      <CoursePackageFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        pkg={selectedPackage}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
      <CoursePackageDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        packageName={deleteTarget?.name ?? ''}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </PageContainer>
  )
}
