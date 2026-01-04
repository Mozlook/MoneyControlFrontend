import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-slate-900 text-white hover:bg-slate-800',
        secondary: 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50',
        ghost: 'bg-transparent text-slate-900 hover:bg-slate-100',
        danger: 'bg-red-600 text-white hover:bg-red-500',
        link: 'bg-transparent text-slate-900 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
    compoundVariants: [{ variant: 'link', className: 'h-auto p-0' }],
  },
)

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }

export default function Button({
  className,
  variant,
  size,
  loading,
  disabled,
  type,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading)

  return (
    <button
      {...props}
      type={type ?? 'button'}
      disabled={isDisabled}
      aria-busy={loading ? true : undefined}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </button>
  )
}
