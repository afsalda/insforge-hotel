import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80; // Adjust for navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
      setMobileOpen(false);
    }
  };

  return (
    <>
      <nav className={`navbar ${(!isHomePage || scrolled) ? 'scrolled' : ''}`}>
        <Link to="/" className="navbar-logo">
          {/* Gold Crescent + Star Icon */}
          <svg className="logo-icon" viewBox="0 0 40 40" fill="none">
            <path d="M20 4C13 4 8 10 8 17c0 7 5 13 12 13 -4-2-7-7-7-12s3-10 7-12z" fill="currentColor" />
            <polygon points="33,8 34.2,11.6 38,11.6 35,14 36,17.6 33,15.2 30,17.6 31,14 28,11.6 31.8,11.6" fill="currentColor" />
          </svg>
          <span className="logo-text-group">
            <span className="logo-name">Al Baith</span>
          </span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/#rooms" onClick={(e) => handleNavClick(e, 'rooms')}>Rooms</Link></li>
          <li><Link to="/#reviews" onClick={(e) => handleNavClick(e, 'reviews')}>Reviews</Link></li>
        </ul>

        <Link to="/#rooms" onClick={(e) => handleNavClick(e, 'rooms')} className="btn-book-now">Book Now</Link>

        <button
          className="nav-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">✕</button>
        <Link to="/#rooms" onClick={(e) => handleNavClick(e, 'rooms')}>Rooms</Link>
        <Link to="/#reviews" onClick={(e) => handleNavClick(e, 'reviews')}>Reviews</Link>
        <Link to="/#rooms" onClick={(e) => handleNavClick(e, 'rooms')} style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}>Book Now</Link>
      </div>
    </>
  );
}
