import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import Post from '../components/Post'
import Banner from "../components/Banner"
import Sidebar from "../components/Sidebar"
import Search from "../search.json"

export default function SearchPage() {
  const router = useRouter()
  const { q } = router.query

  // 如果没有搜索词，显示所有文章
  const posts = q
    ? Search.filter(post => 
        post.frontmatter.title.toLowerCase().includes(q.toLowerCase()) ||
        post.frontmatter.description.toLowerCase().includes(q.toLowerCase()) ||
        post.frontmatter.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()))
      )
    : Search

  return (
    <>
      <NextSeo
        title={`Search results for "${q || 'all posts'}"`}
        description={`Search results for "${q || 'all posts'}" - Niagara Data Analyst`}
        openGraph={{
          title: `Search results for "${q || 'all posts'}"`,
          description: `Search results for "${q || 'all posts'}" - Niagara Data Analyst`,
          url: `https://niagaradataanalyst.com/search${q ? `?q=${q}` : ''}`,
          site_name: 'Niagara Data Analyst',
        }}
      />
      <Banner />
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                {q ? `Search results for "${q}"` : 'All Posts'}
              </div>
              <div className="card-body">
                {posts.length === 0 ? (
                  <p>No posts found matching your search.</p>
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
