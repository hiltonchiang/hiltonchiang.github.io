'use client'
import { EnterIcon, ExitIcon, QuoteIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const EOF = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return null
  }
  return (
    <div className="group">
      <span className="inline-flex rotate-180 group-hover:-translate-x-2">
        <ExitIcon color={resolvedTheme === 'dark' ? '#fcd34d' : '#78716c'} />
      </span>
      <span className="text-stone-500 dark:text-amber-300">-30-</span>
    </div>
  )
}

export default EOF
