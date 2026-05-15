import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/albaith_logo.png';

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
          <img src={logoImg} alt="Al Baith Logo" className="logo-icon" />
        </Link>

        <ul className="nav-links">
          <li><Link to="/#rooms" onClick={(e) => handleNavClick(e, 'rooms')}>Rooms</Link></li>
          <li><Link to="/#reviews" onClick={(e) => handleNavClick(e, 'reviews')}>Reviews</Link></li>
        </ul>

        <Link to="/#rooms" onClick={(e) => handleNavClick(e, 'rooms')} className="btn-book-now">BOOK NOW</Link>

        {!mobileOpen && (
          <button
            className="nav-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}>
        <button 
          className="mobile-nav-close" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMobileOpen(false);
          }} 
          aria-label="Close menu"
        >
          ✕
        </button>
        <Link to="/#rooms" onClick={(e) => handleNavClick(e, 'rooms')}>Rooms</Link>
        <Link to="/#reviews" onClick={(e) => handleNavClick(e, 'reviews')}>Reviews</Link>
        <Link to="/#rooms" onClick={(e) => handleNavClick(e, 'rooms')} style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}>Book Now</Link>
      </div>
    </>
  );
}
