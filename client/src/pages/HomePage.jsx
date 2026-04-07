import { useEffect, useRef, useState } from 'react';
import { createClient } from '@insforge/sdk';
import { useNavigate } from 'react-router-dom';
import { Wifi, Thermometer, Tv, TreePine, BedDouble, Building, ChefHat, Bath, Square, Car, Sofa } from 'lucide-react';
import { Leaf, Droplets, Sun, Wind, CheckCircle2, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReviewAutoSlider } from '../components/ui/review-auto-slider';

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
    standard: { id: 'standard', name: 'Standard Room', price: '₹1,500 / night', maxGuests: 2, desc: 'A cozy and comfortable room with all essential amenities for a relaxing stay. Perfect for solo travelers or couples.', amenities: ['WiFi', 'AC', 'Smart TV', 'Heater', 'Power Backup', 'Lift'], extraBedAvailable: false, img: '/images/rooms/standard_1.jpg' },
    deluxe: { id: 'deluxe', name: 'Deluxe Room', price: '₹1,800 / night', maxGuests: 3, desc: 'A spacious king bed retreat with premium furnishings, city views, and optional extra bed for small families.', amenities: ['WiFi', 'AC', 'Smart TV', 'Heater', 'Power Backup', 'Lift', 'King Bed', 'City View'], extraBedAvailable: true, img: '/images/rooms/deluxe_1.jpg' },
    suite: { id: 'suite', name: 'Suite Room', price: '₹3,500 / night', maxGuests: 4, desc: 'Luxury suite with separate lounge, mini kitchen, jacuzzi, and panoramic skyline views. 550 sq ft of pure elegance.', amenities: ['WiFi', 'AC', 'Smart TV', 'Heater', 'Power Backup', 'Lift', 'Mini Kitchen', 'Mini Fridge', 'Jacuzzi', 'Panoramic View'], extraBedAvailable: true, img: '/images/rooms/suite_1.jpg' },
    apartments: { id: 'apartments', name: 'Apartments', price: '₹5,000 / night', maxGuests: 8, desc: 'Fully furnished apartments ranging from 1BHK to luxurious 3BHK penthouses for large groups and extended stays.', amenities: ['WiFi', 'Kitchen', 'Living Room', 'Parking', 'AC', 'Balcony'], extraBedAvailable: true, img: '/images/rooms/apartments/15.jpg.jpeg' }
};

const AMENITY_ICONS = {
    'WiFi': Wifi,
    'AC': Wind,
    'Smart TV': Tv,
    'Heater': Thermometer,
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

            // ── matchMedia — Desktop vs Mobile ──
            const mm = gsap.matchMedia();


            // Removed GSAP animations for testimonials (using CSS animations now)
        }, mainRef);

        return () => {
            ctx.revert();
        };
    }, []);

    // ── Intersection Observer for Reveals ──
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const reveals = entry.target.querySelectorAll('.room-reveal');
                    reveals.forEach(el => el.classList.add('revealed'));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const sections = document.querySelectorAll('.rooms-section, .testimonials-section');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
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
                            src="/images/hero_bg.png"
                            className="hero-desktop-img"
                            alt="Al Baith Rest House - Luxury Rooms and Apartments"
                            loading="eager" decoding="async"
                        />
                        <img
                            src="/images/hero_mobile_actual.png"
                            className="hero-mobile-img"
                            alt="Al Baith Rest House - Luxury Rooms and Apartments"
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
                                {'Book Your Comfort Room Today!'.split(' ').map((word, i) => (
                                    <span className="word" key={i}>
                                        <span className="hero-word">{word}</span>{' '}
                                    </span>
                                ))}
                            </h1>
                            <div className="hero-short-line"></div>
                            <p className="hero-subtext">
                                Immerse yourself in the harmony of Arabian heritage and modern serenity.
                                Every room tells a story of timeless luxury.
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
                    <h2 className="section-title room-reveal" style={{ transitionDelay: '100ms' }}>Choose the Best Room for Your Perfect Stay!</h2>
                    <p className="section-subtitle room-reveal" style={{ transitionDelay: '200ms' }}>
                        Experience the art of comfort and luxury. Designed to embrace you in elegance.
                    </p>
                </div>

                <div className="rooms-content-container">
                    {/* MOBILE VERSION: Stacked 3D Carousel (Visible only on <769px) */}
                    <div className="mobile-rooms-only">
                        <div className="rooms-grid-wrapper room-reveal revealed-mobile" style={{ transitionDelay: '300ms' }}>
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
                                        <div className={`room-card float-anim delay-${idx}`}>
                                            <div className="room-card-image-wrapper">
                                                <img src={room.img} alt={room.name} loading="lazy" decoding="async" />
                                            </div>
                                            <div className="room-card-content">
                                                <div className="room-card-header">
                                                    <h3 className="room-card-title">{room.name}</h3>
                                                    <span className="room-card-price">{room.price}</span>
                                                </div>
                                                
                                                <div className="room-info-row">
                                                    <div className="room-amenities-icons">
                                                        {room.amenities.slice(0, 4).map((amenity, amIdx) => {
                                                            const IconComponent = AMENITY_ICONS[amenity] || CheckCircle2;
                                                            return <IconComponent key={amIdx} size={18} className="amenity-icon" />
                                                        })}
                                                    </div>
                                                    <div className="room-capacity-label">
                                                        Capacity: Up to {room.maxGuests} Guests
                                                    </div>
                                                </div>

                                                <div className="room-card-action">
                                                    <button className="btn-view-room-new" onClick={() => navigate(room.id === 'apartments' ? '/apartments' : `/room/${room.id}`)}>
                                                        VIEW ROOM →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* DESKTOP VERSION: Informational Grid (Visible only on >768px) */}
                    <div className="desktop-rooms-only">
                        <div className="rooms-grid-wrapper room-reveal" style={{ transitionDelay: '300ms' }}>
                            <div className="rooms-grid-layout">
                                {Object.values(ROOM_DATA).map((room, idx) => (
                                    <div className="desktop-room-card-wrapper" key={room.id}>
                                        <div className={`room-card float-anim delay-${idx}`}>
                                            <div className="room-card-image-wrapper">
                                                <img src={room.img} alt={room.name} loading="lazy" decoding="async" />
                                            </div>
                                            <div className="room-card-content">
                                                <div className="room-card-header">
                                                    <h3 className="room-card-title">{room.name}</h3>
                                                    <span className="room-card-price">{room.price}</span>
                                                </div>

                                                <div className="room-description">
                                                    {room.desc}
                                                </div>
                                                
                                                <div className="room-key-amenities">
                                                    {room.amenities.slice(0, 4).map((amenity, amIdx) => {
                                                        const IconComponent = AMENITY_ICONS[amenity] || CheckCircle2;
                                                        return (
                                                            <div key={amIdx} className="key-amenity">
                                                                <IconComponent size={18} />
                                                                <span>{amenity}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                <div className="room-guests-label">
                                                    <Users size={18} />
                                                    <span>Up to {room.maxGuests} Guests</span>
                                                </div>

                                                <div className="room-card-action">
                                                    <button className="btn-view-room-new" onClick={() => navigate(room.id === 'apartments' ? '/apartments' : `/room/${room.id}`)}>
                                                        VIEW ROOM →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="view-all-rooms-container" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '40px',
                    width: '100%'
                }}>
                    <button 
                        onClick={() => navigate('/rooms')}
                        className="btn-view-all-rooms"
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            letterSpacing: '0.05em',
                            color: 'var(--accent-gold)',
                            background: 'transparent',
                            border: '1px solid var(--accent-gold)',
                            padding: '12px 32px',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease',
                            minHeight: '44px'
                        }}
                    >
                        VIEW ALL ROOMS <ArrowRight size={18} />
                    </button>
                </div>

            </section>

            <section className="testimonials-section" id="reviews" style={{ paddingBottom: '80px', overflow: 'hidden' }}>
                <div className="section-header">
                    <h2 className="section-title">The Words of Our Guests</h2>
                    <p className="section-subtitle">Real stories from real guests. Discover why they call Al Baith their home away from home.</p>
                </div>

                <div className="review-slider-wrapper">
                    <ReviewAutoSlider />
                </div>
            </section>

        </div >
    );
}
