'use client'
import { ReactNode } from 'react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface Props {
  contents: string
  children: ReactNode
}

export default function TooltipX({ contents, children }: Props) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return null
  }
  return (
    <>
      <div className="relative inline-block">
        {children}
        <div className="roup-hover:opacity-1 pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-800 p-2 text-sm text-white opacity-0 transition-opacity duration-300">
          {contents}
        </div>
      </div>
    </>
  )
}
TooltipX.displayName = 'TooltipX'
