'use client'

import { ReactNode } from 'react'
interface Props {
  children: ReactNode
}

export default function ExtLink({ children }: Props) {
  return (
    <span className="group inline-flex justify-between">
      {children}
      <span className="group-hover:translate-y-2">
        <SymbolExtLink />
      </span>
    </span>
  )
}
ExtLink.displayName = 'ExtLink'

export function ContentColor({ children }: Props) {
  return <span className="text-stone-500 dark:text-red-400">{children}</span>
}
ContentColor.displayName = 'ContentColor'

export function SymbolArrow() {
  return (
    <>
      <span className="inline-flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          strokeLinejoin="round"
          fill="currentColor"
          viewBox="0 0 16 16"
          width="16"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d=" M6.75011 4H6.00011V5.5H6.75011H9.43945L5.46978 9.46967L4.93945 10L6.00011 11.0607L6.53044 10.5303L10.499 6.56182V9.25V10H11.999V9.25V5C11.   999 4.44772 11.5512 4 10. 999 4H6.75011Z"
          />
        </svg>
      </span>
    </>
  )
}
SymbolArrow.displayName = 'SymbolArrow'

export function Symbol1f517() {
  return (
    <>
      <svg
        className="mr-2 flex-shrink-0"
        height="16"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        strokeLinejoin="round"
        fill="currentColor"
      >
        <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>
      </svg>
    </>
  )
}
Symbol1f517.displayName = 'Symbol1f517'

export function SymbolExtLink() {
  return (
    <>
      <svg
        className="mr-2 flex-shrink-0"
        height="16"
        strokeLinejoin="round"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.5 9.75V11.25C11.5 11.3881 11.3881 11.5 11.25 11.5H4.75C4.61193 11.5 4.5 11.3881 4.5 11.25L4.5 4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H6.25H7V3H6.25H4.75C3.7835 3 3 3.7835 3 4.75V11.25C3 12.2165 3.7835 13 4.75 13H11.25C12.2165 13 13 12.2165 13 11.25V9.75V9H11.5V9.75ZM8.5 3H9.25H12.2495C12.6637 3 12.9995 3.33579 12.9995 3.75V6.75V7.5H11.4995V6.75V5.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L10.4388 4.5H9.25H8.5V3Z"
        ></path>
      </svg>
    </>
  )
}
SymbolExtLink.displayName = 'SymbolExtLink'
