'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { EnterIcon, ExitIcon, QuoteIcon } from '@radix-ui/react-icons'

interface Props {
  lastmod?: string
}
const ENTER = ({ lastmod }: Props) => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return null
  }
  return (
    <div className="group relative">
      <span className="inline-flex justify-between group-hover:-translate-x-2">
        <EnterIcon color={resolvedTheme === 'dark' ? '#fcd34d' : '#78716c'} />
      </span>
      <span className="text-stone-500 dark:text-amber-300">STX</span>
      {lastmod !== undefined && (
        <span className="absolute right-0 top-0 hidden text-stone-500 dark:text-amber-300 md:block">
          {' '}
          1<sup>st</sup> publish: {lastmod}
        </span>
      )}
    </div>
  )
}
ENTER.displayName = 'ENTER'
export default ENTER
