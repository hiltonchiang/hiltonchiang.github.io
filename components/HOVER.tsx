'use client'
import { ReactNode } from 'react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface Props {
  children: ReactNode
}

export default function HOVER({ children }: Props) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return null
  }
  return (
    <>
      {resolvedTheme === 'dark' ? (
        <span className="hover:text-lime-300 group-hover:text-amber-300">{children}</span>
      ) : (
        <span className="hover:text-stone-500 group-hover:text-stone-500">{children}</span>
      )}
    </>
  )
}
HOVER.displayName = 'HOVER'
