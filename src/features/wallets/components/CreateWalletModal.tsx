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
import type { WalletCreate } from '@/models/wallet'
import { walletsApi } from '@/api/modules'
import { queryKeys } from '@/queries/queryKeys'
type CreateWalletModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}
export default function CreateWalletModal({ open, onOpenChange }: CreateWalletModalProps) {
  const queryClient = useQueryClient()

  const [name, setName] = useState<string>('')
  const [currency, setCurrency] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!open) {
      setName('')
      setCurrency('')
      setError('')
    }
  }, [open])

  const createMutation = useMutation({
    mutationFn: (payload: WalletCreate) => walletsApi.create(payload),
    onSuccess: () => {
      notify.success('Wallet created')
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.all })
      onOpenChange(false)
    },
    onError: (err) => {
      notify.fromError(err, 'Failed to create wallet')
    },
  })

  const isSubmitting = createMutation.isPending
  const canSubmit = name.trim().length > 0 && !isSubmitting

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Name is required')
      return
    }

    setError('')

    const payload: WalletCreate = {
      name: trimmedName,
      currency: currency.trim() ? currency.trim().toUpperCase() : undefined,
    }

    createMutation.mutate(payload)
  }
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create wallet</ModalTitle>
        </ModalHeader>
        <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
          <Label htmlFor="wallet-name">Name</Label>
          <Input
            id="wallet-name"
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
          <Label htmlFor="wallet-currency">Currency (optional)</Label>
          <Select
            id="wallet-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">default</option>
            <option value="PLN">PLN</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </Select>
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
