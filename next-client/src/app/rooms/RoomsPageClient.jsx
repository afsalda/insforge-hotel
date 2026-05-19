'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Wifi, Wind, Tv, Thermometer, Sun, Building, BedDouble, ChefHat, Bath, Square, Car, Sofa, TreePine, ArrowRight, Coffee, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCardStack from '@/components/PropertyCardStack';
import { insforge } from '@/lib/api';

export default function RoomsPageClient() {
    const router = useRouter();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const headerRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchRooms();
    }, []);

    useEffect(() => {
        const gsap = typeof window !== 'undefined' ? window.gsap : null;
        if (!gsap) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.gs-word',
                { yPercent: 100 },
                { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power4.out' }
            );
        }, headerRef);

        return () => ctx.revert();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const fallbackRooms = [
                { id: 'standard', name: 'Standard Room', pricing_per_night: 1500, details_max_guests: 2, description: 'A cozy and comfortable room with all essential amenities for a relaxing stay.', amenity_ids: ['WiFi', 'AC', 'Electric Kettle', 'Smart TV', 'Heater'], photos: ['/images/webp/rooms/standard_1.webp'] },
                { id: 'deluxe', name: 'Deluxe Room', pricing_per_night: 1800, details_max_guests: 3, description: 'A spacious king bed retreat with premium furnishings and city views.', amenity_ids: ['WiFi', 'AC', 'Electric Kettle', 'Smart TV', 'King Bed'], photos: ['/images/webp/rooms/deluxe_1.webp'] },
                { id: 'suite', name: 'Suite Room', pricing_per_night: 3500, details_max_guests: 4, description: 'Luxury suite with separate lounge, mini kitchen, and jacuzzi.', amenity_ids: ['WiFi', 'AC', 'Electric Kettle', 'Jacuzzi', 'Mini Kitchen'], photos: ['/images/webp/rooms/suite_1.webp'] },
                { id: 'apartments', name: 'Apartments', pricing_per_night: 2500, details_max_guests: 8, description: 'Fully furnished apartments for large groups and extended stays.', amenity_ids: ['WiFi', 'Kitchen', 'Electric Kettle', 'Living Room', 'Parking'], photos: ['/images/webp/rooms/apartments/15.jpg.webp'] }
            ];

            const { data, error } = await insforge.database
                .from('listings')
                .select('*')
                .eq('status', 'active');

            if (error || !data || data.length === 0) {
                setRooms(fallbackRooms);
            } else {
                setRooms(data);
            }
        } catch (err) {
            console.error('Error fetching rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="rooms-page-container"
                key="rooms-page"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--bg-off-white)', paddingBottom: '60px' }}
            >
                <div className="px-4 md:px-6 mx-auto max-w-[1200px]">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        type="button"
                        onClick={() => router.push('/')}
                        className="checkout-back-btn"
                        style={{ position: 'static', marginBottom: '20px' }}
                    >
                        <ChevronLeft size={24} color="var(--accent-gold)" />
                    </motion.button>
                </div>

                <div className="section-header" ref={headerRef}>
                    <h1 className="section-title" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {'Our Rooms'.split(' ').map((word, i) => (
                            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                                <span className="gs-word" style={{ display: 'inline-block' }}>{word}</span>
                            </span>
                        ))}
                    </h1>
                    <motion.p
                        className="section-subtitle"
                        initial={{ opacity: 0, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, delay: 0.45 }}
                    >
                        Discover our curated selection of luxury stays designed for your ultimate comfort.
                    </motion.p>
                </div>

                <div className="container mx-auto max-w-[1200px] px-4 md:px-6" style={{ margin: '0 auto' }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        <div className="rooms-all-grid">
                            {rooms.map((room, index) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <PropertyCardStack
                                        room={room}
                                        onClick={() => router.push(room.id === 'apartments' ? '/apartments' : `/rooms/${room.id}`)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
