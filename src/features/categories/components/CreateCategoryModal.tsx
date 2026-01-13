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
} from '@/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesApi } from '@/api/modules'
import { queryKeys } from '@/queries/queryKeys'
import type { CategoryCreate } from '@/models/category'
type CreateCategoryModalProps = {
  walletId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}
export default function CreateCategoryModal({
  walletId,
  open,
  onOpenChange,
}: CreateCategoryModalProps) {
  const queryClient = useQueryClient()

  const [name, setName] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!open) {
      setName('')
      setError('')
    }
  }, [open])

  const createMutation = useMutation({
    mutationFn: (payload: CategoryCreate) => categoriesApi.create(walletId, payload),
    onSuccess: () => {
      notify.success('Category created')
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.categories.all(walletId) })
      onOpenChange(false)
    },
    onError: (err) => {
      const status = typeof (err as any)?.status === 'number' ? (err as any).status : undefined
      const message =
        typeof (err as any)?.message === 'string'
          ? (err as any).message
          : typeof (err as any)?.detail === 'string'
            ? (err as any).detail
            : undefined

      if (status === 409) {
        setError(message ?? 'Category with this name already exists')
        return
      }

      notify.fromError(err, 'Failed to create category')
    },
  })

  const isSubmitting = createMutation.isPending
  const canSubmit = name.trim().length > 0 && !isSubmitting

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName.length) {
      setError('name is required')
      return
    }

    setError('')

    const payload: CategoryCreate = {
      name: trimmedName,
    }

    createMutation.mutate(payload)
  }
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create category</ModalTitle>
        </ModalHeader>
        <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
          <Label htmlFor="category-name">Category name</Label>
          <Input
            id="category-name"
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
