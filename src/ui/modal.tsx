import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { cn } from './cn'

type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export function Modal({ open, onOpenChange, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  )
}

type ModalContentProps = {
  children: ReactNode
  className?: string
}

export function ModalContent({ children, className }: ModalContentProps) {
  const baseContent =
    'fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 ' +
    'rounded-lg bg-white p-6 shadow-lg focus:outline-none'

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className={cn(baseContent, className)}>{children}</Dialog.Content>
    </Dialog.Portal>
  )
}

type ModalHeaderProps = {
  children: ReactNode
  className?: string
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return <div className={cn('mb-4 space-y-1', className)}>{children}</div>
}

type ModalTitleProps = React.ComponentPropsWithoutRef<typeof Dialog.Title>

export function ModalTitle({ className, ...props }: ModalTitleProps) {
  return <Dialog.Title className={cn('text-lg font-semibold', className)} {...props} />
}

type ModalDescriptionProps = React.ComponentPropsWithoutRef<typeof Dialog.Description>

export function ModalDescription({ className, ...props }: ModalDescriptionProps) {
  return <Dialog.Description className={cn('text-sm text-slate-600', className)} {...props} />
}

type ModalFooterProps = {
  children: ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return <div className={cn('mt-6 flex justify-end gap-2', className)}>{children}</div>
}

type ModalCloseProps = {
  children: ReactNode
}

export function ModalClose({ children }: ModalCloseProps) {
  return <Dialog.Close asChild>{children}</Dialog.Close>
}
