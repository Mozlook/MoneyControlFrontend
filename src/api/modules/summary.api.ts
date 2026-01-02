import { api } from '@/api/client'
import { apiPaths } from '@/api/apiPaths'
import type { SummaryRange, SummaryCategoriesProducts, SummaryImportance } from '@/models/summary'

export const summaryApi = {
  categoriesProducts: (walletId: string, params?: SummaryRange & { include_empty?: boolean }) =>
    api.get<SummaryCategoriesProducts>(
      apiPaths.wallets.summary.categoriesProducts(walletId),
      params,
    ),

  byImportance: (walletId: string, params?: SummaryRange) =>
    api.get<SummaryImportance>(apiPaths.wallets.summary.byImportance(walletId), params),
}
