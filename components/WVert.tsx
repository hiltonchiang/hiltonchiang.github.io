import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function WVert({ children }: Props) {
  return (
    <div className="pl-16">
      <div className="prose max-w-none text-2xl [text-orientation:upright] [writing-mode:vertical-rl] dark:prose-invert xl:col-span-2">
        {children}
      </div>
    </div>
  )
}
