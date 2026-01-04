import { cn } from './cn'

export type FieldErrorProps = React.ComponentPropsWithoutRef<'p'>

export default function FieldError({ className, children, ...props }: FieldErrorProps) {
  const base = 'mt-1 text-sm text-red-600'

  if (!children) return null
  return (
    <p {...props} role="alert" className={cn(base, className)} aria-live="polite">
      {children}
    </p>
  )
}
