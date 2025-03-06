import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { NextSeo } from 'next-seo'
import Post from '../../components/Post'
import Banner from "../../components/Banner"
import Sidebar from "../../components/Sidebar"
import { slugify } from '../../utils'

export default function CategoryPage({ posts, category }) {
  return (
    <>
      <NextSeo
        title={`Posts in category "${category}"`}
        description={`All posts in category "${category}" - Niagara Data Analyst`}
        openGraph={{
          title: `Posts in category "${category}"`,
          description: `All posts in category "${category}" - Niagara Data Analyst`,
          url: `https://niagaradataanalyst.com/category/${slugify(category)}`,
          site_name: 'Niagara Data Analyst',
        }}
      />
      <Banner />
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                Posts in category &quot;{category}&quot;
              </div>
              <div className="card-body">
                {posts.length === 0 ? (
                  <p>No posts found in category &quot;{category}&quot;.</p>
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

    // Get all unique categories
    const categories = new Set()
    files
      .filter(filename => filename !== '.DS_Store' && filename.endsWith('.md'))
      .forEach(filename => {
        const fullPath = path.join(postsDirectory, filename)
        const fileContents = fs.readFileSync(fullPath, 'utf-8')
        const { data: frontmatter } = matter(fileContents)
        frontmatter.categories.forEach(category => categories.add(category))
      })

    // Create paths for each category
    const paths = Array.from(categories).map(category => ({
      params: {
        slug: slugify(category),
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

    // Get posts with matching category
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
      .filter(post => post.frontmatter.categories.some(category => slugify(category) === slug))

    // Get the category name from the first post
    const category = posts[0]?.frontmatter.categories.find(c => slugify(c) === slug)

    if (!category) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        posts,
        category,
      },
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      notFound: true,
    }
  }
}
