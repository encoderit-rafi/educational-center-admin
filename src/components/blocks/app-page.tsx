import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const PageContainer = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={cn('page-container', className)} {...props} />
}
const PageHeader = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className="page-header" {...props} />
}
const PageTitle = ({ className, ...props }: ComponentProps<'h2'>) => {
  return <h2 className={cn('page-title', className)} {...props} />
}
const PageBody = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={cn('page-body', className)} {...props} />
}
const PageActions = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={cn('page-actions', className)} {...props} />
}
const PageFooter = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className="page-footer" {...props} />
}

export {
  PageContainer,
  PageHeader,
  PageTitle,
  PageBody,
  PageActions,
  PageFooter,
}
