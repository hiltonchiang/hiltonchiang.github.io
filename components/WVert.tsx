import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function WVert({ children }: Props) {
  return (
    <div className="pl-1 align-middle">
      <div className="prose max-w-none align-middle text-2xl text-stone-500 [text-orientation:upright] [writing-mode:vertical-rl] dark:prose-invert dark:text-red-400 xl:col-span-2">
        {children}
      </div>
    </div>
  )
}
