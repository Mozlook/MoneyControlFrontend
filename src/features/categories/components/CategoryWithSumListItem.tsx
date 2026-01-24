import { Link } from 'react-router-dom'
import { Button } from '@/ui'
import { routePaths } from '@/routes/routePaths'
import type { CategoryRead, CategoryReadSum } from '@/models/category'

type CategoryWithSumListItemProps = {
  walletId: string
  category: CategoryReadSum
  canManage?: boolean
  disabled?: boolean
  onDelete?: (category: CategoryRead) => void
}

export default function CategoryWithSumListItem({
  walletId,
  category,
  canManage = false,
  disabled = false,
  onDelete,
}: CategoryWithSumListItemProps) {
  return (
    <Link
      to={{
        pathname: routePaths.wallets.products(walletId),
        search: `?category_id=${encodeURIComponent(category.id)}`,
      }}
      className="flex min-w-0 flex-col gap-3 rounded-md border border-slate-200 bg-white p-3 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-2">
        {category.icon ? (
          <span className="shrink-0 text-slate-500">{category.icon}</span>
        ) : (
          <span className="shrink-0 text-slate-300">•</span>
        )}

        <span className="min-w-0 truncate font-medium text-slate-900">{category.name}</span>
      </div>

      {/* Right */}
      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
        <div className="shrink-0 text-sm font-semibold text-slate-900 tabular-nums">
          {category.period_sum ?? 0}
        </div>

        {canManage && onDelete ? (
          <Button
            variant="danger"
            size="sm"
            className="shrink-0"
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(category)
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </Link>
  )
}
