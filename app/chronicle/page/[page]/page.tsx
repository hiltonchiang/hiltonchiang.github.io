import ListLayout from '@/layouts/TimelineLayout'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allChronicles } from 'contentlayer/generated'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allChronicles.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const posts = allCoreContent(sortPosts(allChronicles))
  const pageNumber = parseInt(params.page as string)
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
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Timeline"
    />
  )
}
