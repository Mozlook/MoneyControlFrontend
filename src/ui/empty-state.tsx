import type { ReactNode } from 'react'
import { cn } from './cn'

export type EmptyStateProps = {
  title: string
  description?: ReactNode
  icon?: ReactNode
  actions?: ReactNode[]
  className?: string
}

export default function EmptyState({
  title,
  description,
  icon,
  actions,
  className,
}: EmptyStateProps) {
  const base = 'p-6 rounded-lg border border-dashed flex flex-col items-center text-center'

  return (
    <div className={cn(base, className)} role="status">
      {icon}
      <span className="font-semibold">{title}</span>
      {description && <span className="text-sm text-slate-600">{description}</span>}
      {actions && actions.map((action) => <div className="mt-4">{action}</div>)}
    </div>
  )
}
