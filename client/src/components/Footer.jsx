import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            {/* Islamic Star Border */}
            <div className="star-border"></div>

            <div className="footer-inner">
                {/* Brand Column */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                            <path d="M20 4C13 4 8 10 8 17c0 7 5 13 12 13 -4-2-7-7-7-12s3-10 7-12z" fill="#C9A96E" />
                            <polygon points="33,8 34.2,11.6 38,11.6 35,14 36,17.6 33,15.2 30,17.6 31,14 28,11.6 31.8,11.6" fill="#C9A96E" />
                        </svg>
                        <span className="footer-logo-text-group">
                            <span>Al Baith</span>
                        </span>
                    </div>
                    <p>Where timeless Arabian elegance meets modern comfort. Experience luxury that tells a story.</p>
                </div>

                {/* Links Column */}
                <div className="footer-col">
                    <h4>Menu</h4>
                    <a href="#rooms">Rooms</a>
                    <a href="#reviews">Reviews</a>
                    <Link to="/admin">Admin Access</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/cancellation-policy">Cancellation Policy</Link>
                </div>

                {/* Features Column */}
                <div className="footer-col">
                    <h4>Features</h4>
                    <a href="#">Free Wi-Fi</a>
                    <a href="#">Power Backup 24/7</a>
                    <a href="#">Lift</a>
                </div>

                {/* Social Column */}
                <div className="footer-col">
                    <h4>Connect</h4>
                    <div className="footer-social">
                        {/* Instagram */}
                        <a href="https://www.instagram.com/al.baithrooms?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <circle cx="12" cy="12" r="5" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                        {/* WhatsApp */}
                        <a href="https://wa.me/916238304411" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <span>&copy; 2026 Al Baith Hotel &amp; Resort. All rights reserved.</span>
            </div>
        </footer>
    );
}
