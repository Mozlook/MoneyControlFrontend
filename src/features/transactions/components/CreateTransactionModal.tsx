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
  const [amountBase, setAmountBase] = useState<string>('')

  const [useOriginal, setUseOriginal] = useState<boolean>(false)
  const [amountOriginal, setAmountOriginal] = useState<string>('')
  const [currencyOriginal, setCurrencyOriginal] = useState<string>('')

  const [error, setError] = useState<string>('')

  const wallet = useWalletQuery(walletId)

  const categories = useCategoriesQuery(walletId)
  const categoriesList = categories.data ?? []

  const products = useProductsQuery(walletId, categoryId || undefined)
  const productsList = products.data ?? []

  useEffect(() => {
    if (!open) {
      setCategoryId(initialCategoryId ?? '')
      setProductId(initialProductId ?? '')
      setAmountBase('')
      setUseOriginal(false)
      setAmountOriginal('')
      setCurrencyOriginal('')
      setError('')
    }
  }, [open, initialCategoryId, initialProductId])

  const createMutation = useMutation({
    mutationFn: (payload: TransactionCreate) => transactionsApi.create(walletId, payload),
    onSuccess: () => {
      notify.success('Transaction created')

      queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.transactions.all(walletId),
        exact: false,
      })

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

  const currencyBase = wallet.data?.currency

  const amountBaseNum = useMemo(() => Number(amountBase), [amountBase])
  const amountBaseOk = Number.isFinite(amountBaseNum) && amountBaseNum > 0

  const amountOriginalNum = useMemo(() => Number(amountOriginal), [amountOriginal])
  const originalOk =
    !useOriginal ||
    (currencyOriginal.trim().length > 0 &&
      Number.isFinite(amountOriginalNum) &&
      amountOriginalNum > 0)

  const canSubmit =
    !!categoryId &&
    categories.isSuccess &&
    !!productId &&
    !!currencyBase &&
    amountBaseOk &&
    originalOk &&
    !isSubmitting

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!categoryId) return setError('Select category')
    if (!productId) return setError('Select product')
    if (!currencyBase) return setError('Wallet currency not loaded')

    const amtBase = Number(amountBase)
    if (!Number.isFinite(amtBase) || amtBase <= 0) return setError('Amount must be greater than 0')

    if (useOriginal) {
      const curOrig = currencyOriginal.trim().toUpperCase()
      const amtOrig = Number(amountOriginal)

      if (!curOrig) return setError('Original currency is required')
      if (!Number.isFinite(amtOrig) || amtOrig <= 0) return setError('Original amount is invalid')
    }

    setError('')

    const payload: TransactionCreate = {
      category_id: categoryId,
      product_id: productId,
      amount_base: amtBase,
      currency_base: currencyBase,
      occurred_at: new Date().toISOString(),
    }

    if (useOriginal) {
      payload.currency_original = currencyOriginal.trim().toUpperCase()
      payload.amount_original = Number(amountOriginal)
    }

    createMutation.mutate(payload)
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

          <div className="space-y-1">
            <Label htmlFor="transaction-amountBase">
              Amount {currencyBase ? `(${currencyBase})` : ''}
            </Label>
            <Input
              id="transaction-amountBase"
              type="number"
              inputMode="decimal"
              min="0"
              step={0.01}
              value={amountBase}
              onChange={(e) => {
                setAmountBase(e.target.value)
                if (error) setError('')
              }}
              disabled={isSubmitting}
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="transaction-useOriginal"
              type="checkbox"
              checked={useOriginal}
              disabled={isSubmitting}
              onChange={(e) => {
                const checked = e.target.checked
                setUseOriginal(checked)
                if (error) setError('')

                if (!checked) {
                  setAmountOriginal('')
                  setCurrencyOriginal('')
                }
              }}
            />
            <Label htmlFor="transaction-useOriginal" className="text-sm text-slate-700">
              Add original currency (optional)
            </Label>
          </div>

          {useOriginal && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="transaction-amountOriginal">Original amount</Label>
                <Input
                  id="transaction-amountOriginal"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step={0.01}
                  value={amountOriginal}
                  onChange={(e) => {
                    setAmountOriginal(e.target.value)
                    if (error) setError('')
                  }}
                  disabled={isSubmitting}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="transaction-currencyOriginal">Original currency</Label>
                <Select
                  id="transaction-currencyOriginal"
                  value={currencyOriginal}
                  onChange={(e) => {
                    setCurrencyOriginal(e.target.value)
                    if (error) setError('')
                  }}
                  disabled={isSubmitting}
                >
                  <option value="" disabled>
                    Select currency
                  </option>
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}

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
