import React, { useEffect, useRef } from 'react';
import { Shield, Lock, Eye, FileText, ChevronLeft, Building, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
        const gsap = window.gsap;
        if (!gsap) return;
        
        const ctx = gsap.context(() => {
            const curtain = document.querySelector('.page-curtain');
            const curtainLogo = document.querySelector('.curtain-logo');
            if (curtain && curtainLogo) {
                const tl = gsap.timeline({ onComplete: () => { curtain.style.display = 'none'; } });
                tl.to(curtainLogo, { opacity: 1, duration: 0.5, ease: 'power2.out' })
                  .to(curtainLogo, { opacity: 0, duration: 0.3, delay: 0.3 })
                  .to(curtain, { yPercent: -100, duration: 1.2, ease: 'power4.inOut' }, '-=0.1');
            }
        }, document.body);
        return () => ctx.revert();
    }, []);

    return (
        <div className="policy-page-wrapper">
             <div className="page-curtain">
                <span className="curtain-logo">AL BAITH</span>
            </div>

            <div className="policy-hero-alt" style={{ height: '40vh', minHeight: '300px' }}>
                <div className="hero-bg-overlay">
                    <img src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80" alt="Privacy Policy" />
                </div>
                <button 
                    className="checkout-back-btn" 
                    onClick={() => window.history.back()} 
                    style={{ position: 'fixed', top: '110px', left: '20px', zIndex: 9999 }}
                >
                    <ChevronLeft size={24} color="var(--accent-gold)" />
                </button>
                <div className="hero-content">
                    <h1 className="hero-headline" style={{ fontSize: '3rem' }}>Privacy Policy</h1>
                </div>
            </div>

            <section className="policy-main">
                <div className="policy-container">
                    <div className="policy-section-highlight">
                        <Lock size={48} className="section-decoration-icon" />
                        <h2 className="policy-section-title">Your Privacy Matters</h2>
                        <p className="section-intro">We are committed to protecting your personal information and your right to privacy. This policy explains how we collect, use, and safeguard your data when you book with Al Baith Rest House.</p>
                    </div>

                    <div className="policy-terms-card">
                        <h3>1. Information We Collect</h3>
                        <p>We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information.</p>
                    </div>

                    <div className="policy-terms-card">
                        <h3>2. How We Use Your Information</h3>
                        <p>We use personal information collected via our website for a variety of business purposes, including to facilitate account creation and logon process, to send you administrative information, and to fulfill and manage your bookings.</p>
                    </div>

                    <div className="policy-terms-card">
                        <h3>3. Data Security</h3>
                        <p>We aim to protect your personal information through a system of organizational and technical security measures. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
                    </div>

                    <div className="policy-terms-card">
                        <h3>4. Payment Safety</h3>
                        <p>Your payment information is processed through secure, PCI-compliant gateways like Razorpay. We do not store your credit card details on our own servers.</p>
                    </div>

                    <div className="contact-options-grid" style={{ marginTop: '48px' }}>
                        <div className="contact-method-card">
                            <Mail size={24} />
                            <h3>Questions?</h3>
                            <a href="mailto:albaith.booking@gmail.com" className="highlight-contact">albaith.booking@gmail.com</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
