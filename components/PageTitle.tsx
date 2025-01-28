import { ReactNode } from 'react'
import HOVER from '@/components/HOVER'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
      <HOVER>{children}</HOVER>
    </h1>
  )
}
