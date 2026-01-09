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
import { walletMembersApi } from '@/api/modules'
import { queryKeys } from '@/queries/queryKeys'
import type { WalletMemberCreate } from '@/models/walletMember'
type AddMemberModalProps = {
  walletId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}
export default function AddMemberModal({ walletId, open, onOpenChange }: AddMemberModalProps) {
  const queryClient = useQueryClient()

  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!open) {
      setEmail('')
      setError('')
    }
  }, [open])

  const createMutation = useMutation({
    mutationFn: (payload: WalletMemberCreate) => walletMembersApi.create(walletId, payload),
    onSuccess: () => {
      notify.success('Member added')
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.members.all(walletId) })
      onOpenChange(false)
    },
    onError: (err) => {
      notify.fromError(err, 'Failed to add member')
    },
  })

  const trimmed = email.trim()
  const isSubmitting = createMutation.isPending
  const canSubmit = trimmed.length > 0 && !isSubmitting && trimmed.includes('@')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setError('Email is required')
      return
    }
    if (!trimmedEmail.includes('@')) {
      setError('Provide valid email')
      return
    }

    setError('')

    const payload: WalletMemberCreate = {
      email: trimmedEmail,
    }

    createMutation.mutate(payload)
  }
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Add member</ModalTitle>
        </ModalHeader>
        <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
          <Label htmlFor="member-email">Email</Label>
          <Input
            id="member-email"
            type="email"
            autoComplete="email"
            value={email}
            invalid={!!error}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error && e.target.value.trim()) setError('')
            }}
            disabled={isSubmitting}
            autoFocus
          />
          <FieldError>{error}</FieldError>

          <ModalFooter>
            <ModalClose>Close</ModalClose>
            <Button type="submit" variant="primary" disabled={!canSubmit} loading={isSubmitting}>
              Add
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
