import { ReactNode } from 'react'

interface Props {
  children: string
}

export default function WVertX({ children }: Props) {
  return (
    <div
      id="three-wvertx-tooltips"
      className="prose max-w-none translate-x-16 border border-stone-300 p-10 align-middle text-2xl text-stone-500 dark:prose-invert dark:border-slate-500 dark:text-red-400 xl:col-span-2"
    >
      {children}
    </div>
  )
}
WVertX.displayName = 'WVertX'
