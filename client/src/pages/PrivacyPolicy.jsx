import React, { useEffect, useRef } from 'react';
import { Shield, Lock, Eye, FileText, ChevronLeft, Building, Mail, Phone, Clock, ShieldCheck } from 'lucide-react';
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

export default function PrivacyPolicy() {
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
            gsap.utils.toArray('.policy-terms-card, .contact-method-card').forEach((card) => {
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
                <title>Privacy Policy – Al Baith Rest House Ernakulam</title>
                <meta
                    name="description"
                    content="Our commitment to your privacy. Learn how Al Baith Rest House Ernakulam collects, uses, and protects your personal information."
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
                        src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=2000" 
                        alt="Al Baith Rest House – Privacy and Security" 
                    />
                </div>
                


                <div className="hero-content">
                    <div className="hero-text" style={{ textAlign: 'center' }}>
                        <h1 className="hero-headline">Privacy Policy</h1>
                        <p className="hero-subtext" style={{ marginInline: 'auto' }}>
                            We value your trust. Discover how we safeguard your personal information and ensure a secure experience at Al Baith Rest House.
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
                            <ShieldCheck size={48} />
                        </div>
                        <h2 className="policy-section-title">Your Privacy Matters</h2>
                        <p className="section-intro">We are committed to protecting your personal information and your right to privacy. This policy explains how we collect, use, and safeguard your data when you book with Al Baith Rest House.</p>
                    </div>

                    <div className="terms-grid-wrapper">
                        <div className="policy-terms-card">
                            <div className="term-icon"><FileText size={32} /></div>
                            <h3>1. Information We Collect</h3>
                            <p>We collect personal information that you provide to us such as name, address, contact information, and payment details required for booking and verification purposes.</p>
                        </div>

                        <div className="policy-terms-card">
                            <div className="term-icon"><Shield size={32} /></div>
                            <h3>2. How We Use It</h3>
                            <p>Your information is used to facilitate bookings, process payments, and provide you with administrative updates regarding your stay at Al Baith.</p>
                        </div>
                    </div>

                    <div className="terms-grid-wrapper">
                        <div className="policy-terms-card">
                            <div className="term-icon"><Lock size={32} /></div>
                            <h3>3. Data Security</h3>
                            <p>We implement rigorous organizational and technical security measures to protect your data. While no system is 100% secure, we use industry-standard protocols to minimize risks.</p>
                        </div>

                        <div className="policy-terms-card alert">
                            <div className="term-icon"><Lock size={32} /></div>
                            <h3>4. Payment Safety</h3>
                            <p>Your payment details are processed through secure, PCI-compliant gateways like Razorpay. We do not store sensitive credit card information on our servers.</p>
                        </div>
                    </div>

                    <div className="policy-section-highlight" style={{ marginTop: '64px' }}>
                        <div className="section-decoration-icon">
                            <Mail size={48} />
                        </div>
                        <h2 className="policy-section-title">Questions?</h2>
                        <p className="section-intro">If you have any questions or concerns about our privacy practices, please contact us directly.</p>
                        <div className="contact-method-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                            <h3>Email Our Support</h3>
                            <a href="mailto:albaith.booking@gmail.com" className="highlight-contact">albaith.booking@gmail.com</a>
                            <div className="meta-info">
                                <Clock size={14} />
                                <span>Response within 24 hours</span>
                            </div>
                        </div>
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

                .contact-method-card {
                    background: var(--bg-off-white);
                    padding: 40px 32px;
                    border-radius: 30px;
                    border: 1px solid rgba(201, 169, 110, 0.1);
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }

                .highlight-contact {
                    display: block;
                    font-family: var(--font-heading);
                    font-size: 1.8rem;
                    color: var(--bg-deep-green);
                    margin: 16px 0;
                    text-decoration: none;
                    transition: color 0.3s;
                    font-weight: 500;
                    line-height: 1.3;
                    word-break: break-word;
                }

                .highlight-contact:hover {
                    color: var(--accent-gold);
                }

                .meta-info {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    color: var(--accent-gold);
                    margin-top: 16px;
                    font-weight: 500;
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

