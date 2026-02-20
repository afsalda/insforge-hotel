import React, { useEffect, useRef, useState } from 'react';
import { Phone, Mail, Clock, ShieldCheck, AlertCircle, RefreshCcw, UserMinus, ExternalLink } from 'lucide-react';

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
        <div className="ornamental-divider" ref={ref}>
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

export default function CancellationPolicy() {
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
            gsap.fromTo('.hero-arabic-label',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, delay: 1.1, ease: 'power2.out', force3D: true }
            );
            gsap.fromTo('.hero-headline',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, delay: 1.3, ease: 'power3.out', force3D: true }
            );
            gsap.fromTo('.hero-subtext',
                { opacity: 0 },
                { opacity: 1, duration: 1, delay: 1.6, ease: 'power2.out' }
            );

            // Scroll trigger animations for policy cards
            gsap.utils.toArray('.policy-terms-card, .detail-box, .contact-method-card').forEach((card) => {
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
            {/* Page Load Curtain */}
            <div className="page-curtain">
                <span className="curtain-logo">AL BAITH</span>
            </div>

            {/* ─── Hero Section ─── */}
            <section className="policy-hero-alt">
                <div className="hero-bg-overlay">
                    <img
                        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80"
                        alt="Policy background"
                        loading="eager"
                    />
                </div>
                <div className="hero-arabic-watermark" aria-hidden="true" style={{ top: '60%' }}>سياسة الإلغاء</div>
                <div className="hero-content">
                    <div className="hero-text" style={{ textAlign: 'center' }}>
                        <span className="hero-arabic-label">الشروط والأحكام</span>
                        <h1 className="hero-headline">Cancellation Policy</h1>
                        <p className="hero-subtext" style={{ marginInline: 'auto' }}>
                            Please review our rules regarding booking cancellations and refunds to ensure a smooth administrative process.
                        </p>
                    </div>
                </div>
            </section>

            <OrnamentalDivider />

            {/* ─── Policy Content ─── */}
            <section className="policy-main">
                <div className="policy-container">

                    {/* Section 1: How to Request */}
                    <div className="policy-section-highlight request-section">
                        <div className="section-decoration-icon">
                            <ShieldCheck size={48} />
                        </div>
                        <h2 className="policy-section-title">How to Request a Cancellation</h2>
                        <p className="section-intro">To ensure secure processing, we do not accept cancellations via the website. You must contact us directly via phone or email.</p>

                        <div className="contact-options-grid">
                            <div className="contact-method-card">
                                <div className="card-icon"><Phone size={24} /></div>
                                <h3>Call Us</h3>
                                <p>Fastest way for immediate assistance</p>
                                <a href="tel:916238304411" className="highlight-contact">+91 6238-304411</a>
                                <div className="meta-info">
                                    <Clock size={14} />
                                    <span>9:00 AM - 9:00 PM (IST)</span>
                                </div>
                            </div>

                            <div className="contact-method-card">
                                <div className="card-icon"><Mail size={24} /></div>
                                <h3>Email Us</h3>
                                <p>For non-urgent modifications</p>
                                <a href="mailto:albaith.booking@gmail.com" className="highlight-contact">albaith.booking@gmail.com</a>
                                <div className="meta-info">
                                    <Clock size={14} />
                                    <span>Response within 24 hours</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Terms */}
                    <div className="terms-grid-wrapper">
                        <div className="policy-terms-card">
                            <div className="term-icon"><Clock size={32} /></div>
                            <h3>24-Hour Free Cancellation</h3>
                            <p>You may cancel your booking <strong>free of charge</strong> up to 24 hours before your scheduled check-in time (12:00 PM on arrival date).</p>
                        </div>

                        <div className="policy-terms-card alert">
                            <div className="term-icon"><AlertCircle size={32} /></div>
                            <h3>Late Cancellations</h3>
                            <p>Cancellations made <strong>within 24 hours</strong> of check-in are not eligible for a refund and may incur a charge equal to the first night's stay.</p>
                        </div>
                    </div>

                    {/* Section 3: Refunds & No-Show */}
                    <div className="policy-detailed-grid">
                        <div className="detail-box">
                            <div className="box-title">
                                <RefreshCcw size={20} />
                                <h3>Refund Policy</h3>
                            </div>
                            <ul className="policy-list">
                                <li>
                                    <span className="bullet">✓</span>
                                    <span>Full refunds (minus standard processing fees) are issued for timely cancellations.</span>
                                </li>
                                <li>
                                    <span className="bullet">ℹ️</span>
                                    <span>Refunds are typically processed to the original payment method within 5-7 business days.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="detail-box dark">
                            <div className="box-title">
                                <UserMinus size={20} />
                                <h3>No-Show Policy</h3>
                            </div>
                            <p className="box-text">
                                Failure to check in without prior notice is considered a <strong>No-Show</strong>.
                                The entire booking amount will be forfeited, and the reservation will be released to other guests.
                            </p>
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

                .policy-hero-alt {
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
                }

                .section-intro {
                    font-size: 1.15rem;
                    color: var(--text-muted);
                    max-width: 700px;
                    margin: 0 auto 56px;
                    line-height: 1.6;
                }

                .contact-options-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 32px;
                }

                .contact-method-card {
                    background: var(--bg-off-white);
                    padding: 40px 32px;
                    border-radius: 30px;
                    border: 1px solid rgba(201, 169, 110, 0.1);
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }

                .contact-method-card:hover {
                    border-color: var(--accent-gold);
                    background: white;
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(201,169,110,0.08);
                }

                .contact-method-card h3 {
                    font-family: var(--font-heading);
                    font-size: 1.5rem;
                    margin-bottom: 8px;
                    color: var(--text-charcoal);
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

                .policy-terms-card.alert {
                    border-left: 8px solid var(--accent-gold);
                    background: linear-gradient(to right, #fff, var(--bg-off-white));
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

                .policy-detailed-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr;
                    gap: 32px;
                }

                .detail-box {
                    background: white;
                    padding: 56px;
                    border-radius: 40px;
                    border: 1px solid rgba(201, 169, 110, 0.1);
                    box-shadow: 0 15px 50px rgba(0,0,0,0.03);
                }

                .detail-box.dark {
                    background: var(--bg-deep-green);
                    color: var(--text-cream);
                    border: none;
                }

                .box-title {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    color: var(--accent-gold);
                    margin-bottom: 32px;
                }

                .box-title h3 {
                    font-family: var(--font-heading);
                    font-size: 1.6rem;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    font-weight: 500;
                }

                .policy-list {
                    list-style: none;
                    padding: 0;
                }

                .policy-list li {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 24px;
                    align-items: flex-start;
                    font-size: 1.05rem;
                    line-height: 1.6;
                }

                .bullet {
                    color: var(--accent-gold);
                    font-weight: bold;
                    font-size: 1.3rem;
                }

                .box-text {
                    opacity: 0.85;
                    line-height: 1.8;
                    font-size: 1.1rem;
                }

                @media (max-width: 900px) {
                    .contact-options-grid, .terms-grid-wrapper, .policy-detailed-grid {
                        grid-template-columns: 1fr;
                    }
                    .policy-main {
                        padding: 40px 24px 80px;
                    }
                    .policy-section-highlight {
                        padding: 50px 30px;
                    }
                }
            `}</style>
        </div>
    );
}
