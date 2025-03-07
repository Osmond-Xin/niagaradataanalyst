import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import Link from 'next/link'
import { slugify } from '../../utils'
import { NextSeo } from 'next-seo';
import Sidebar from "../../components/Sidebar"
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// 配置 marked 使用 highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (__) {}
    }
    return code;
  },
  langPrefix: 'hljs language-'
});

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
      <div className="container-fluid px-4 my-5">
        <div className="row">
          <div className="col-12 col-lg-8">
            <div className='card w-100'>
              <div className="card-body p-4">
                <div className="w-100">
                  <h1 className='post-title mb-3'>{frontmatter.title}</h1>
                  <div className='post-date mb-4'>
                    <div className="mb-2"><h6>{frontmatter.date}</h6></div>
                    <div className="d-flex flex-wrap gap-2"> {
                      frontmatter.categories.map(
                        category => {
                          const slug = slugify(category)
                          return (<Link key={category} href={`/category/${slug}`}>
                            <a className='btn btn-sm btn-outline-primary'>
                              #{category}
                            </a>
                          </Link>)
                        }
                      )
                    } </div>
                  </div>

                  <div className='post-body' dangerouslySetInnerHTML={{ __html: marked.parse(content) }}>
                  </div>
                </div>
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