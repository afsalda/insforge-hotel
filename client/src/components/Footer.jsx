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
                            <span className="footer-logo-arabic">البيت</span>
                        </span>
                    </div>
                    <span className="footer-arabic-tagline">فندق البيت الفاخر</span>
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
                    <a href="#">Spa &amp; Wellness</a>
                    <a href="#">Fine Dining</a>
                    <a href="#">Airport Shuttle</a>
                    <a href="#">Concierge</a>
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
                        {/* Twitter/X */}
                        <a href="#" aria-label="Twitter">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                            </svg>
                        </a>
                        {/* Facebook */}
                        <a href="#" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>
                        {/* YouTube */}
                        <a href="#" aria-label="YouTube">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
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
