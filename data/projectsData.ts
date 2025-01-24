interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Peer-to-Peer VoIP',
    description: `I co-funded a start-up doing VoIP business. The key tech is to find a way to traverse NAT so that it can establish a so called peer-to-peer VoIP communication path.`,
    imgSrc: '/static/images/sequence-port-forwarding.png',
    href: '/blog/voip',
  },
  {
    title: `Hilton's Blogs`,
    description: `This is my first personal web page using nextjs to show my blogs previously posted on WordPress.`,
    imgSrc: '/static/images/github-io-blog.png',
    href: '/blog/',
  },
  {
    title: `Android Phone`,
    description: `This was a long-lasting project I joined for 13 years.`,
    imgSrc: '/static/images/black-phone.svg',
    href: '/blog/android-phone',
  },
]

export default projectsData
