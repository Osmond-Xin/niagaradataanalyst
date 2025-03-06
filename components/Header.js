import Link from 'next/link'
export default function Header() {
    return (<>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link href="/">
                    <a className='navbar-brand'>
                        Niagara Data Analyst
                    </a>
                </Link>

                <div className="d-flex align-items-center">
                    <a href="https://twitter.com/Osmond_Xin" target="_blank" rel="noopener noreferrer" className='nav-link'>
                        <i className="fab fa-twitter"></i>
                    </a>
                </div>
            </div>
        </nav>
    </>
    )
}