import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Clock, X, ExternalLink } from 'lucide-react';

/* ─── Ornamental SVG Divider ─── */
function OrnamentalDivider() {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    ref.current?.querySelectorAll('.svg-divider-draw').forEach(el => el.classList.add('visible'));
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="ornamental-divider" ref={ref} style={{ margin: '40px auto 20px' }}>
            <svg width="200" height="60" viewBox="0 0 200 60" fill="none">
                <path className="svg-divider-draw" d="M10,55 Q10,10 100,10 Q190,10 190,55" stroke="#C9A96E" strokeWidth="1.5" fill="none" />
                <circle cx="100" cy="10" r="3" fill="#C9A96E" opacity="0.6" />
                <line className="svg-divider-draw" x1="40" y1="55" x2="160" y2="55" stroke="#C9A96E" strokeWidth="0.8" />
                <circle cx="40" cy="55" r="2" fill="#C9A96E" opacity="0.4" />
                <circle cx="160" cy="55" r="2" fill="#C9A96E" opacity="0.4" />
            </svg>
        </div>
    );
}

export default function ContactPage() {
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="contact-page-wrapper">
            {/* ─── Hero Section ─── */}
            <section className="contact-hero-alt">
                <div className="hero-bg-overlay">
                    <img
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80"
                        alt="Luxury hotel detail"
                        loading="eager"
                    />
                </div>
                <div className="hero-content">
                    <div className="hero-text" style={{ textAlign: 'center' }}>
                        <h1 className="hero-headline">Let us elevate your experience</h1>
                        <p className="hero-subtext" style={{ marginInline: 'auto' }}>
                            Our dedicated concierge team is at your service 24/7 to ensure your journey with Al Baith is nothing short of extraordinary.
                        </p>
                    </div>
                </div>
            </section>

            <OrnamentalDivider />

            {/* ─── Content Section ─── */}
            <section className="contact-main">
                <div className="section-header">
                    <h2 className="section-title">Visit Us or Get in Touch</h2>
                    <p className="section-subtitle">Experience the art of hospitality. We are located in the heart of the city, ready to welcome you home.</p>
                </div>

                <div className="contact-container">
                    <div className="contact-info-grid-centered">
                        {/* Interactive Location Card */}
                        <div
                            className={`contact-info-card location-card ${showMap ? 'expanded' : ''}`}
                            onClick={() => setShowMap(!showMap)}
                            role="button"
                            aria-expanded={showMap}
                        >
                            <div className="card-icon"><MapPin size={32} /></div>
                            <h3>Location</h3>
                            <p>Al-Baith Resthouse<br />Kochi, Kerala, India</p>
                            <span className="map-toggle-hint">
                                {showMap ? 'Close Map' : 'View on Map'}
                                <ExternalLink size={14} style={{ marginLeft: '6px' }} />
                            </span>

                            {showMap && (
                                <div className="mini-map-container" onClick={(e) => e.stopPropagation()}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.1776017265493!2d76.31495617479247!3d9.919162090182168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0873f4e02b7091%3A0x14f8d912261157fd!2sAl-Baith%20Resthouse!5e0!3m2!1sen!2sin!4v1771597606963!5m2!1sen!2sin"
                                        width="100%"
                                        height="300"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Al-Baith Resthouse Location"
                                    ></iframe>
                                </div>
                            )}
                        </div>

                        <div className="contact-info-card">
                            <div className="card-icon"><Phone size={32} /></div>
                            <h3>Reservations</h3>
                            <p><a href="tel:6238304411">6238-304411</a></p>
                            <p><a href="tel:8848805197">8848805197</a></p>
                            <p><a href="tel:9447290936">9447290936</a></p>
                        </div>

                        <div className="contact-info-card">
                            <div className="card-icon"><Mail size={32} /></div>
                            <h3>Email</h3>
                            <p><a href="https://mail.google.com/mail/?view=cm&fs=1&to=albaith.booking@gmail.com" target="_blank" rel="noopener noreferrer">albaith.booking@gmail.com</a></p>
                        </div>

                        <div className="contact-info-card">
                            <div className="card-icon"><Clock size={32} /></div>
                            <h3>Timing</h3>
                            <p>Check-in: 12:00 PM</p>
                            <p>Check-out: 11:00 AM</p>
                            <p className="timing-note">Reception open 24/7</p>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .contact-page-wrapper {
                    background: var(--bg-cream);
                    min-height: 100vh;
                }

                .contact-hero-alt {
                    height: 60vh;
                    min-height: 450px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }

                .hero-bg-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .hero-bg-overlay::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7));
                }

                .hero-bg-overlay img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .contact-main {
                    padding: 60px 48px 120px;
                }

                .contact-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .contact-info-grid-centered {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 32px;
                }

                .contact-info-card {
                    background: white;
                    padding: 48px 32px;
                    border-radius: 24px;
                    text-align: center;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
                    border: 1px solid rgba(201, 169, 110, 0.12);
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    position: relative;
                }

                .contact-info-card:hover {
                    transform: translateY(-8px);
                    border-color: var(--accent-gold);
                    box-shadow: 0 20px 60px rgba(201, 169, 110, 0.1);
                }

                .location-card {
                    cursor: pointer;
                }

                .location-card.expanded {
                    grid-column: span 1;
                    height: auto;
                }

                .card-icon {
                    color: var(--accent-gold);
                    margin-bottom: 24px;
                    display: inline-flex;
                    padding: 20px;
                    background: var(--bg-cream);
                    border-radius: 50%;
                }

                .contact-info-card h3 {
                    font-family: var(--font-heading);
                    font-size: 1.5rem;
                    margin-bottom: 16px;
                    font-weight: 500;
                    color: var(--text-charcoal);
                }

                .contact-info-card p {
                    font-size: 1rem;
                    color: var(--text-muted);
                    margin: 4px 0;
                    line-height: 1.6;
                }

                .contact-info-card p a {
                    color: inherit;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .contact-info-card p a:hover {
                    color: var(--accent-gold);
                }

                .map-toggle-hint {
                    display: inline-flex;
                    align-items: center;
                    margin-top: 16px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--accent-gold);
                    opacity: 0.8;
                    transition: opacity 0.3s ease;
                }

                .location-card:hover .map-toggle-hint {
                    opacity: 1;
                }

                .mini-map-container {
                    margin-top: 24px;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                    border: 1px solid rgba(201, 169, 110, 0.2);
                    animation: fadeInDown 0.4s ease-out;
                }

                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .timing-note {
                    margin-top: 12px !important;
                    font-style: italic;
                    opacity: 0.8;
                    color: var(--accent-gold) !important;
                    font-weight: 500;
                }

                @media (max-width: 900px) {
                    .contact-info-grid-centered {
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }
                    .contact-main {
                        padding: 40px 24px 80px;
                    }
                }
            `}</style>
        </div>
    );
}
