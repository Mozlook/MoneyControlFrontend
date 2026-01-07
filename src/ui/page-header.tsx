import type { ReactNode } from 'react'
export type PageHeaderProps = {
  title: string
  actions?: ReactNode
}
export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      {actions}
    </div>
  )
}
