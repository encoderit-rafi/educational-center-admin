import {
  PageActions,
  PageBody,
  PageContainer,
  PageFooter,
  PageHeader,
  PageTitle,
} from '@/components/blocks/app-page'
import { AppPagination } from '@/components/blocks/app-pagination'
import { AppSearch } from '@/components/blocks/app-search'
import AppTable from '@/components/blocks/app-table'
import { SectionCards } from '@/components/blocks/section-cards'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>Dashboard</PageTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of your educational center
          </p>
        </div>
        <PageActions>
          <AppSearch />
          <Button variant="outline" size="sm">
            <Download />
            <span className="max-md:hidden">Export</span>
          </Button>
          <Button size="sm">
            <Plus />
            <span className="max-md:hidden">Add New</span>
          </Button>
        </PageActions>
      </PageHeader>
      <PageBody>
        <div className="flex flex-col gap-6">
          <SectionCards />
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3 px-1">
              Recent Activity
            </h3>
            <AppTable />
          </div>
        </div>
      </PageBody>
      <PageFooter>
        <AppPagination />
      </PageFooter>
    </PageContainer>
  )
}
