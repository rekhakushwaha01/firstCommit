import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { twMerge } from './twMerge'

type Variant = 'lime' | 'ghost' | 'outline'

type CommonProps = {
  children: ReactNode
  className?: string
  variant?: Variant
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
  }

type ButtonAsLink = CommonProps & {
  to: string
}

const styles: Record<Variant, string> = {
  lime: 'bg-lime text-blue-dark hover:brightness-[0.97] shadow-[0_10px_24px_rgba(196,239,61,0.28)]',
  ghost:
    'bg-transparent text-blue-dark border border-blue-dark/15 hover:bg-surface-strong/70',
  outline:
    'bg-surface-strong/70 text-blue-dark border border-blue-dark/12 hover:border-blue/40',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold tracking-[0.08em] uppercase transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-blue disabled:cursor-not-allowed disabled:opacity-50'

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { children, className, variant = 'lime' } = props
  const classNames = twMerge(base, styles[variant], className)

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classNames}>
        {children}
      </Link>
    )
  }

  const { type = 'button', ...rest } = props as ButtonAsButton
  return (
    <button type={type} className={classNames} {...rest}>
      {children}
    </button>
  )
}
