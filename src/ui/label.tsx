import { cn } from './cn'

export type LabelProps = React.ComponentPropsWithoutRef<'label'>

export default function Label({ className, children, ...props }: LabelProps) {
  const base = 'text-sm font-medium leading-none'

  return (
    <label {...props} className={cn(base, className)}>
      {children}
    </label>
  )
}
