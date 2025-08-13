interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Peer-to-Peer VoIP',
    description: `I co-founded a startup specializing in VoIP technology. Our core innovation was developing a method to traverse NAT, enabling the establishment of true peer-to-peer VoIP communication channels.`,
    imgSrc: '/static/images/sequence-port-forwarding.png',
    href: '/blog/voip',
  },
  {
    title: `Hilton's Blogs`,
    description: `This is my first personal website built with Next.js, designed to showcase my previously published WordPress blog posts.`,
    imgSrc: '/static/images/github-io-blog.png',
    href: '/blog/',
  },
  {
    title: `Android Phone`,
    description: `I was involved in this project for 13 years, making it one of my longest professional commitments.`,
    imgSrc: '/static/images/black-phone.svg',
    href: '/blog/android-phone',
  },
]

export default projectsData
