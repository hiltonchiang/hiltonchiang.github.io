import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function WVert({ children }: Props) {
  return (
    <div className="text-center text-2xl [text-orientation:upright] [writing-mode:vertical-rl] hover:skew-x-12">
      {children}
    </div>
  )
}
