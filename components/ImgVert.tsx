'use client'
import Image from './Image'

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
      <div className="pl-16">
        <div className="prose mt-3 max-w-none text-2xl text-red-400 [text-orientation:upright] [writing-mode:vertical-rl] dark:prose-invert xl:col-span-2">
          {texts.map((t) => (
            <p key={t}> {t} </p>
          ))}
        </div>
      </div>
    </>
  )
}

export default ImgVert
