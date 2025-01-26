'use client'
import { EnterIcon, ExitIcon, QuoteIcon } from '@radix-ui/react-icons'

const ENTER = () => {
  return (
    <div>
      <span className="inline-flex justify-between text-red-500">
        <EnterIcon color="#fcd34d" />
      </span>
      <span className="text-amber-300">STX</span>
    </div>
  )
}

export default ENTER
