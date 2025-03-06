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

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <Link href="/">
                            <a className='nav-link'>
                                <li className="nav-item"> Home </li>
                            </a>
                        </Link>
                        <li className="nav-item">
                            <a href="https://twitter.com/Osmond_Xin" target="_blank" rel="noopener noreferrer" className='nav-link'>
                                <i className="fab fa-twitter"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>
    )
}