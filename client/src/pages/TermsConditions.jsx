import React, { useEffect, useRef } from 'react';
import { FileText, ChevronLeft, Gavel, Scale, Clock, ShieldCheck, Handshake, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
        <div className="policy-divider" ref={ref}>
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

export default function TermsConditions() {
    const mainRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const gsap = window.gsap;
        if (!gsap) return;

        const ctx = gsap.context(() => {
            // ── Page Load Curtain ──
            const curtain = document.querySelector('.page-curtain');
            const curtainLogo = document.querySelector('.curtain-logo');
            if (curtain && curtainLogo) {
                const tl = gsap.timeline({ onComplete: () => { curtain.style.display = 'none'; } });
                tl.to(curtainLogo, { opacity: 1, duration: 0.5, ease: 'power2.out', force3D: true })
                    .to(curtainLogo, { opacity: 0, duration: 0.3, delay: 0.3, force3D: true })
                    .to(curtain, { yPercent: -100, duration: 1.2, ease: 'power4.inOut', force3D: true }, '-=0.1');
            }

            // ── Entry Animations ──
            gsap.fromTo('.hero-headline',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, delay: 1.3, ease: 'power3.out', force3D: true }
            );
            gsap.fromTo('.hero-subtext',
                { opacity: 0 },
                { opacity: 1, duration: 1, delay: 1.6, ease: 'power2.out' }
            );

            // Scroll trigger animations for policy cards
            gsap.utils.toArray('.policy-terms-card').forEach((card) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 40,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        once: true
                    }
                });
            });

        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="policy-page-wrapper" ref={mainRef}>
            <Helmet>
                <title>Terms & Conditions – Al Baith Rest House Ernakulam</title>
                <meta
                    name="description"
                    content="Understand our booking rules, guest conduct, and liability policies. Al Baith Rest House Ernakulam Terms and Conditions."
                />
            </Helmet>

            {/* Page Load Curtain */}
            <div className="page-curtain">
                <span className="curtain-logo">AL BAITH</span>
            </div>

            {/* Policy Hero Section */}
            <div className="policy-hero-alt">
                <div className="hero-bg-overlay">
                    <img 
                        src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000" 
                        alt="Al Baith Rest House – Terms and Fair Use" 
                    />
                </div>
                
                <button 
                    className="checkout-back-btn" 
                    onClick={() => window.history.back()} 
                    aria-label="Go back"
                    style={{ position: 'fixed', top: '110px', left: '20px', zIndex: 9999 }}
                >
                    <ChevronLeft size={24} color="var(--accent-gold)" />
                </button>

                <div className="hero-content">
                    <div className="hero-text" style={{ textAlign: 'center' }}>
                        <h1 className="hero-headline">Terms & Conditions</h1>
                        <p className="hero-subtext" style={{ marginInline: 'auto' }}>
                            Guidelines and mutual agreements designed to ensure a respectful and harmonious stay for all our guests.
                        </p>
                    </div>
                </div>
            </div>

            <OrnamentalDivider />

            {/* ─── Policy Content ─── */}
            <section className="policy-main">
                <div className="policy-container">

                    <div className="policy-section-highlight">
                        <div className="section-decoration-icon">
                            <Handshake size={48} />
                        </div>
                        <h2 className="policy-section-title">Terms of Service</h2>
                        <p className="section-intro">By accessing our website and booking our services, you agree to be bound by the following terms and conditions. These help us maintain the high standard of excellence you expect from Al Baith.</p>
                    </div>

                    <div className="terms-grid-wrapper">
                        <div className="policy-terms-card">
                            <div className="term-icon"><FileText size={32} /></div>
                            <h3>1. Booking Policy</h3>
                            <p>All bookings are subject to availability. To secure a booking, a 30% deposit is required at the time of reservation. The remaining balance must be paid upon check-in to confirm your stay.</p>
                        </div>

                        <div className="policy-terms-card">
                            <div className="term-icon"><Scale size={32} /></div>
                            <h3>2. Identification</h3>
                            <p>Valid government-issued ID (Aadhar, Passport, or Voter ID) is mandatory for all guests during check-in. Foreign nationals must provide a valid Passport and Visa as per local regulations.</p>
                        </div>
                    </div>

                    <div className="terms-grid-wrapper">
                        <div className="policy-terms-card">
                            <div className="term-icon"><Clock size={32} /></div>
                            <h3>3. Check-in/Check-out</h3>
                            <p>Standard Check-in time is 12:00 PM and Check-out time is 11:00 AM. Early check-in or late check-out is subject to availability and may incur additional administrative charges.</p>
                        </div>

                        <div className="policy-terms-card">
                            <div className="term-icon"><Gavel size={32} /></div>
                            <h3>4. Code of Conduct</h3>
                            <p>Guests are expected to maintain decorum and respect the property rules. Smoking in non-smoking rooms and any illegal activities are strictly prohibited to ensure the comfort of others.</p>
                        </div>
                    </div>

                    <div className="policy-section-highlight" style={{ marginTop: '64px', background: 'var(--bg-deep-green)', color: 'white' }}>
                        <div className="section-decoration-icon" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <Info size={48} color="var(--accent-gold)" />
                        </div>
                        <h2 className="policy-section-title" style={{ color: 'white' }}>5. Limitation of Liability</h2>
                        <p className="section-intro" style={{ color: 'rgba(255,255,255,0.8)' }}>Al Baith Rest House is not responsible for loss of valuables unless deposited with the management. We are not liable for any force majeure events or circumstances beyond our control.</p>
                    </div>

                </div>
            </section>

            <style>{`
                .policy-page-wrapper {
                    background: var(--bg-cream);
                    min-height: 100vh;
                    color: var(--text-charcoal);
                }

                .policy-divider {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 0;
                    width: 100%;
                    position: relative;
                    margin: 40px 0;
                    background: transparent;
                }

                .policy-divider svg {
                    width: 200px;
                    height: auto;
                }

                .policy-hero-alt {
                    height: 60vh;
                    min-height: 450px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    padding-top: 80px;
                }

                .hero-bg-overlay {
                    position: absolute;
                    inset: 0;
                }

                .hero-bg-overlay::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75));
                }

                .hero-bg-overlay img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .hero-content {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    padding: 0 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .hero-headline {
                    font-family: var(--font-heading);
                    font-size: 4rem;
                    color: white;
                    margin-bottom: 20px;
                    font-weight: 500;
                }
                
                .hero-subtext {
                    font-size: 1.25rem;
                    color: rgba(255, 255, 255, 0.9);
                    max-width: 650px;
                    line-height: 1.6;
                }

                .policy-main {
                    padding: 60px 48px 120px;
                }

                .policy-container {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                .policy-section-highlight {
                    background: white;
                    border-radius: 40px;
                    padding: 80px 60px;
                    margin-bottom: 48px;
                    box-shadow: 0 15px 50px rgba(0,0,0,0.04);
                    border: 1px solid rgba(201, 169, 110, 0.15);
                    text-align: center;
                }

                .section-decoration-icon {
                    color: var(--accent-gold);
                    margin-bottom: 24px;
                    display: inline-flex;
                    padding: 24px;
                    background: var(--bg-cream);
                    border-radius: 50%;
                }

                .policy-section-title {
                    font-family: var(--font-heading);
                    font-size: 2.8rem;
                    margin-bottom: 20px;
                    font-weight: 500;
                    color: var(--bg-deep-green);
                    line-height: 1.2;
                }

                .section-intro {
                    font-size: 1.15rem;
                    color: var(--text-muted);
                    max-width: 700px;
                    margin: 0 auto 56px;
                    line-height: 1.6;
                }

                .terms-grid-wrapper {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 32px;
                    margin-bottom: 48px;
                }

                .policy-terms-card {
                    background: white;
                    padding: 56px 48px;
                    border-radius: 40px;
                    text-align: left;
                    border: 1px solid rgba(201, 169, 110, 0.12);
                    box-shadow: 0 15px 50px rgba(0,0,0,0.03);
                    transition: transform 0.3s ease;
                }
                
                .policy-terms-card:hover {
                    transform: translateY(-5px);
                }

                .term-icon {
                    color: var(--accent-gold);
                    margin-bottom: 24px;
                }

                .policy-terms-card h3 {
                    font-family: var(--font-heading);
                    font-size: 1.8rem;
                    margin-bottom: 16px;
                    color: var(--bg-deep-green);
                }

                .policy-terms-card p {
                    color: var(--text-muted);
                    font-size: 1.05rem;
                    line-height: 1.7;
                }

                @media (max-width: 900px) {
                    .terms-grid-wrapper {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    .policy-hero-alt {
                        height: 40vh;
                        min-height: 320px;
                        padding-top: 60px;
                    }
                    .hero-headline {
                        font-size: 2.2rem;
                        margin-bottom: 12px;
                    }
                    .hero-subtext {
                        font-size: 1rem;
                    }
                    .policy-main {
                        padding: 24px 16px 60px;
                    }
                    .policy-section-highlight {
                        padding: 32px 20px;
                        border-radius: 24px;
                        margin-bottom: 32px;
                    }
                    .policy-section-title {
                        font-size: 1.8rem;
                    }
                    .policy-terms-card {
                        padding: 28px 20px;
                        border-radius: 24px;
                    }
                    .policy-terms-card h3 {
                        font-size: 1.4rem;
                    }
                }
            `}</style>
        </div>
    );
}

