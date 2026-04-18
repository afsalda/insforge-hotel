import React, { useEffect } from 'react';
import { FileText, ChevronLeft, Gavel, Scale, Clock, ShieldCheck } from 'lucide-react';

export default function TermsConditions() {
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
                    <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80" alt="Terms and Conditions" />
                </div>
                <button 
                    className="checkout-back-btn" 
                    onClick={() => window.history.back()} 
                    style={{ position: 'fixed', top: '110px', left: '20px', zIndex: 9999 }}
                >
                    <ChevronLeft size={24} color="var(--accent-gold)" />
                </button>
                <div className="hero-content">
                    <h1 className="hero-headline" style={{ fontSize: '3rem' }}>Terms & Conditions</h1>
                </div>
            </div>

            <section className="policy-main">
                <div className="policy-container">
                    <div className="policy-section-highlight">
                        <Scale size={48} className="section-decoration-icon" />
                        <h2 className="policy-section-title">Terms of Service</h2>
                        <p className="section-intro">By accessing our website and booking our services, you agree to be bound by the following terms and conditions.</p>
                    </div>

                    <div className="policy-terms-card">
                        <h3>1. Booking Policy</h3>
                        <p>All bookings are subject to availability. To secure a booking, a 30% deposit is required at the time of reservation. The remaining balance must be paid upon check-in.</p>
                    </div>

                    <div className="policy-terms-card">
                        <h3>2. Identification</h3>
                        <p>Valid government-issued ID (Aadhar, Passport, or Voter ID) is mandatory for all guests during check-in. Foreign nationals must provide a valid Passport and Visa.</p>
                    </div>

                    <div className="policy-terms-card">
                        <h3>3. Check-in/Check-out</h3>
                        <p>Standard Check-in time is 12:00 PM and Check-out time is 11:00 AM. Early check-in or late check-out is subject to availability and may incur additional charges.</p>
                    </div>

                    <div className="policy-terms-card">
                        <h3>4. Code of Conduct</h3>
                        <p>Guests are expected to maintain decorum and respect the property rules. Smoking in non-smoking rooms and any illegal activities are strictly prohibited.</p>
                    </div>

                    <div className="policy-terms-card">
                        <h3>5. Limitation of Liability</h3>
                        <p>Al Baith Rest House is not responsible for loss of valuables unless deposited with the management. We are not liable for any force majeure events.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
