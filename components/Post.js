import Link from 'next/link'
import { slugify } from '../utils'

export default function Post({ post }) {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="small text-muted">{post.frontmatter.date}</div>
       
        <div> {
                  post.frontmatter.tags.map(
                    tag => {
                      const slug = slugify(tag)
                      return (<Link key={tag} href={`/tag/${slug}`}>
                        <a className='btn'>
                          <h6 className=' post-title'>#{tag}</h6>
                        </a>
                      </Link>)
                    }
                  )
                } </div>
        <Link href={`/blog/${post.slug}`}>
          <a className="text-decoration-none">
            <h2 className="card-title">{post.frontmatter.title}</h2>
          </a>
        </Link>
        <p className="card-text">{post.frontmatter.summary}</p>
      </div>
    </div>
  )
}