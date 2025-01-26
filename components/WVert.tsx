import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function WVert({ children }: Props) {
  return (
    <div className="align-middle pl-1">
      <div className="prose align-middle max-w-none text-2xl text-red-400 [text-orientation:upright] [writing-mode:vertical-rl] dark:prose-invert xl:col-span-2">
        {children}
      </div>
    </div>
  )
}
