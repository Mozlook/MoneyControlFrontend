import type { ReactNode } from 'react'
import {
  Button,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalClose,
  ModalHeader,
  ModalTitle,
} from '@/ui'

type ConfirmModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'danger' | 'primary'
  confirmLoading?: boolean
  confirmDisabled?: boolean
  onConfirm: () => void
}

export default function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  confirmLoading = false,
  confirmDisabled = false,
  onConfirm,
}: ConfirmModalProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (confirmLoading && nextOpen === false) return
    onOpenChange(nextOpen)
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {description ? <ModalDescription>{description}</ModalDescription> : null}
        </ModalHeader>

        <ModalFooter>
          <ModalClose>
            <Button type="button" variant="secondary" disabled={confirmLoading}>
              {cancelText}
            </Button>
          </ModalClose>

          <Button
            type="button"
            variant={confirmVariant}
            disabled={confirmDisabled || confirmLoading}
            loading={confirmLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
