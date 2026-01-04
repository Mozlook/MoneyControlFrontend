import { cn } from './cn'

export type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  invalid?: boolean
  ref?: React.Ref<HTMLInputElement>
}

export default function Input({ className, invalid, ref: inputRef, ...props }: InputProps) {
  const base =
    'h-10 w-full rounded-md px-3 text-sm ' +
    'border border-slate-300 bg-white ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'placeholder:text-slate-400 ' +
    'disabled:cursor-not-allowed disabled:opacity-50'

  const invalidClasses = 'border-red-500 focus-visible:ring-red-500'

  return (
    <input
      {...props}
      ref={inputRef}
      className={cn(base, invalid && invalidClasses, className)}
      aria-invalid={invalid ? true : undefined}
    />
  )
}
