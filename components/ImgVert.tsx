'use client'
import Image from './Image'
import { EnterIcon, ExitIcon, QuoteIcon } from '@radix-ui/react-icons'

interface Props {
  texts: string[]
  imgSrc: string
  imgAlt: string
  height: string
}
const ImgVert = ({ texts, imgSrc, imgAlt, height = '60' }: Props) => {
  // const clsString = "object-cover object-center md:h-44 lg:h-".concat(height)
  const clsString = 'object-cover object-center'
  return (
    <>
      <div className="w-full transform-gpu overflow-hidden px-2 hover:scale-125 xl:my-1 xl:w-1/2 xl:px-2">
        <img alt={imgAlt} src={imgSrc} className={clsString} />
      </div>
      <table className="...table-fixed border-collapse items-center border border-stone-300 dark:border-slate-500">
        <tbody>
          <tr>
            <td>
              <div className="p-4 align-middle">
                <div className="prose max-w-none align-middle text-2xl text-stone-500 [text-orientation:upright] [writing-mode:vertical-rl] dark:prose-invert dark:text-red-400 xl:col-span-2">
                  {texts.map((t) => (
                    <p key={t}> {t} </p>
                  ))}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default ImgVert
