import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface FieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
}

export function Field({ label, htmlFor, error, hint, required, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-navy-400">{hint}</p>
      ) : null}
    </div>
  )
}

export function inputClass(error?: string, extra?: string) {
  return cn('input', error && 'input-error', extra)
}
