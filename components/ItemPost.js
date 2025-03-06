import Link from 'next/link'

export default function ItemPost({ post: {post } }) {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="small text-muted">{post.date}</div>
        <Link href={`/blog/${post.slug}`}>
          <a className="text-decoration-none">
            <h2 className="card-title">{post.title}</h2>
          </a>
        </Link>
        <p className="card-text">{post.summary}</p>
      </div>
    </div>
  )
}