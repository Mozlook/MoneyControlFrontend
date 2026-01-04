import { cn } from './cn'

export type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
  center?: boolean
}

export default function Spinner({
  size = 'md',
  className,
  label = 'loading',
  center,
}: SpinnerProps) {
  const base = 'inline-block animate-spin rounded-full border-current border-t-transparent'

  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-4',
  } as const
  return (
    <div
      className={cn(base, sizeClasses[size], center && 'mx-auto', className)}
      role="status"
      aria-label={label}
    />
  )
}
