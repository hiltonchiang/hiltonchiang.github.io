import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs, allChronicles } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export default function BlogPage() {
  const posts = allCoreContent(sortPosts(allBlogs))
  const refs = allCoreContent(sortPosts([]))
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
    <ListLayout
      posts={posts}
      refs={refs}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
