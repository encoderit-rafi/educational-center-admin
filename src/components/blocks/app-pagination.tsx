import type { ComponentProps } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { usePagination } from '@/hooks/use-pagination'
import { Label } from '@/components/ui/label'

export function AppPagination(_props: ComponentProps<'div'>) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: 1,
    paginationItemsToDisplay: 3,
    totalPages: 250,
  })
  return (
    <div className="w-full flex items-center justify-between gap-8">
      <div className="hidden md:flex items-center gap-3 w-43">
        <Label className="text-nowrap">Rows per page</Label>
        <Select defaultValue="25">
          <SelectTrigger className="w-fit whitespace-nowrap">
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>

          {showLeftEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={`#/page/${page}`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {showRightEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="w-43 flex  justify-end whitespace-nowrap text-muted-foreground text-sm">
        <p
          aria-live="polite"
          className="whitespace-nowrap text-muted-foreground text-sm"
        >
          <span className="text-foreground">1-25</span> of{' '}
          <span className="text-foreground">100</span>
        </p>
      </div>
    </div>
  )
}
