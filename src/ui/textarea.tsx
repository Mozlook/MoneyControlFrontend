import { cn } from './cn'

export type TextareaProps = React.ComponentPropsWithoutRef<'textarea'> & {
  invalid?: boolean
  ref?: React.Ref<HTMLTextAreaElement>
}

export default function Textarea({ className, invalid, ref: inputRef, ...props }: TextareaProps) {
  const base =
    'min-h-[80px] py-2 w-full rounded-md px-3 text-sm resize-y ' +
    'border border-slate-300 bg-white ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'placeholder:text-slate-400 ' +
    'disabled:cursor-not-allowed disabled:opacity-50'

  const invalidClasses = 'border-red-500 focus-visible:ring-red-500'

  return (
    <textarea
      {...props}
      ref={inputRef}
      className={cn(base, invalid && invalidClasses, className)}
      aria-invalid={invalid ? true : undefined}
    />
  )
}
