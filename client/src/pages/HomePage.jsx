import { useEffect, useRef, useState } from 'react';
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
    standard: { id: 'standard', name: 'Standard Room', price: '₹1,500 / night', maxGuests: 2, desc: 'A cozy and comfortable room with all essential amenities for a relaxing stay. Perfect for solo travelers or couples.', amenities: ['WiFi', 'AC', 'Smart TV', 'Heater', 'Power Backup', 'Lift'], extraBedAvailable: false, img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80' },
    deluxe: { id: 'deluxe', name: 'Deluxe Room', price: '₹1,800 / night', maxGuests: 3, desc: 'A spacious king bed retreat with premium furnishings, city views, and optional extra bed for small families.', amenities: ['WiFi', 'AC', 'Smart TV', 'Heater', 'Power Backup', 'Lift', 'King Bed', 'City View'], extraBedAvailable: true, img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80' },
    suite: { id: 'suite', name: 'Suite Room', price: '₹5,000 / night', maxGuests: 4, desc: 'Luxury suite with separate lounge, mini kitchen, jacuzzi, and panoramic skyline views. 550 sq ft of pure elegance.', amenities: ['WiFi', 'AC', 'Smart TV', 'Heater', 'Power Backup', 'Lift', 'Mini Kitchen', 'Mini Fridge', 'Jacuzzi', 'Panoramic View'], extraBedAvailable: true, img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80' },
    apartments: { id: 'apartments', name: 'Apartments', price: '₹3,500 / night', maxGuests: 8, desc: 'Fully furnished apartments ranging from 1BHK to luxurious 3BHK penthouses for large groups and extended stays.', amenities: ['WiFi', 'Kitchen', 'Living Room', 'Parking', 'AC', 'Balcony'], extraBedAvailable: true, img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' }
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

    const [activeRoomIndex, setActiveRoomIndex] = useState(0);
    const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

    const roomsRef = useRef(null);
    const testimonialsRef = useRef(null);

    const scrollToRoom = (index) => {
        if (!roomsRef.current) return;
        const itemWidth = roomsRef.current.scrollWidth / Object.keys(ROOM_DATA).length;
        roomsRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
        setActiveRoomIndex(index);
    };

    const scrollToTestimonial = (index) => {
        if (!testimonialsRef.current) return;
        const itemWidth = testimonialsRef.current.scrollWidth / 3;
        testimonialsRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
        setActiveTestimonialIndex(index);
    };

    const handleRoomsScroll = (e) => {
        if (window.innerWidth > 768) return;
        const { scrollLeft, scrollWidth } = e.target;
        const totalItems = Object.keys(ROOM_DATA).length;
        const itemWidth = scrollWidth / totalItems;
        const index = Math.round(scrollLeft / itemWidth);
        if (index !== activeRoomIndex) setActiveRoomIndex(index);
    };

    const handleTestimonialsScroll = (e) => {
        if (window.innerWidth > 768) return;
        const { scrollLeft, scrollWidth } = e.target;
        const totalItems = 3; // Static number of testimonials
        const itemWidth = scrollWidth / totalItems;
        const index = Math.round(scrollLeft / itemWidth);
        if (index !== activeTestimonialIndex) setActiveTestimonialIndex(index);
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
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80"
                            alt="Luxury hotel lobby with lush botanical interior"
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

                <div className="rooms-grid-wrapper">
                    <div
                        ref={roomsRef}
                        className="rooms-grid-layout"
                        onScroll={handleRoomsScroll}
                    >
                        {Object.values(ROOM_DATA).map((room, idx) => (
                            <div className="room-card-anim-wrapper room-reveal" style={{ transitionDelay: `${300 + (idx * 100)}ms` }} key={room.id}>
                                <div className={`room-card float-anim delay-${idx}`}>
                                    <div className="room-card-image-wrapper">
                                        <img src={room.img} alt={room.name} loading="lazy" decoding="async" />
                                    </div>
                                    <div className="room-card-content">
                                        <div className="room-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', minHeight: '50px' }}>
                                            <h3 className="room-card-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', margin: 0, fontWeight: 500 }}>{room.name}</h3>
                                            <span className="room-card-price" style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', fontWeight: 600, whiteSpace: 'nowrap' }}>{room.price}</span>
                                        </div>
                                        <p className="room-card-desc" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px', lineHeight: 1.6, flexGrow: 1 }}>{room.desc}</p>

                                        <div className="room-amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '24px' }}>
                                            {room.amenities.slice(0, 4).map((amenity, amIdx) => {
                                                const IconComponent = AMENITY_ICONS[amenity] || CheckCircle2;
                                                return (
                                                    <div key={amIdx} className="amenity-chip" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-charcoal)', fontWeight: 500 }}>
                                                        <IconComponent size={14} className="amenity-icon-anim" />
                                                        {amenity}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className="room-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', marginTop: 'auto' }}>
                                            <div className="room-guests" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                                Up to {room.maxGuests} Guests
                                            </div>
                                            <button className="btn-view-room" onClick={() => navigate(room.id === 'apartments' ? '/apartments' : `/room/${room.id}`)}>
                                                <span>View Room</span>
                                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="rooms-scroll-dots hide-desktop">
                        {Object.values(ROOM_DATA).map((_, idx) => (
                            <button
                                key={idx}
                                className={`scroll-dot ${activeRoomIndex === idx ? 'active' : ''}`}
                                onClick={() => scrollToRoom(idx)}
                                aria-label={`Go to room ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

            </section>

            {/* ══════════════════════════════════════════
          3. TESTIMONIALS SECTION
          ══════════════════════════════════════════ */}
            <section className="testimonials-section" id="reviews" style={{ opacity: 1 }}>
                <div className="section-header">
                    <h2 className="section-title room-reveal" style={{ transitionDelay: '150ms' }}>The Words of Our Guests</h2>
                    <p className="section-subtitle room-reveal" style={{ transitionDelay: '300ms' }}>Real stories from real guests. Discover why they call Al Baith their home away from home.</p>
                </div>

                <div className="room-reveal" style={{ transitionDelay: '450ms' }}>
                    <div className="testimonials-scroll-container">
                        <div className="testimonials-infinite-track">
                            {[
                                {
                                    name: "Anjali Menon",
                                    location: "Kochi, Kerala",
                                    image: "https://images.unsplash.com/photo-1594744803329-a584af1cae21?w=100&q=80",
                                    quote: "An absolutely magical experience. The interior design merges Arabian artistry with incredible comfort. Waking up to the garden views each morning was pure bliss. I've never felt so pampered!"
                                },
                                {
                                    name: "Rahul Krishnan",
                                    location: "Trivandrum, Kerala",
                                    image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?w=100&q=80",
                                    quote: "The attention to detail is extraordinary. From the geometric tile work to the fragrant lobbies — every corner is a masterpiece. The spa treatment was a highlight of our honeymoon."
                                },
                                {
                                    name: "Meera Nair",
                                    location: "Wayanad, Kerala",
                                    image: "https://images.unsplash.com/photo-1610030469983-98e6f24965ce?w=100&q=80",
                                    quote: "I travel frequently and Al Baith sets a new standard. The executive suite is unparalleled — the service, the cuisine, absolutely everything exceeded my expectations. Will return!"
                                },
                                {
                                    name: "Aditya Varma",
                                    location: "Bangalore, India",
                                    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80",
                                    quote: "A serene oasis perfectly placed. The blend of biophilic design and classic hospitality made our anniversary trip unforgettable. The staff anticipated our every need."
                                },
                                {
                                    name: "Priya Lakshmi",
                                    location: "Calicut, Kerala",
                                    image: "https://images.unsplash.com/photo-1649123245135-4db6ec9337ec?w=100&q=80",
                                    quote: "Exceptional dining and luxurious amenities. The private cabanas and the personalized service created a boutique experience that we simply cannot stop raving about to our friends."
                                },
                                {
                                    name: "Siddharth Das",
                                    location: "Mumbai, India",
                                    image: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=100&q=80",
                                    quote: "True Arabian hospitality at its finest. The majestic architecture is matched only by the warmth of the staff. A remarkable stay that truly felt like a home away from home."
                                }
                            ].concat([
                                // Duplicate array for seamless infinite looping
                                {
                                    name: "Anjali Menon",
                                    location: "Kochi, Kerala",
                                    image: "https://images.unsplash.com/photo-1594744803329-a584af1cae21?w=100&q=80",
                                    quote: "An absolutely magical experience. The interior design merges Arabian artistry with incredible comfort. Waking up to the garden views each morning was pure bliss. I've never felt so pampered!"
                                },
                                {
                                    name: "Rahul Krishnan",
                                    location: "Trivandrum, Kerala",
                                    image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?w=100&q=80",
                                    quote: "The attention to detail is extraordinary. From the geometric tile work to the fragrant lobbies — every corner is a masterpiece. The spa treatment was a highlight of our honeymoon."
                                },
                                {
                                    name: "Meera Nair",
                                    location: "Wayanad, Kerala",
                                    image: "https://images.unsplash.com/photo-1610030469983-98e6f24965ce?w=100&q=80",
                                    quote: "I travel frequently and Al Baith sets a new standard. The executive suite is unparalleled — the service, the cuisine, absolutely everything exceeded my expectations. Will return!"
                                },
                                {
                                    name: "Aditya Varma",
                                    location: "Bangalore, India",
                                    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80",
                                    quote: "A serene oasis perfectly placed. The blend of biophilic design and classic hospitality made our anniversary trip unforgettable. The staff anticipated our every need."
                                },
                                {
                                    name: "Priya Lakshmi",
                                    location: "Calicut, Kerala",
                                    image: "https://images.unsplash.com/photo-1649123245135-4db6ec9337ec?w=100&q=80",
                                    quote: "Exceptional dining and luxurious amenities. The private cabanas and the personalized service created a boutique experience that we simply cannot stop raving about to our friends."
                                },
                                {
                                    name: "Siddharth Das",
                                    location: "Mumbai, India",
                                    image: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=100&q=80",
                                    quote: "True Arabian hospitality at its finest. The majestic architecture is matched only by the warmth of the staff. A remarkable stay that truly felt like a home away from home."
                                }
                            ]).map((review, idx) => (
                                <div className="testimonial-card" key={idx}>
                                    <div className="testimonial-quote">«</div>
                                    <blockquote>{review.quote}</blockquote>
                                    <div className="testimonial-stars"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
                                    <div className="testimonial-author">
                                        <div className="testimonial-avatar">
                                            <img src={review.image} alt={review.name} loading="lazy" decoding="async" />
                                        </div>
                                        <div className="testimonial-author-info">
                                            <h5>{review.name}</h5>
                                            <span>{review.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div >
    );
}
