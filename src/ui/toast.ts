import { toast } from 'sonner'

export const notify = {
  success: (message: string) => {
    toast.success(message)
  },
  error: (message: string) => {
    toast.error(message)
  },
  info: (message: string) => {
    toast.info(message)
  },
  warning: (message: string) => {
    toast.warning(message)
  },
  fromError: (err: unknown, fallback = 'Something went wrong') => {
    if (typeof err === 'string') return toast.error(err)
    if (err instanceof Error) return toast.error(err.message)
    return toast.error(fallback)
  },
}
