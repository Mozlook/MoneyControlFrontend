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
      className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-3 hover:bg-slate-50"
    >
      <div className="flex min-w-0 items-center gap-2">
        {category.icon ? (
          <span className="shrink-0 text-slate-500">{category.icon}</span>
        ) : (
          <span className="shrink-0 text-slate-300">•</span>
        )}

        <span className="truncate font-medium text-slate-900">{category.name}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold text-slate-900 tabular-nums">
          {category.period_sum ?? 0}
        </div>

        {canManage && onDelete ? (
          <Button
            variant="danger"
            size="sm"
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
