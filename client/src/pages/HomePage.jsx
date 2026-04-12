import { useEffect, useRef, useState } from 'react';
import { createClient } from '@insforge/sdk';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Wifi, Thermometer, Tv, TreePine, BedDouble, Building, ChefHat, Bath, Square, Car, Sofa, Coffee } from 'lucide-react';
import { Leaf, Droplets, Sun, Wind, CheckCircle2, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReviewAutoSlider } from '../components/ui/review-auto-slider';
import PropertyCardStack from '../components/PropertyCardStack';

const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

const TESTIMONIALS = [
    {
        name: 'Priya Menon',
        location: 'Bangalore, India',
        rating: 5,
        text: 'Absolutely stunning stay! The suite room exceeded all our expectations. The jacuzzi with city views was pure magic. Staff was incredibly attentive and warm.',
        avatar: 'PM',
        date: 'February 2026'
    },
    {
        name: 'Ahmed Al-Rashid',
        location: 'Dubai, UAE',
        rating: 5,
        text: 'Al Baith reminds me of the finest Arabian hospitality. The attention to detail, the elegant décor, and the warmth of the hosts made this a memorable experience.',
        avatar: 'AR',
        date: 'January 2026'
    },
    {
        name: 'Sarah Johnson',
        location: 'London, UK',
        rating: 5,
        text: 'We booked the 2BHK apartment for a family vacation. Spacious, clean, and beautifully furnished. The kids loved it! Best value for money in Kochi.',
        avatar: 'SJ',
        date: 'March 2026'
    }
];

/* ─── InsForge Client ─── */
const isProduction = import.meta.env.PROD;
const INSFORGE_URL = isProduction
    ? window.location.origin
    : (import.meta.env.VITE_INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app');
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
    standard: { id: 'standard', name: 'Standard Room', price: '₹1,500 / night', maxGuests: 2, desc: 'A cozy and comfortable room with all essential amenities for a relaxing stay. Perfect for solo travelers or couples.', amenities: ['Free Wi-Fi', 'AC', 'Electric Kettle', 'Smart TV', 'Heater', 'Power Backup 24/7', 'Lift'], extraBedAvailable: false, img: '/images/webp/rooms/standard_1.webp' },
    deluxe: { id: 'deluxe', name: 'Deluxe Room', price: '₹1,800 / night', maxGuests: 3, desc: 'A spacious king bed retreat with premium furnishings, city views, and optional extra bed for small families.', amenities: ['Free Wi-Fi', 'AC', 'Electric Kettle', 'Smart TV', 'Heater', 'Power Backup 24/7', 'Lift', 'King Bed', 'City View'], extraBedAvailable: true, img: '/images/webp/rooms/deluxe_1.webp' },
    suite: { id: 'suite', name: 'Suite Room', price: '₹3,500 / night', maxGuests: 4, desc: 'Luxury suite with separate lounge, mini kitchen, jacuzzi, and panoramic skyline views. 550 sq ft of pure elegance.', amenities: ['Free Wi-Fi', 'AC', 'Electric Kettle', 'Smart TV', 'Heater', 'Power Backup 24/7', 'Lift', 'Mini Kitchen', 'Mini Fridge', 'Jacuzzi', 'Panoramic View'], extraBedAvailable: true, img: '/images/webp/rooms/suite_1.webp' },
    apartments: { id: 'apartments', name: 'Apartments', price: '₹5,000 / night', maxGuests: 8, desc: 'Fully furnished apartments ranging from 1BHK to luxurious 3BHK penthouses for large groups and extended stays.', amenities: ['Free Wi-Fi', 'Kitchen', 'Electric Kettle', 'Living Room', 'Parking', 'AC', 'Balcony'], extraBedAvailable: true, img: '/images/webp/rooms/apartments/15.jpg.webp' }
};

const AMENITY_ICONS = {
    'Free Wi-Fi': Wifi,
    'WiFi': Wifi,
    'AC': Wind,
    'Electric Kettle': Coffee,
    'Smart TV': Tv,
    'Heater': Thermometer,
    'Power Backup 24/7': Sun,
    'Power Backup': Sun,
    'Lift': Building,
    'King Bed': BedDouble,
    'City View': Building,
    'Mini Kitchen': ChefHat,
    'Mini Fridge': Square,
    'Jacuzzi': Bath,
    'Panoramic View': TreePine,
    'Kitchen': ChefHat,
    'Living Room': Sofa,
    'Parking': Car,
    'Balcony': Leaf
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
        // Lenis is initialized globally in App.jsx

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
            gsap.fromTo('.hero-word',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 1.8, force3D: true }
            );

            // ── Hero Scroll Parallax & Fades ──
            const heroTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5,
                }
            });

            // Parallax background (moves down slightly for depth)
            heroTl.to('.hero-bg img', {
                yPercent: 15,
                ease: 'none',
                duration: 1
            }, 0);

            // Text scrolls up and fades out (finishes by 100vh scroll)
            heroTl.to(['.hero-label-group', '.hero-headline', '.hero-short-line', '.hero-subtext'], {
                y: -150,
                opacity: 0,
                ease: 'none',
                duration: 0.4
            }, 0);

            // Explore button fades out quickly (at ~30vh of scroll progress)
            heroTl.to('.hero-cta-row', {
                opacity: 0,
                ease: 'none',
                duration: 0.2
            }, 0);

            // ── Rooms Section Reveal (GSAP Text Reveal) ──
            const roomsTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.rooms-section',
                    start: 'top 80%',
                }
            });

            roomsTl.fromTo('.gs-word', 
                { yPercent: 100 }, 
                { yPercent: 0, duration: 0.8, stagger: 0.05, ease: 'power3.out' }
            )
            .fromTo('.gs-reveal-subheading', 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                "-=0.4"
            );

        }, mainRef);

        return () => {
            ctx.revert();
        };
    }, []);

    // ── Timeline Reveal IntersectionObserver ──
    useEffect(() => {
        // Use a small timeout to ensure elements are in the DOM and measured
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll('.timeline-reveal');
            if (elements.length === 0) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.01 } // Lower threshold to ensure trigger even on partial intersections
            );

            elements.forEach(el => observer.observe(el));
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // ── Resizing Logic (Debounced) ──
    useEffect(() => {
        let timeoutId;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                // This will trigger a re-render if we really need it,
                // but we'll primarily use CSS for the primary layout shift.
                window.dispatchEvent(new Event('resize-debounced'));
            }, 200);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [[roomPage, roomDirection], setRoomPage] = useState([0, 0]);
    const numRooms = Object.keys(ROOM_DATA).length;
    const activeRoomIndex = wrap(0, numRooms, roomPage);

    const paginateRoom = (newDirection) => {
        setRoomPage([roomPage + newDirection, newDirection]);
    };





    return (
        <div ref={mainRef}>
            <style>{`
                .timeline-reveal {
                  opacity: 0;
                  filter: blur(10px);
                  transform: translateY(40px);
                  transition: opacity 0.7s ease-out, filter 0.7s ease-out, transform 0.7s ease-out;
                  will-change: opacity, filter, transform;
                }
                .timeline-reveal.visible {
                  opacity: 1;
                  filter: blur(0px);
                  transform: translateY(0);
                }
            `}</style>
            <Helmet>
                <title>Al Baith Rest House – Hotel Near Lakeshore Hospital, Ernakulam</title>
                <meta
                    name="description"
                    content="Al Baith Rest House is located just minutes from Lakeshore Hospital, Ernakulam, Kerala. Clean AC rooms, free Wi-Fi, hot water. Ideal for patient families and medical staff. Book online now."
                />
            </Helmet>
            {/* Page Load Curtain */}
            <div className="page-curtain">
                <span className="curtain-logo">AL BAITH</span>
            </div>

            {/* ══════════════════════════════════════════
          1. HERO SECTION
          ══════════════════════════════════════════ */}
            <section className="hero">
                <div className="hero-sticky-container">
                    <div className="hero-bg">
                        <img
                            src="/images/webp/hero_bg.webp"
                            className="hero-desktop-img"
                            alt="Al Baith Rest House – Hotel near Lakeshore Hospital, Ernakulam, Kerala"
                            loading="eager" decoding="async"
                        />
                        <img
                            src="/images/webp/hero_mobile_actual.webp"
                            className="hero-mobile-img"
                            alt="Al Baith Rest House – Hotel near Lakeshore Hospital, Ernakulam, Kerala"
                            loading="eager" decoding="async"
                        />
                    </div>

                    <div className="hero-content">
                        <div className="hero-text">
                            <div className="hero-label-group">
                                <span className="hero-top-label">Luxury Stays</span>
                                <div className="hero-gold-line"></div>
                            </div>
                            <h1 className="hero-headline">
                                {'Al Baith Rest House, Ernakulam'.split(' ').map((word, i) => (
                                    <span className="word" key={i}>
                                        <span className="hero-word">{word}</span>{' '}
                                    </span>
                                ))}
                            </h1>
                            <div className="hero-short-line"></div>
                            <p className="hero-subtext">
                                Comfortable Rooms Steps Away from Lakeshore Hospital, Ernakulam
                            </p>
                            <div className="hero-cta-row">
                                <a href="#rooms" className="btn-primary font-inter-numbers">EXPLORE ROOMS</a>
                            </div>
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
                    <h2 className="section-title">
                        {'Choose the Best Room for Your Perfect Stay!'.split(' ').map((word, i) => (
                            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                                <span className="gs-word" style={{ display: 'inline-block' }}>{word}&nbsp;</span>
                            </span>
                        ))}
                    </h2>
                    <p className="section-subtitle gs-reveal-subheading">
                        Experience the art of comfort and luxury. Designed to embrace you in elegance.
                    </p>
                </div>

                <div className="rooms-content-container">
                    {/* MOBILE VERSION: Stacked 3D Carousel (Visible only on <769px) */}
                    <div className="mobile-rooms-only">
                        <div className="rooms-grid-wrapper">
                            {Object.values(ROOM_DATA).map((room, idx) => {
                                let offset = idx - activeRoomIndex;
                                const halfLength = numRooms / 2;
                                if (offset > halfLength) offset -= numRooms;
                                if (offset < -halfLength) offset += numRooms;

                                const isActive = offset === 0;

                                return (
                                    <motion.div
                                        key={room.id}
                                        className="room-card-anim-wrapper"
                                        animate={{
                                            opacity: Math.abs(offset) > 1 ? 0 : 1,
                                            scale: isActive ? 1 : 0.85,
                                            y: isActive ? 0 : 35,
                                            x: isActive ? 0 : (offset > 0 ? 55 : -55),
                                            zIndex: isActive ? 10 : (5 - Math.abs(offset)),
                                            pointerEvents: isActive ? 'auto' : 'none'
                                        }}
                                        transition={{
                                            type: "spring", stiffness: 300, damping: 25
                                        }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={1}
                                        onDragEnd={(e, { offset: dragOffset, velocity }) => {
                                            const swipe = swipePower(dragOffset.x, velocity.x);
                                            if (swipe < -10000 || dragOffset.x < -100) {
                                                paginateRoom(1);
                                            } else if (swipe > 10000 || dragOffset.x > 100) {
                                                paginateRoom(-1);
                                            }
                                        }}
                                        style={{ position: 'absolute', touchAction: 'none' }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                                            transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                            style={{ width: '100%', height: '100%' }}
                                        >
                                            <PropertyCardStack 
                                                room={room} 
                                                onClick={() => navigate(room.id === 'apartments' ? '/apartments' : `/rooms/${room.id}`)}
                                            />
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* DESKTOP VERSION: Informational Grid (Visible only on >768px) */}
                    <div className="desktop-rooms-only">
                        <div className="rooms-grid-wrapper">
                            <div className="rooms-grid-layout">
                                {Object.values(ROOM_DATA).map((room, idx) => (
                                    <motion.div 
                                        className="desktop-room-card-wrapper" 
                                        key={room.id}
                                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                                        transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <PropertyCardStack 
                                            room={room} 
                                            onClick={() => navigate(room.id === 'apartments' ? '/apartments' : `/rooms/${room.id}`)}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="view-all-rooms-container" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '24px',
                    width: '100%'
                }}>
                    <button 
                        onClick={() => navigate('/rooms')}
                        className="btn-view-all-rooms"
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            color: '#1C1C1C',
                            background: 'transparent',
                            border: 'none',
                            padding: '8px 0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        VIEW ALL ROOMS <ArrowRight size={18} />
                    </button>
                </div>

            </section>

            <section className="testimonials-section" id="reviews" style={{ paddingBottom: '0px', overflow: 'hidden' }}>
                <div className="section-header">
                    <h2 className="section-title">The Words of Our Guests</h2>
                    <p className="section-subtitle">Real stories from real guests. Discover why they call Al Baith their home away from home.</p>
                </div>

                <div className="review-slider-wrapper">
                    <ReviewAutoSlider />
                </div>
            </section>

            {/* ══════════════════════════════════════════
              ABOUT / DESCRIPTION SECTION
              ══════════════════════════════════════════ */}
            <section className="testimonials-section" style={{ paddingTop: '80px', paddingBottom: '0px', overflow: 'hidden' }}>
                <div className="section-header">
                    <h2 className="section-title timeline-reveal">The Closest Comfortable Stay to Lakeshore Hospital</h2>
                    <p className="section-subtitle" style={{ maxWidth: '720px', margin: '0 auto', lineHeight: '1.8' }}>
                        <span style={{ display: 'block', transitionDelay: '0s' }} className="timeline-reveal">When a loved one is receiving care at Lakeshore Hospital in Ernakulam, the last thing you need is a long commute back to your hotel.</span>
                        <span style={{ display: 'block', transitionDelay: '0.15s' }} className="timeline-reveal">Al Baith Rest House is located just a short distance from Lakeshore Hospital — making us the first choice for patient families, visiting doctors, and medical staff looking for accommodation in Ernakulam, Kochi.</span>
                        <span style={{ display: 'block', transitionDelay: '0.3s' }} className="timeline-reveal">We offer clean AC rooms, free Wi-Fi, hot water, and daily housekeeping — everything you need for a comfortable stay during a difficult time.</span>
                        <span style={{ display: 'block', transitionDelay: '0.45s' }} className="timeline-reveal">Book directly online or call us for immediate room availability.</span>
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════════
              LOCATION SECTION
              ══════════════════════════════════════════ */}
            <section className="testimonials-section" style={{ paddingBottom: '80px', overflow: 'hidden' }}>
                <div className="section-header">
                    <h2 className="section-title timeline-reveal">How to Find Us — Ernakulam, Kerala</h2>
                    <p className="section-subtitle" style={{ maxWidth: '720px', margin: '0 auto', lineHeight: '1.8' }}>
                        <span style={{ display: 'block', transitionDelay: '0s' }} className="timeline-reveal">Al Baith Rest House is situated in Ernakulam, Kochi, Kerala — within close proximity to Lakeshore Hospital.</span>
                        <span style={{ display: 'block', transitionDelay: '0.15s' }} className="timeline-reveal">We are easily reachable from Ernakulam Junction Railway Station, Cochin International Airport, and the Kochi Metro.</span>
                        <span style={{ display: 'block', transitionDelay: '0.3s' }} className="timeline-reveal">Auto-rickshaws and cabs are available at all hours from our location.</span>
                    </p>
                </div>
            </section>

        </div >
    );
}
