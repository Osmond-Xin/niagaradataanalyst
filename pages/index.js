import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { NextSeo } from 'next-seo';
import Post from '../components/Post'
import Sidebar from "../components/Sidebar"
import { sortByDate, slugify } from '../utils'

export default function Home({ posts }) {
  return (
    <div>
      <NextSeo
        title="Welcome to Niagara Data Analyst"
        description="Data Analysis and Insights from Niagara Region - Professional Data Analysis Services and Consulting"
        openGraph={{
          url: 'https://niagaradataanalyst.com',
          title: 'Welcome to Niagara Data Analyst',
          description: 'Data Analysis and Insights from Niagara Region - Professional Data Analysis Services and Consulting',
          images: [
            {
              url: 'https://niagaradataanalyst.com/banner.png',
              width: 1224,
              height: 724,
              alt: 'Niagara Data Analyst Banner',
              type: 'image/jpeg',
            },
          ],
          site_name: 'Niagara Data Analyst',
        }}      
      />
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-8">
            {posts && posts.length > 0 ? (
              posts.map((post, index) => (
                <Post key={index} post={post} />
              ))
            ) : (
              <div className="card mb-4">
                <div className="card-body">
                  <p>No articles found. Please check back later.</p>
                </div>
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  try {
    // Get files from the posts dir
    const postsDirectory = path.join(process.cwd(), 'posts')
    const files = fs.readdirSync(postsDirectory)
    console.log('Found files:', files)

    // Get slug and frontmatter from posts
    const posts = files
      .filter(filename => filename !== '.DS_Store' && filename.endsWith('.md'))
      .map((filename) => {
        try {
          // Create slug
          const slug = filename.replace('.md', '')

          // Get frontmatter
          const fullPath = path.join(postsDirectory, filename)
          const fileContents = fs.readFileSync(fullPath, 'utf-8')
          const { data: frontmatter } = matter(fileContents)
          console.log('Processing file:', filename, 'Frontmatter:', frontmatter)

          return {
            slug,
            frontmatter,
          }
        } catch (error) {
          console.error(`Error processing file ${filename}:`, error)
          return null
        }
      })
      .filter(post => post !== null)

    console.log('Final posts:', posts)

    // Write posts to search.json
    try {
      const jsonString = JSON.stringify(posts)
      fs.writeFileSync(path.join(process.cwd(), 'search.json'), jsonString)
      console.log('Successfully wrote search.json')
    } catch (err) {
      console.error('Error writing search.json:', err)
    }

    return {
      props: {
        posts: posts.sort(sortByDate),
      },
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      props: {
        posts: [],
      },
    }
  }
}


 
