'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wifi, Thermometer, Tv, TreePine, BedDouble, Building, ChefHat, Bath, Square, Car, Sofa, Coffee } from 'lucide-react';
import { Leaf, Wind, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReviewAutoSlider } from '@/components/ui/review-auto-slider';
import PropertyCardStack from '@/components/PropertyCardStack';

const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

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

const ROOM_DATA = {
    standard: { id: 'standard', name: 'Standard Room', price: '₹1,500 / night', maxGuests: 2, desc: 'A cozy and comfortable room with all essential amenities for a relaxing stay. Perfect for solo travelers or couples.', amenities: ['Free Wi-Fi', 'AC', 'Electric Kettle', 'Smart TV', 'Heater', 'Power Backup 24/7', 'Lift'], extraBedAvailable: false, img: '/images/webp/rooms/standard_1.webp' },
    deluxe: { id: 'deluxe', name: 'Deluxe Room', price: '₹1,800 / night', maxGuests: 3, desc: 'A spacious king bed retreat with premium furnishings, city views, and optional extra bed for small families.', amenities: ['Free Wi-Fi', 'AC', 'Electric Kettle', 'Smart TV', 'Heater', 'Power Backup 24/7', 'Lift', 'King Bed', 'City View'], extraBedAvailable: true, img: '/images/webp/rooms/deluxe_1.webp' },
    suite: { id: 'suite', name: 'Suite Room', price: '₹3,500 / night', maxGuests: 4, desc: 'Luxury suite with separate lounge, mini kitchen, jacuzzi, and panoramic skyline views. 550 sq ft of pure elegance.', amenities: ['Free Wi-Fi', 'AC', 'Electric Kettle', 'Smart TV', 'Heater', 'Power Backup 24/7', 'Lift', 'Mini Kitchen', 'Mini Fridge', 'Jacuzzi', 'Panoramic View'], extraBedAvailable: true, img: '/images/webp/rooms/suite_1.webp' },
    apartments: { id: 'apartments', name: 'Apartments', price: '₹2,500 / night', maxGuests: 8, desc: 'Fully furnished apartments ranging from 1BHK to luxurious 3BHK penthouses for large groups and extended stays.', amenities: ['Free Wi-Fi', 'Kitchen', 'Electric Kettle', 'Living Room', 'Parking', 'AC', 'Balcony'], extraBedAvailable: true, img: '/images/webp/rooms/apartments/15.jpg.webp' }
};

export default function HomePage() {
    const mainRef = useRef(null);
    const router = useRouter();

    /* ─── GSAP + Lenis Init ─── */
    useEffect(() => {
        const gsap = typeof window !== 'undefined' ? window.gsap : null;
        const ScrollTrigger = typeof window !== 'undefined' ? window.ScrollTrigger : null;

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

            heroTl.to('.hero-bg img', {
                yPercent: 15,
                ease: 'none',
                duration: 1
            }, 0);

            heroTl.to(['.hero-label-group', '.hero-headline', '.hero-short-line', '.hero-subtext'], {
                y: -150,
                opacity: 0,
                ease: 'none',
                duration: 0.4
            }, 0);

            heroTl.to('.hero-cta-row', {
                opacity: 0,
                ease: 'none',
                duration: 0.2
            }, 0);

            // ── Rooms Section Reveal ──
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

        return () => ctx.revert();
    }, []);

    // ── Timeline Reveal IntersectionObserver ──
    useEffect(() => {
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
                { threshold: 0.01 }
            );

            elements.forEach(el => observer.observe(el));
        }, 100);

        return () => clearTimeout(timer);
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

            {/* Page Load Curtain */}
            <div className="page-curtain">
                <span className="curtain-logo">AL BAITH</span>
            </div>

            {/* 1. HERO SECTION */}
            <section className="hero">
                <div className="hero-sticky-container">
                    <div className="hero-bg">
                        <img
                            src="/images/webp/hero_bg.webp"
                            className="hero-desktop-img"
                            alt="Al Baith Rest House – Hotel near Lakeshore Hospital, Ernakulam, Kerala"
                            loading="eager"
                        />
                        <img
                            src="/images/webp/hero_mobile_actual.webp"
                            className="hero-mobile-img"
                            alt="Al Baith Rest House – Hotel near Lakeshore Hospital, Ernakulam, Kerala"
                            loading="eager"
                        />
                    </div>

                    <div className="hero-content">
                        <div className="hero-text">
                            <div className="hero-label-group">
                                <span className="hero-top-label">Luxury Stays</span>
                                <div className="hero-gold-line"></div>
                            </div>
                            <h1 className="hero-headline">
                                <span className="word" style={{ display: 'block' }}>
                                    <span className="hero-word">Albaith</span>
                                </span>
                                <span className="word" style={{ display: 'block' }}>
                                    <span className="hero-word">Resthouse</span>
                                </span>
                            </h1>

                            <div className="hero-short-line"></div>
                            <p className="hero-subtext">
                                Comfortable Rooms Steps Away from Lakeshore Hospital
                            </p>

                            <div className="hero-cta-row">
                                <a href="#rooms" className="btn-primary font-inter-numbers">EXPLORE ROOMS</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <OrnamentalDivider />

            {/* 2. ROOMS SECTION */}
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
                    {/* MOBILE VERSION: Stacked 3D Carousel */}
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
                                            type: "spring", stiffness: 400, damping: 35, mass: 0.8
                                        }}
                                        drag={isActive ? "x" : false}
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.8}
                                        dragMomentum={false}
                                        onDragEnd={(e, { offset: dragOffset, velocity }) => {
                                            const swipe = swipePower(dragOffset.x, velocity.x);
                                            if (swipe < -4000 || dragOffset.x < -50) {
                                                paginateRoom(1);
                                            } else if (swipe > 4000 || dragOffset.x > 50) {
                                                paginateRoom(-1);
                                            }
                                        }}
                                        style={{ position: 'absolute', touchAction: 'pan-y' }}
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
                                                onClick={() => router.push(room.id === 'apartments' ? '/apartments' : `/rooms/${room.id}`)}
                                            />
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* DESKTOP VERSION: Grid */}
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
                                            onClick={() => router.push(room.id === 'apartments' ? '/apartments' : `/rooms/${room.id}`)}
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
                        onClick={() => router.push('/rooms')}
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

            {/* REVIEWS SECTION */}
            <section className="testimonials-section" id="reviews" style={{ paddingBottom: '0px', overflow: 'hidden' }}>
                <div className="section-header">
                    <h2 className="section-title">The Words of Our Guests</h2>
                    <p className="section-subtitle">Real stories from real guests. Discover why they call Al Baith their home away from home.</p>
                </div>

                <div className="review-slider-wrapper">
                    <ReviewAutoSlider />
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className="testimonials-section" style={{ paddingTop: '100px', paddingBottom: '40px', overflow: 'hidden' }}>
                <div className="section-header" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                    <h2 className="section-title timeline-reveal" style={{ marginBottom: '32px' }}>The Closest Comfortable Stay to Lakeshore Hospital</h2>
                    <div className="section-subtitle" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                        <p style={{ marginBottom: '16px' }} className="timeline-reveal">
                            When a loved one is receiving care at Lakeshore Hospital in Ernakulam, the last thing you need is a long commute back to your hotel.
                        </p>
                        <p style={{ marginBottom: '16px' }} className="timeline-reveal">
                            Al Baith Rest House is located just a short distance from Lakeshore Hospital — making us the first choice for patient families, visiting doctors, and medical staff looking for accommodation in Ernakulam, Kochi.
                        </p>
                        <p style={{ marginBottom: '16px' }} className="timeline-reveal">
                            We offer clean AC rooms, free Wi-Fi, hot water, and daily housekeeping — everything you need for a comfortable stay during a difficult time.
                        </p>
                    </div>
                </div>
            </section>

            {/* LOCATION SECTION */}
            <section className="testimonials-section" style={{ paddingTop: '40px', paddingBottom: '100px', overflow: 'hidden' }}>
                <div className="section-header" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                    <h2 className="section-title timeline-reveal" style={{ marginBottom: '32px' }}>How to Find Us — Ernakulam, Kerala</h2>
                    <div className="section-subtitle" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                        <p style={{ marginBottom: '16px' }} className="timeline-reveal">
                            Al Baith Rest House is situated in Ernakulam, Kochi, Kerala — within close proximity to Lakeshore Hospital.
                        </p>
                        <p style={{ marginBottom: '16px' }} className="timeline-reveal">
                            We are easily reachable from Ernakulam Junction Railway Station, Cochin International Airport, and the Kochi Metro.
                        </p>
                        <p className="timeline-reveal">
                            Auto-rickshaws and cabs are available at all hours from our location.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
