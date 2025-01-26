'use client'
import { EnterIcon, ExitIcon, QuoteIcon } from '@radix-ui/react-icons'

interface Props {
  texts: string[]
}
const BlockQuotes = ({ texts }: Props) => {
  return (
    <>
      <div className="my-1 w-full overflow-hidden px-2 text-2xl xl:my-1 xl:w-full xl:px-2">
        <blockquote>
          {texts.map((t) => (
            <p key={t}> {t} </p>
          ))}
        </blockquote>
      </div>
    </>
  )
}
export default BlockQuotes
