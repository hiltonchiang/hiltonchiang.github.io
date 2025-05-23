import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'
import ENTER from '@/components/ENTER'
import EOF from '@/components/EOF'
import { LayersIcon } from '@/components/ExtLink'
import { Fade, Slide } from 'react-awesome-reveal'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <Slide duration={6000} triggerOnce={true}>
            <span className="inline-flex">
              <span className="translate-y-2 sm:translate-y-5">
                <LayersIcon />
              </span>
              <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                Projects
              </h1>
            </span>
          </Slide>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Some projects I did before.
          </p>
          <ENTER />
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
        <div>
          <EOF />
        </div>
      </div>
    </>
  )
}
