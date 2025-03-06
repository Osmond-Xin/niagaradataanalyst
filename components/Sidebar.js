import { useState } from "react";
import Link from 'next/link'
import Search from "../search.json";
import { slugify } from "../utils";
import { useRouter } from 'next/router';

export default function Sidebar() {
  const [search, setSearch] = useState('')
  const router = useRouter()
  
  function findSearch(value) {
    setSearch(value.target.value)
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      router.push({
        pathname: '/search',
        query: { q: search?.toLowerCase() }
      });
    }
  }

  // 获取去重后的分类列表
  const uniqueCategories = [...new Set(
    Search?.flatMap(post => post.frontmatter.categories)
  )].sort()
 
  return (
    <div className="col-lg-4">
      <div className="card mb-4">
        <div className="card-header">Search</div>
        <div className="card-body">
          <div className="input-group">
            <input 
              onChange={findSearch} 
              onKeyPress={handleKeyPress}
              className="form-control" 
              type="text" 
              placeholder="Search data analysis articles..." 
              aria-label="Search data analysis articles" 
              aria-describedby="button-search"
              value={search}
            />
            <Link href={{ pathname: '/search', query: { q: search?.toLowerCase() } }}> 
              <a className="btn btn-primary" id="button-search">Search</a>
            </Link>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">Categories</div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-10">
              <ul className="list-unstyled mb-0">
                {uniqueCategories.map(category => {
                  const slug = slugify(category)
                  return (
                    <Link key={category} href={`/category/${slug}`}>
                      <a><li>{category}</li></a>
                    </Link>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">About</div>
        <div className="card-body">
          <p>Professional data analysis services and insights from Niagara Region.</p>
          <p className="mb-0">For inquiries or collaborations, please contact: <a href="mailto:yi.xin7319@myunfc.ca" className="text-decoration-none text-primary hover-opacity" style={{ transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = '0.8'} onMouseOut={e => e.target.style.opacity = '1'}>yi.xin7319@myunfc.ca</a></p>
        </div>
      </div>
    </div>
  )
}