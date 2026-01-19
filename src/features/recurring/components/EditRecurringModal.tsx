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
  Textarea,
} from '@/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCategoriesQuery from '@/queries/useCategoriesQuery'
import { queryKeys } from '@/queries/queryKeys'
import useProductsQuery from '@/queries/useProductsQuery'
import { recurringApi } from '@/api/modules'
import useWalletQuery from '@/queries/useWalletQuery'
import type { RecurringCreate, RecurringRead } from '@/models/recurring'

type EditRecurringModalProps = {
  walletId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  item: RecurringRead
}

export default function EditRecurringModal({
  walletId,
  open,
  onOpenChange,
  item,
}: EditRecurringModalProps) {
  const queryClient = useQueryClient()

  const [categoryId, setCategoryId] = useState<string>(item.category.id)
  const [productId, setProductId] = useState<string>(item.product?.id ?? '')
  const [amount, setAmount] = useState<string>(String(item.amount_base) ?? '')
  const [description, setDescription] = useState<string>(item.description ?? '')

  const [error, setError] = useState<string>('')

  const wallet = useWalletQuery(walletId)
  const walletCurrency = wallet.data?.currency?.toUpperCase()
  const walletCurrencyLabel = walletCurrency ?? (wallet.isPending ? '...' : '—')

  const categories = useCategoriesQuery(walletId)
  const categoriesList = categories.data ?? []

  const products = useProductsQuery(walletId, categoryId || undefined)
  const productsList = products.data ?? []

  useEffect(() => {
    if (!open) {
      setCategoryId(item.category.id)
      setProductId(item.product?.id ?? '')
      setAmount(String(item.amount_base) ?? '')
      setDescription(item.description ?? '')
      setError('')
    }
  }, [open])

  const editMutation = useMutation({
    mutationFn: (payload: RecurringCreate) => recurringApi.update(walletId, item.id, payload),
    onSuccess: () => {
      notify.success('Recurring transaction updated')

      queryClient.invalidateQueries({
        queryKey: queryKeys.wallets.recurring.root(walletId),
      })

      onOpenChange(false)
    },
    onError: (err) => {
      notify.fromError(err, 'Failed to update recurring transaction')
    },
  })

  const isSubmitting = editMutation.isPending

  const categorySelectDisabled = isSubmitting || categories.isPending || categories.isError
  const productSelectDisabled =
    isSubmitting || !categoryId || products.isPending || products.isError

  const amountNum = useMemo(() => Number(amount), [amount])
  const amountOk = Number.isFinite(amountNum) && amountNum > 0

  const canSubmit =
    !!categoryId &&
    categories.isSuccess &&
    !!productId &&
    amountOk &&
    !!walletCurrency &&
    !isSubmitting

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!categoryId) return setError('Select category')
    if (!productId) return setError('Select product')

    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) return setError('Amount must be greater than 0')

    const cur = walletCurrency
    if (!cur) return setError('Wallet currency is missing')

    setError('')

    editMutation.mutate({
      category_id: categoryId,
      product_id: productId,
      amount_base: amt,
      currency_base: cur,
      description,
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
          <ModalTitle>Create Recurring Transaction</ModalTitle>
        </ModalHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label htmlFor="recurringTransaction-categoryId">Category</Label>
            <Select
              id="recurringTransaction-categoryId"
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
            <Label htmlFor="recurringTransaction-productId">Product</Label>
            <Select
              id="recurringTransaction-productId"
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
            <Label htmlFor="recurringTransaction-amount">
              Amount{walletCurrency ? ` (wallet: ${walletCurrency})` : ''}
            </Label>

            <div className="relative">
              <Input
                id="recurringTransaction-amount"
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
                className="pr-14"
              />

              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500">
                {walletCurrencyLabel}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="recurringTransaction-description">Description</Label>
            <Textarea
              id="recurringTransaction-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
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
