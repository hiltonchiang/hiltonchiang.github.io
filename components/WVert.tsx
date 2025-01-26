import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function WVert({ children }: Props) {
  return (
    <div className="pl-1 align-middle">
      <div className="prose max-w-none align-middle text-2xl text-red-400 [text-orientation:upright] [writing-mode:vertical-rl] dark:prose-invert xl:col-span-2">
        {children}
      </div>
    </div>
  )
}
