import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs, allChronicles } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import refData from 'app/ref-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const paths = tagKeys.map((tag) => ({
    tag: encodeURI(tag),
  }))
  const refCounts = refData as Record<string, number>
  const refKeys = Object.keys(refCounts)
  const refPaths = refKeys.map((tag) => ({
    tag: encodeURI(tag),
  }))
  return paths.concat(refPaths)
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )
  const filteredRefs = allCoreContent(
    sortPosts(
      allChronicles.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag))
    )
  )

  if (filteredPosts.length > 0) {
    const refs = allCoreContent(sortPosts([]))
    return <ListLayout posts={filteredPosts} refs={refs} title={title} />
  }
  if (filteredRefs.length > 0) {
    const posts = allCoreContent(sortPosts([]))
    return <ListLayout posts={posts} refs={filteredRefs} title={title} />
  }
  return notFound()
}
