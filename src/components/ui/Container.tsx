import type { ReactNode } from 'react'
import { twMerge } from './twMerge'

type ContainerProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'header' | 'footer'
}

export function Container({ children, className, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={twMerge('mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10', className)}>
      {children}
    </Tag>
  )
}
