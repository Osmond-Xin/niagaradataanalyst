import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { NextSeo } from 'next-seo'
import Post from '../../components/Post'
import Banner from "../../components/Banner"
import Sidebar from "../../components/Sidebar"
import { slugify } from '../../utils'

export default function TagPage({ posts, tag }) {
  return (
    <>
      <NextSeo
        title={`Posts tagged with "${tag}"`}
        description={`All posts tagged with "${tag}" - Niagara Data Analyst`}
        openGraph={{
          title: `Posts tagged with "${tag}"`,
          description: `All posts tagged with "${tag}" - Niagara Data Analyst`,
          url: `https://niagaradataanalyst.com/tag/${slugify(tag)}`,
          site_name: 'Niagara Data Analyst',
        }}
      />
      <Banner />
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                Posts tagged with &quot;{tag}&quot;
              </div>
              <div className="card-body">
                {posts.length === 0 ? (
                  <p>No posts found with tag &quot;{tag}&quot;.</p>
                ) : (
                  posts.map((post, index) => (
                    <Post key={index} post={post} />
                  ))
                )}
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts')
    const files = fs.readdirSync(postsDirectory)

    // Get all unique tags
    const tags = new Set()
    files
      .filter(filename => filename !== '.DS_Store' && filename.endsWith('.md'))
      .forEach(filename => {
        const fullPath = path.join(postsDirectory, filename)
        const fileContents = fs.readFileSync(fullPath, 'utf-8')
        const { data: frontmatter } = matter(fileContents)
        frontmatter.tags.forEach(tag => tags.add(tag))
      })

    // Create paths for each tag
    const paths = Array.from(tags).map(tag => ({
      params: {
        slug: slugify(tag),
      },
    }))

    return {
      paths,
      fallback: false,
    }
  } catch (error) {
    console.error('Error in getStaticPaths:', error)
    return {
      paths: [],
      fallback: false,
    }
  }
}

export async function getStaticProps({ params: { slug } }) {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts')
    const files = fs.readdirSync(postsDirectory)

    // Get posts with matching tag
    const posts = files
      .filter(filename => filename !== '.DS_Store' && filename.endsWith('.md'))
      .map(filename => {
        const fullPath = path.join(postsDirectory, filename)
        const fileContents = fs.readFileSync(fullPath, 'utf-8')
        const { data: frontmatter } = matter(fileContents)
        return {
          slug: filename.replace('.md', ''),
          frontmatter,
        }
      })
      .filter(post => post.frontmatter.tags.some(tag => slugify(tag) === slug))

    // Get the tag name from the first post
    const tag = posts[0]?.frontmatter.tags.find(t => slugify(t) === slug)

    return {
      props: {
        posts,
        tag,
      },
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      notFound: true,
    }
  }
}
