import { useEffect, useState, type FormEvent } from 'react'
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
import { productsApi } from '@/api/modules'
import type { ProductCreate, ProductImportance } from '@/models/product'
import useCategoriesQuery from '@/queries/useCategoriesQuery'

type CreateProductModalProps = {
  walletId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialCategoryId?: string
}

export default function CreateProductModal({
  walletId,
  open,
  onOpenChange,
  initialCategoryId,
}: CreateProductModalProps) {
  const queryClient = useQueryClient()

  const [categoryId, setCategoryId] = useState<string>(initialCategoryId ?? '')
  const [name, setName] = useState<string>('')
  const [importance, setImportance] = useState<ProductImportance>('important')
  const [error, setError] = useState<string>('')

  const categories = useCategoriesQuery(walletId)
  const categoriesList = categories.data ?? []

  useEffect(() => {
    if (!open) {
      setCategoryId(initialCategoryId ?? '')
      setName('')
      setImportance('important')
      setError('')
    }
  }, [open, initialCategoryId])

  const createMutation = useMutation({
    mutationFn: (payload: ProductCreate) => productsApi.create(walletId, payload),
    onSuccess: () => {
      notify.success('Product created')
      queryClient.invalidateQueries({ queryKey: ['wallets', walletId, 'products'], exact: false })
      onOpenChange(false)
    },
    onError: (err) => {
      notify.fromError(err, 'Failed to create category')
    },
  })

  const isSubmitting = createMutation.isPending
  const categorySelectDisabled = isSubmitting || categories.isPending || categories.isError
  const canSubmit = name.trim().length > 0 && !!categoryId && categories.isSuccess && !isSubmitting

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) return setError('Name is required')
    if (!categoryId) return setError('Select category')

    setError('')

    createMutation.mutate({
      name: trimmedName,
      category_id: categoryId,
      importance,
    })
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create Product</ModalTitle>
        </ModalHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label htmlFor="product-name">Product name</Label>
            <Input
              id="product-name"
              type="text"
              value={name}
              invalid={!!error}
              onChange={(e) => {
                setName(e.target.value)
                if (error && e.target.value.trim()) setError('')
              }}
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="product-categoryId">Category</Label>
            <Select
              id="product-categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
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
              >
                Retry loading categories
              </Button>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="product-importance">Importance</Label>
            <Select
              id="product-importance"
              value={importance}
              onChange={(e) => setImportance(e.target.value as ProductImportance)}
              disabled={isSubmitting}
            >
              <option value="important">Important</option>
              <option value="necessary">Necessary</option>
              <option value="unnecessary">Unnecessary</option>
            </Select>
          </div>

          <FieldError>{error}</FieldError>

          <ModalFooter>
            <ModalClose>Close</ModalClose>
            <Button type="submit" variant="primary" disabled={!canSubmit} loading={isSubmitting}>
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
