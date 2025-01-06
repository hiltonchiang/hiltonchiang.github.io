interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'A Search Engine',
    description: `What if you could look up any information in the world? Webpages, images, videos
    and more. Google has many features to help you find exactly what you're looking
    for.`,
    imgSrc: '/static/images/google.png',
    href: 'https://www.google.com',
  },
  {
    title: `Hilton's Blogs`,
    description: `This is my first personal web page using nextjs to show my blogs previously posted on WordPress.`,
    imgSrc: '/static/images/github-io-blog.png',
    href: '/blog/',
  },
]

export default projectsData
