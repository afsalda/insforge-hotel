import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@insforge/sdk';
import { Wifi, Wind, Tv, Thermometer, Sun, Building, BedDouble, ChefHat, Bath, Square, Car, Sofa, TreePine, Users, ChevronLeft, ArrowRight } from 'lucide-react';

/* ─── InsForge Client ─── */
const isProduction = import.meta.env.PROD;
const INSFORGE_URL = isProduction
    ? window.location.origin
    : (import.meta.env.VITE_INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app');
const INSFORGE_ANON_KEY = import.meta.env.VITE_INSFORGE_ANON_KEY || '';
const insforge = createClient({ baseUrl: INSFORGE_URL, anonKey: INSFORGE_ANON_KEY });

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
    'Balcony': TreePine
};

export default function RoomsPage() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            // In a real app we fetch from 'listings' or 'room_types' table
            // For now we use the same fallback data as HomePage for consistency if DB fails
            const fallbackRooms = [
                { id: 'standard', name: 'Standard Room', pricing_per_night: 1500, details_max_guests: 2, description: 'A cozy and comfortable room with all essential amenities for a relaxing stay.', amenity_ids: ['WiFi', 'AC', 'Smart TV', 'Heater'], photos: ['/images/rooms/standard_1.jpg'] },
                { id: 'deluxe', name: 'Deluxe Room', pricing_per_night: 1800, details_max_guests: 3, description: 'A spacious king bed retreat with premium furnishings and city views.', amenity_ids: ['WiFi', 'AC', 'Smart TV', 'King Bed'], photos: ['/images/rooms/deluxe_1.jpg'] },
                { id: 'suite', name: 'Suite Room', pricing_per_night: 3500, details_max_guests: 4, description: 'Luxury suite with separate lounge, mini kitchen, and jacuzzi.', amenity_ids: ['WiFi', 'AC', 'Jacuzzi', 'Mini Kitchen'], photos: ['/images/rooms/suite_1.jpg'] },
                { id: 'apartments', name: 'Apartments', pricing_per_night: 5000, details_max_guests: 8, description: 'Fully furnished apartments for large groups and extended stays.', amenity_ids: ['WiFi', 'Kitchen', 'Living Room', 'Parking'], photos: ['/images/rooms/apartments/15.jpg.jpeg'] }
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
        <div className="rooms-page-container" style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-off-white)', paddingBottom: '100px' }}>
            {/* Back Button */}
            <button 
                onClick={() => navigate('/')} 
                className="checkout-back-btn" 
                style={{ position: 'absolute', top: '90px', left: '5%', background: 'white', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer', zIndex: 10 }}
            >
                <ChevronLeft size={24} color="var(--accent-gold)" />
            </button>

            <div className="section-header">
                <h1 className="section-title">Our Rooms</h1>
                <p className="section-subtitle">Discover our curated selection of luxury stays designed for your ultimate comfort.</p>
            </div>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <div className="rooms-all-grid" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                        gap: '32px',
                        marginTop: '40px'
                    }}>
                        {rooms.map((room) => (
                            <div key={room.id} className="room-card-v2" style={{
                                backgroundColor: 'white',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-soft)',
                                transition: 'transform 0.3s var(--transition-smooth), boxShadow 0.3s var(--transition-smooth)',
                                border: '1px solid rgba(201,169,110,0.1)'
                            }}>
                                <div className="room-card-image" style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                                    <img 
                                        src={room.photos?.[0] || room.img || '/images/hero_bg.png'} 
                                        alt={room.name || room.title} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div className="room-card-price-tag" style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        backgroundColor: 'rgba(26, 46, 26, 0.9)',
                                        color: 'var(--accent-gold)',
                                        padding: '8px 16px',
                                        borderRadius: '30px',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid var(--accent-gold-dim)'
                                    }}>
                                        ₹{room.pricing_per_night || (room.price?.match(/\d+/)?.[0])}
                                    </div>
                                </div>
                                
                                <div className="room-card-info-v2" style={{ padding: '24px' }}>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--bg-deep-green)', marginBottom: '8px' }}>
                                        {room.name || room.title}
                                    </h3>
                                    
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                                        {room.description || room.desc}
                                    </p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', color: 'var(--bg-deep-green)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                            <Users size={16} />
                                            <span>{room.details_max_guests || room.maxGuests} Guests</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {(room.amenity_ids || room.amenities || []).slice(0, 3).map((amn, i) => {
                                                const Icon = AMENITY_ICONS[amn] || Wifi;
                                                return <Icon key={i} size={16} color="var(--accent-gold)" />
                                            })}
                                        </div>
                                    </div>

                                    <div className="room-card-actions" style={{ display: 'flex', gap: '12px' }}>
                                        <button 
                                            onClick={() => navigate(room.id === 'apartments' ? '/apartments' : `/room/${room.id}`)}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '12px',
                                                border: '1px solid var(--accent-gold)',
                                                background: 'transparent',
                                                color: 'var(--bg-deep-green)',
                                                fontWeight: '600',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            className="btn-rooms-outline"
                                        >
                                            DETAILS
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/checkout/${room.id}`)}
                                            style={{
                                                flex: 2,
                                                padding: '12px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                background: 'var(--bg-deep-green)',
                                                color: 'white',
                                                fontWeight: '600',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                            className="btn-rooms-primary"
                                        >
                                            BOOK NOW <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
