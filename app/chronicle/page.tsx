import TimelineLayout from '@/layouts/TimelineLayout'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allChronicles } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'

const POSTS_PER_PAGE = 5
const summary = 'Chronically show where I studied, where I worked and what I did.'
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
      summary={summary}
    />
  )
}
