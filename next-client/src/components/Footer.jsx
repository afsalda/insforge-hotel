import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                {/* Brand Column */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <Image
                            src="/albaith_logo.png"
                            alt="Al Baith Logo"
                            width={32}
                            height={32}
                            style={{ objectFit: 'contain' }}
                        />
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
                    <Link href="/login">Admin Access</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/cancellation-policy">Cancellation &amp; Refund Policy</Link>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                    <Link href="/terms">Terms &amp; Conditions</Link>
                </div>

                {/* Features Column */}
                <div className="footer-col">
                    <h4>Features</h4>
                    <span>Free Wi-Fi</span>
                    <span>Power Backup 24/7</span>
                    <span>Lift</span>
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
