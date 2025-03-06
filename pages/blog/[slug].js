import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import Link from 'next/link'
import { slugify } from '../../utils'
import { NextSeo } from 'next-seo';
import Banner from "../../components/Banner"
import Sidebar from "../../components/Sidebar"

export default function PostPage({ content, frontmatter }) {
  return (
    <>
      <NextSeo
        title={frontmatter.title} 
        description={frontmatter.summary}
        openGraph={{
          url: 'https://niagaradataanalyst.com',
          title: frontmatter.title,
          description: frontmatter.summary,
          type: 'article',
          article: {
            publishedTime: frontmatter.date,
            authors: [
              'https://niagaradataanalyst.com/about',
            ],
            tags: frontmatter.tags,
          },
          site_name: 'Niagara Data Analyst',
        }}      
      />
      <Banner />
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <div className='card card-page'>
              <h1 className='post-title mt-2 p-2'>{frontmatter.title}</h1>
              <div className='post-date m-1 p-2'>
                <div><h6>{frontmatter.date}</h6></div>
                <div> {
                  frontmatter.categories.map(
                    category => {
                      const slug = slugify(category)
                      return (<Link key={category} href={`/category/${slug}`}>
                        <a className='btn'>
                          <h6 className=' post-title'>#{category}</h6>
                        </a>
                      </Link>)
                    }
                  )
                } </div>
              </div>

              <div className='post-body p-5 m-auto' dangerouslySetInnerHTML={{ __html: marked.parse(content) }}>
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
    // Get files from the posts dir
    const postsDirectory = path.join(process.cwd(), 'posts')
    const files = fs.readdirSync(postsDirectory)

    // Get slug and frontmatter from posts
    const paths = files
      .filter(filename => filename !== '.DS_Store' && filename.endsWith('.md'))
      .map((filename) => {
        return {
          params: {
            slug: filename.replace('.md', ''),
          },
        }
      })

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
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf-8')
    const { data: frontmatter, content } = matter(fileContents)

    return {
      props: {
        frontmatter,
        slug,
        content,
      },
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      notFound: true,
    }
  }
}