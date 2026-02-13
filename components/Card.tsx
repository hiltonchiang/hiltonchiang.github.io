import Image from './Image'
import Link from './Link'
import { SymbolArrow, Symbol1f517 } from './ExtLink'
const Card = ({ title, description, imgSrc, href }) => (
  <div className="md grid gap-x-4 gap-y-8 relative max-w-[544px] p-4 before:absolute before:-inset-1 before:z-[-1] before:skew-x-1 before:skew-y-2 before:bg-[#030a2e] before:bg-[linear-gradient(-45deg,_#687bdd_0%,_#221e22_50%,_#e90e45_100%)] before:content-[''] after:absolute after:-inset-1 after:z-[-1] after:skew-x-1 after:skew-y-2 after:bg-[#030a2e] after:bg-[linear-gradient(-45deg,_#687bdd_0%,_#221e22_50%,_#e90e45_100%)] after:blur-[50px] after:content-[''] md:w-1/2">
    <div
      className={`${
        imgSrc && 'h-full'
      }  hover:scale-125 overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60dark:border-gray-700`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-44 lg:h-60"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-44 lg:h-60"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              <div className="inline-flex items-center justify-between">
                {title}
                <div className="ms-3 mt-1">
                  <Symbol1f517 />
                </div>
              </div>
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
        {href && (
          <Link
            href={href}
            className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label={`Link to ${title}`}
          >
            Learn more &#8625;
          </Link>
        )}
      </div>
    </div>
  </div>
)
Card.displayName = 'Card'
export default Card
