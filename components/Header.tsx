import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import HOVER from './HOVER'
import HeroLogo from './HeroLogo'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { BloggerIcon, TagIcon, LayersIcon, TimelineIcon, UserIcon } from './ExtLink'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3 transform-gpu hover:animate-pulse">
            <HeroLogo />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 transform-gpu text-2xl font-semibold hover:animate-pulse sm:block">
              <Tooltip>
                <TooltipTrigger>
                  <HOVER>{siteMetadata.headerTitle}</HOVER>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={16}
                  className="text-xs text-stone-300 dark:text-lime-300"
                >
                  一生剛克 一世沉潛
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto sm:block sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Tooltip key={link.title}>
                <TooltipTrigger>
                  <Link
                    key={link.title}
                    href={link.href}
                    className="block transform-gpu divide-y font-medium text-gray-900 hover:animate-pulse hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                  >
                    {link.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="-translate-x-6 translate-y-4 text-base text-stone-300 dark:text-lime-300"
                >
                  {link.tip}
                </TooltipContent>
              </Tooltip>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}
Header.displayName = 'Header'
export default Header
