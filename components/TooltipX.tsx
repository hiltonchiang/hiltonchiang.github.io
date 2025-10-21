'use client'

import { cn } from '@/lib/utils'

interface Props {
  contents: string[]
}

export default function TooltipX({ contents }: Props) {
  return (
    <>
      <div
        className={cn(
          'bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          'pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-6 translate-y-4 overflow-hidden',
          'rounded rounded-md border bg-gray-800 p-2 px-3 py-1.5',
          'text-base text-sm text-stone-300',
          'opacity-0 shadow-md transition-opacity duration-300',
          'group-hover:opacity-100 dark:text-lime-300'
        )}
      >
        {contents.map((t) => (
          <p key={t}> {t} </p>
        ))}
      </div>
    </>
  )
}
TooltipX.displayName = 'TooltipX'
