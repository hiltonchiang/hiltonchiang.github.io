import TimelineLayout from '@/layouts/TimelineLayout'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allChronicles } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Profile' })

export default function Page() {
  const posts = allCoreContent(sortPosts(allChronicles))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <TimelineLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Timeline"
    />
  )
}
