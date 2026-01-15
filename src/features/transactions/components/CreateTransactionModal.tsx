import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  Button,
  FieldError,
  Input,
  Label,
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  notify,
  Select,
} from '@/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCategoriesQuery from '@/queries/useCategoriesQuery'
import { queryKeys } from '@/queries/queryKeys'
import useProductsQuery from '@/queries/useProductsQuery'
import { transactionsApi } from '@/api/modules'
import type { TransactionCreate } from '@/models/transaction'
import useWalletQuery from '@/queries/useWalletQuery'

type CreateTransactionModalProps = {
  walletId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialCategoryId?: string
  initialProductId?: string
}

const CURRENCIES = ['PLN', 'EUR', 'USD'] as const

export default function CreateTransactionModal({
  walletId,
  open,
  onOpenChange,
  initialCategoryId,
  initialProductId,
}: CreateTransactionModalProps) {
  const queryClient = useQueryClient()

  const [categoryId, setCategoryId] = useState<string>(initialCategoryId ?? '')
  const [productId, setProductId] = useState<string>(initialProductId ?? '')
  const [amount, setAmount] = useState<string>('')
  const [currency, setCurrency] = useState<string>('')

  const [error, setError] = useState<string>('')

  const wallet = useWalletQuery(walletId)

  const categories = useCategoriesQuery(walletId)
  const categoriesList = categories.data ?? []

  const products = useProductsQuery(walletId, categoryId || undefined)
  const productsList = products.data ?? []

  const currencyOptions = useMemo(() => {
    const walletCur = wallet.data?.currency?.toUpperCase()
    const all = walletCur ? [walletCur, ...CURRENCIES] : [...CURRENCIES]
    return Array.from(new Set(all))
  }, [wallet.data?.currency])

  // reset na zamknięciu
  useEffect(() => {
    if (!open) {
      setCategoryId(initialCategoryId ?? '')
      setProductId(initialProductId ?? '')
      setAmount('')
      setCurrency('')
      setError('')
    }
  }, [open, initialCategoryId, initialProductId])

  // jak otwierasz i masz walutę portfela – ustaw domyślnie currency
  useEffect(() => {
    if (!open) return
    if (currency) return
    const walletCur = wallet.data?.currency?.toUpperCase()
    setCurrency(walletCur ?? currencyOptions[0] ?? 'PLN')
  }, [open, wallet.data?.currency, currency, currencyOptions])

  const createMutation = useMutation({
    mutationFn: (payload: TransactionCreate) => transactionsApi.create(walletId, payload),
    onSuccess: () => {
      notify.success('Transaction created')

      queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.transactions.all(walletId),
        exact: false,
      })

      // bo sumy produktów/kategorii zależą od transakcji
      queryClient.invalidateQueries({ queryKey: ['wallets', walletId, 'products'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['wallets', walletId, 'categories'], exact: false })

      onOpenChange(false)
    },
    onError: (err) => {
      notify.fromError(err, 'Failed to create transaction')
    },
  })

  const isSubmitting = createMutation.isPending

  const categorySelectDisabled = isSubmitting || categories.isPending || categories.isError
  const productSelectDisabled =
    isSubmitting || !categoryId || products.isPending || products.isError

  const amountNum = useMemo(() => Number(amount), [amount])
  const amountOk = Number.isFinite(amountNum) && amountNum > 0

  const canSubmit =
    !!categoryId && categories.isSuccess && !!productId && !!currency && amountOk && !isSubmitting

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!categoryId) return setError('Select category')
    if (!productId) return setError('Select product')
    if (!currency) return setError('Select currency')

    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) return setError('Amount must be greater than 0')

    setError('')

    createMutation.mutate({
      category_id: categoryId,
      product_id: productId,
      amount: amt,
      currency: currency.toUpperCase(),
    })
  }

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSubmitting && !nextOpen) return
        onOpenChange(nextOpen)
      }}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create Transaction</ModalTitle>
        </ModalHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label htmlFor="transaction-categoryId">Category</Label>
            <Select
              id="transaction-categoryId"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value)
                setProductId('')
                if (error) setError('')
              }}
              disabled={categorySelectDisabled}
            >
              <option value="" disabled>
                {categories.isPending
                  ? 'Loading categories...'
                  : categories.isError
                    ? 'Failed to load categories'
                    : categoriesList.length === 0
                      ? 'No categories yet'
                      : 'Select category'}
              </option>

              {categoriesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>

            {categories.isError && (
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => categories.refetch()}
                disabled={isSubmitting}
              >
                Retry loading categories
              </Button>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="transaction-productId">Product</Label>
            <Select
              id="transaction-productId"
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value)
                if (error) setError('')
              }}
              disabled={productSelectDisabled}
            >
              <option value="" disabled>
                {!categoryId
                  ? 'Select category first'
                  : products.isPending
                    ? 'Loading products...'
                    : products.isError
                      ? 'Failed to load products'
                      : productsList.length === 0
                        ? 'No products in this category'
                        : 'Select product'}
              </option>

              {productsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>

            {products.isError && categoryId && (
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => products.refetch()}
                disabled={isSubmitting}
              >
                Retry loading products
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="transaction-amount">Amount</Label>
              <Input
                id="transaction-amount"
                type="number"
                inputMode="decimal"
                min="0"
                step={0.01}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  if (error) setError('')
                }}
                disabled={isSubmitting}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="transaction-currency">
                Currency{wallet.data?.currency ? ` (wallet: ${wallet.data.currency})` : ''}
              </Label>
              <Select
                id="transaction-currency"
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value)
                  if (error) setError('')
                }}
                disabled={isSubmitting}
              >
                <option value="" disabled>
                  Select currency
                </option>
                {currencyOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              <div className="text-xs text-slate-600">
                If currency differs from wallet currency, it will be converted automatically.
              </div>
            </div>
          </div>

          <FieldError>{error}</FieldError>

          <ModalFooter>
            <ModalClose>
              <Button variant="secondary" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </ModalClose>

            <Button type="submit" variant="primary" disabled={!canSubmit} loading={isSubmitting}>
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
