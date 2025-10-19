import { BloggerIcon, TagIcon, LayersIcon, TimelineIcon, UserIcon, HomeIcon, FamilyIcon } from '@/components/ExtLink'
import WVert from '@/components/WVert'

const headerNavLinks = [
  { href: '/', title: 'Home', tip:'Home', icon: <HomeIcon /> },
  { href: '/blog', title: 'Blog', tip: 'Blogs', icon: <BloggerIcon /> },
  { href: '/tags', title: 'Tags', tip: 'Tags' , icon: <TagIcon />   },
  { href: '/projects', title: 'Projects', tip:'Projects', icon: <LayersIcon /> },
  { href: '/chronicle', title: 'Profile', tip:'Timeline', icon: <TimelineIcon /> },
  { href: '/blog/family-root', title: 'FamilyTree', tip:'FamilyTree', icon: <FamilyIcon /> },
  { href: '/about', title: 'About',tip:'About' , icon: < UserIcon /> },
]

export default headerNavLinks
