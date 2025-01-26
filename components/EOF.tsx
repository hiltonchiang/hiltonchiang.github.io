'use client'
import { EnterIcon, ExitIcon, QuoteIcon } from '@radix-ui/react-icons'

const EOF = () => {
  return (
    <>
      <span className="inline-flex rotate-180">
        <ExitIcon color="#fcd34d" />
      </span>
      <span className="text-amber-300">-30-</span>
    </>
  )
}

export default EOF
