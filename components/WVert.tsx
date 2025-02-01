import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function WVert({ children }: Props) {
  return (
    <div className="prose max-w-none translate-x-16 border border-stone-300 p-10 align-middle text-2xl text-stone-500 [text-orientation:upright] [writing-mode:vertical-rl] dark:prose-invert dark:border-slate-500 dark:text-red-400 xl:col-span-2">
      {children}
    </div>
  )
}
WVert.displayName = 'WVert'
