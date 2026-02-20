import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@insforge/sdk';
import { useNavigate } from 'react-router-dom';
import { Wifi, Thermometer, Tv, TreePine, BedDouble, Building, ChefHat, Bath, Square, Car, Sofa } from 'lucide-react';
import { Leaf, Droplets, Sun, Wind, CheckCircle2 } from 'lucide-react';

/* ─── InsForge Client ─── */
const INSFORGE_URL = import.meta.env.VITE_INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app';
const INSFORGE_ANON_KEY = import.meta.env.VITE_INSFORGE_ANON_KEY || '';
const insforge = createClient({ baseUrl: INSFORGE_URL, anonKey: INSFORGE_ANON_KEY });

/* ─── Ornamental SVG Divider (Arch/Keyhole) ─── */
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

/* ─── Star Rating SVG ─── */
function StarIcon() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#C9A96E" />
        </svg>
    );
}

/* ─── Animated Checkmark SVG ─── */
function AnimatedCheckmark() {
    return (
        <div className="booking-success-check">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#C9A96E" strokeWidth="2" fill="rgba(201,169,110,0.1)" />
                <path
                    className="checkmark-path"
                    d="M20 32 L28 40 L44 24"
                    stroke="#C9A96E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>
        </div>
    );
}


const ROOM_DATA = {
    standard: { id: 'standard_room', name: 'Standard Room', arabic: 'غرفة قياسية', price: '₹1,500 / night', maxGuests: 2, desc: 'A cozy and comfortable room with all essential amenities for a relaxing stay. Perfect for solo travelers or couples.', amenities: ['WiFi', 'AC', 'Smart TV', 'Heater', 'Power Backup', 'Lift'], extraBedAvailable: false, img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80' },
    deluxe: { id: 'deluxe_room', name: 'Deluxe Room', arabic: 'غرفة ديلوكس', price: '₹1,800 / night', maxGuests: 3, desc: 'A spacious king bed retreat with premium furnishings, city views, and optional extra bed for small families.', amenities: ['WiFi', 'AC', 'Smart TV', 'Heater', 'Power Backup', 'Lift', 'King Bed', 'City View'], extraBedAvailable: true, img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80' },
    suite: { id: 'suite_room', name: 'Suite Room', arabic: 'جناح فاخر', price: '₹5,000 / night', maxGuests: 4, desc: 'Luxury suite with separate lounge, mini kitchen, jacuzzi, and panoramic skyline views. 550 sq ft of pure elegance.', amenities: ['WiFi', 'AC', 'Smart TV', 'Heater', 'Power Backup', 'Lift', 'Mini Kitchen', 'Mini Fridge', 'Jacuzzi', 'Panoramic View'], extraBedAvailable: true, img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80' },
    apartments: { id: 'apartments', name: 'Luxury Apartments', arabic: 'شقق فاخرة', price: 'Starting from ₹3,500', maxGuests: 8, desc: 'Fully furnished apartments ranging from 1BHK to luxurious 3BHK penthouses for large groups and extended stays.', amenities: ['WiFi', 'Kitchen', 'Living Room', 'Parking', 'AC', 'Balcony'], extraBedAvailable: true, img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' }
};



/* ═══════════════════════════════════════════
   MAIN HOME PAGE
   ═══════════════════════════════════════════ */
export default function HomePage() {
    const mainRef = useRef(null);
    const navigate = useNavigate();

    /* ─── GSAP + Lenis Init — ALL inside gsap.context() ─── */
    useEffect(() => {
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        const Lenis = window.Lenis;

        if (!gsap || !ScrollTrigger) return;
        gsap.registerPlugin(ScrollTrigger);

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

            // ── Hero Entry ──
            gsap.fromTo('.hero-arabic-label',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, delay: 1.6, ease: 'power2.out', force3D: true }
            );
            gsap.fromTo('.hero-word',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 1.8, force3D: true }
            );

            // ── matchMedia — Desktop vs Mobile ──
            const mm = gsap.matchMedia();


            // Testimonials (desktop)
            mm.add("(min-width: 1025px)", () => {
                gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
                    gsap.fromTo(card,
                        { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
                        {
                            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', force3D: true,
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 90%',
                                once: true
                            }
                        }
                    );
                });
            });

            // MOBILE / Tablet Testimonials
            mm.add("(max-width: 1024px)", () => {
                gsap.fromTo('.testimonial-card',
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2, force3D: true,
                        scrollTrigger: {
                            trigger: '.testimonials-section',
                            start: 'top 80%',
                            once: true
                        }
                    }
                );
            });





        }, mainRef);

        return () => {
            ctx.revert();
        };
    }, []);

    const roomContainerVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const roomCardVariants = {
        hidden: { opacity: 0, y: 50 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div ref={mainRef}>
            {/* Page Load Curtain */}
            <div className="page-curtain">
                <span className="curtain-logo">AL BAITH</span>
            </div>



            {/* ══════════════════════════════════════════
          1. HERO SECTION
          ══════════════════════════════════════════ */}
            <section className="hero">
                <div className="hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80"
                        alt="Luxury hotel lobby with lush botanical interior"
                        loading="eager" decoding="async"
                    />
                </div>

                <div className="hero-arabic-watermark" aria-hidden="true">مرحباً</div>

                <div className="hero-content">
                    <div className="hero-text">
                        <span className="hero-arabic-label">فندق البيت الفاخر</span>
                        <h1 className="hero-headline">
                            {'Book Your Comfort Room Today!'.split(' ').map((word, i) => (
                                <span className="word" key={i}>
                                    <span className="hero-word">{word}</span>{' '}
                                </span>
                            ))}
                        </h1>
                        <p className="hero-subtext">
                            Immerse yourself in the harmony of Arabian heritage and modern serenity.
                            Every room tells a story of timeless luxury.
                        </p>
                        <div className="hero-cta-row">
                            <a href="#rooms" className="btn-primary">Explore Rooms</a>
                        </div>
                    </div>
                </div>
            </section>

            <OrnamentalDivider />

            {/* ══════════════════════════════════════════
          2. ROOMS SECTION
          ══════════════════════════════════════════ */}
            <section className="rooms-section" id="rooms">
                <div className="section-header">
                    <span className="section-arabic-label">اختر غرفتك</span>
                    <h2 className="section-title">Choose the Best Room for Your Perfect Stay!</h2>
                    <p className="section-subtitle">
                        Experience the art of comfort and luxury. Designed to embrace you in elegance.
                    </p>
                </div>

                <div className="rooms-grid-wrapper">
                    <motion.div
                        className="rooms-grid-layout"
                        variants={roomContainerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {Object.values(ROOM_DATA).map((room) => (
                            <motion.div className="room-card" key={room.id} variants={roomCardVariants}>
                                <div className="room-card-image-wrapper">
                                    <div className="room-badge">{room.arabic}</div>
                                    <img src={room.img} alt={room.name} loading="lazy" decoding="async" />
                                </div>
                                <div className="room-card-content" style={{ padding: '24px' }}>
                                    <div className="room-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <h3 className="room-card-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--text-charcoal)', margin: 0 }}>{room.name}</h3>
                                        <span className="room-card-price" style={{ fontSize: '1.25rem', color: 'var(--accent-gold)' }}>{room.price}</span>
                                    </div>
                                    <p className="room-card-desc" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.6 }}>{room.desc}</p>

                                    <div className="room-amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '24px' }}>
                                        {room.amenities.slice(0, 4).map((amenity, idx) => (
                                            <div key={idx} className="amenity-chip" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-charcoal)' }}>
                                                <span className="amenity-dot" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-gold)' }}></span>
                                                {amenity}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="room-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                        <div className="room-guests" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                            Up to {room.maxGuests} Guests
                                        </div>
                                        <button className="btn-view-room" onClick={() => navigate(room.id === 'apartments' ? '/apartments' : `/room/${room.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-gold)', background: 'none', border: 'none', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}>
                                            View Details
                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

            </section>

            {/* ══════════════════════════════════════════
          3. TESTIMONIALS SECTION
          ══════════════════════════════════════════ */}
            <section className="testimonials-section" id="reviews" style={{ opacity: 1 }}>
                <div className="section-header">
                    <span className="section-arabic-label">آراء ضيوفنا</span>
                    <h2 className="section-title">The Words of Our Guests</h2>
                    <p className="section-subtitle">Real stories from real guests. Discover why they call Al Baith their home away from home.</p>
                </div>

                <div className="testimonials-grid">
                    <div className="testimonial-card visible">
                        <div className="testimonial-quote">«</div>
                        <blockquote>An absolutely magical experience. The interior design merges Arabian artistry with incredible comfort. Waking up to the garden views each morning was pure bliss. I've never felt so pampered!</blockquote>
                        <div className="testimonial-stars"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=60" alt="Sarah M." decoding="async" />
                            </div>
                            <div className="testimonial-author-info"><h5>Sarah Mitchell</h5><span>New York, USA</span></div>
                        </div>
                    </div>

                    <div className="testimonial-card visible">
                        <div className="testimonial-quote">«</div>
                        <blockquote>The attention to detail is extraordinary. From the geometric tile work to the fragrant lobbies — every corner is a masterpiece. The spa treatment was a highlight of our honeymoon.</blockquote>
                        <div className="testimonial-stars"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=60" alt="James K." decoding="async" />
                            </div>
                            <div className="testimonial-author-info"><h5>James Kingston</h5><span>London, UK</span></div>
                        </div>
                    </div>

                    <div className="testimonial-card visible">
                        <div className="testimonial-quote">«</div>
                        <blockquote>I travel frequently and Al Baith sets a new standard. The executive suite is unparalleled — the service, the cuisine, absolutely everything exceeded my expectations. Will return!</blockquote>
                        <div className="testimonial-stars"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=60" alt="Aisha R." decoding="async" />
                            </div>
                            <div className="testimonial-author-info"><h5>Aisha Rahman</h5><span>Dubai, UAE</span></div>
                        </div>
                    </div>
                </div>

                <div className="testimonials-dots">
                    <button className="dot active" aria-label="Page 1"></button>
                    <button className="dot" aria-label="Page 2"></button>
                    <button className="dot" aria-label="Page 3"></button>
                </div>
            </section>
        </div >
    );
}
