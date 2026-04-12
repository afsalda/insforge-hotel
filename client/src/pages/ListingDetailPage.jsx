import { useState, useEffect, useRef, cloneElement } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Star, Share2, Heart, Award, KeyRound, Wifi,
    Car, Snowflake, CookingPot, Tv, WashingMachine, Waves,
    Trees, ChevronRight, CheckCircle, Loader2, X, Coffee,
    MapPin
} from 'lucide-react';
import '../ListingDetailRedesign.css';
import { createBooking } from '../lib/api.js';
import BookingCalendar from '../components/BookingCalendar';
import toast from 'react-hot-toast';

export const LISTING_DATA = {
    'standard': {
        title: 'Standard Room',
        location: 'Al Baith Hotel',
        rating: 4.85, reviews: 142,
        host: { name: 'Al Baith', years: 10, image: null, superhost: true },
        images: [
            '/images/webp/rooms/standard_1.webp',
            '/images/webp/rooms/standard_2.webp',
            '/images/webp/rooms/standard_3.webp',
            '/images/webp/rooms/standard_4.webp',
            '/images/webp/rooms/standard_5.webp'
        ],
        guests: 2, bedrooms: 1, beds: 1, baths: 1,
        description: 'A cozy and comfortable room with all essential amenities for a relaxing stay. Perfect for solo travelers or couples.',
        amenities: [
            { label: 'Free Wi-Fi', icon: <Wifi size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Electric Kettle', icon: <Coffee size={24} /> },
            { label: 'Smart TV', icon: <Tv size={24} /> },
            { label: 'Power Backup 24/7', icon: <KeyRound size={24} /> }
        ],
        price: 1500, cleaningFee: 200, serviceFee: 150
    },
    'deluxe': {
        title: 'Deluxe Room',
        location: 'Al Baith Hotel',
        rating: 4.95, reviews: 312,
        host: { name: 'Al Baith', years: 10, image: null, superhost: true },
        images: [
            '/images/webp/rooms/deluxe_1.webp',
            '/images/webp/rooms/deluxe_2.webp',
            '/images/webp/rooms/deluxe_3.webp',
            '/images/webp/rooms/deluxe_1.webp',
            '/images/webp/rooms/deluxe_2.webp'
        ],
        guests: 3, bedrooms: 1, beds: 2, baths: 1,
        description: 'A spacious king bed retreat with premium furnishings, city views, and optional extra bed available for small families.',
        amenities: [
            { label: 'Free Wi-Fi', icon: <Wifi size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Electric Kettle', icon: <Coffee size={24} /> },
            { label: 'Smart TV', icon: <Tv size={24} /> },
            { label: 'City View', icon: <Tv size={24} /> },
            { label: 'Extra Bed (Free)', icon: <Trees size={24} /> }
        ],
        price: 1800, cleaningFee: 250, serviceFee: 200
    },
    'suite': {
        title: 'Suite Room',
        location: 'Al Baith Hotel',
        rating: 5.0, reviews: 89,
        host: { name: 'Al Baith', years: 10, image: null, superhost: true },
        images: [
            '/images/webp/rooms/suite_1.webp',
            '/images/webp/rooms/suite_2.webp',
            '/images/webp/rooms/suite_3.webp',
            '/images/webp/rooms/suite_4.webp',
            '/images/webp/rooms/suite_5.webp'
        ],
        guests: 4, bedrooms: 2, beds: 2, baths: 2,
        description: 'Luxury suite with separate lounge, mini kitchen, jacuzzi, and panoramic skyline views. 550 sq ft of pure elegance.',
        amenities: [
            { label: 'Free Wi-Fi', icon: <Wifi size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Electric Kettle', icon: <Coffee size={24} /> },
            { label: 'Smart TV', icon: <Tv size={24} /> },
            { label: 'Heater', icon: <Snowflake size={24} /> },
            { label: 'Power Backup 24/7', icon: <KeyRound size={24} /> },
            { label: 'Lift', icon: <ArrowLeft size={24} /> },
            { label: 'Mini Kitchen', icon: <CookingPot size={24} /> },
            { label: 'Mini Fridge', icon: <Snowflake size={24} /> },
            { label: 'Jacuzzi', icon: <Waves size={24} /> },
            { label: 'Panoramic View', icon: <Trees size={24} /> }
        ],
        price: 3500, cleaningFee: 350, serviceFee: 400
    },
    'executive': {
        title: 'Executive Room',
        location: 'Al Baith Hotel',
        rating: 4.92, reviews: 156,
        host: { name: 'Al Baith', years: 10, image: null, superhost: true },
        images: [
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
            'https://images.unsplash.com/photo-1584132967334-10e028b1db15?w=800&q=80',
            'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80'
        ],
        guests: 2, bedrooms: 1, beds: 1, baths: 1,
        description: 'Sophisticated workspace and luxury bedding for the modern professional. Includes balcony and premium mini-bar.',
        amenities: [
            { label: 'WiFi', icon: <Wifi size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Electric Kettle', icon: <Coffee size={24} /> },
            { label: 'Work Desk', icon: <Tv size={24} /> },
            { label: 'Balcony', icon: <Trees size={24} /> }
        ],
        price: 2500, cleaningFee: 250, serviceFee: 200
    },
    'apt1': {
        title: '1BHK Apartment',
        location: 'Al Baith Hotel',
        rating: 4.88, reviews: 54,
        host: { name: 'Al Baith', years: 10, image: null, superhost: true },
        images: [
            '/images/webp/rooms/apartments/3.jpg.webp',
            '/images/webp/rooms/apartments/1.jpg.webp',
            '/images/webp/rooms/apartments/2.jpg.webp',
            '/images/webp/rooms/apartments/25.jpg.webp'
        ],
        guests: 3, bedrooms: 1, beds: 1, baths: 1,
        description: 'Cozy fully furnished 1BHK apartment with a complete kitchen, living room, and high-speed Wi-Fi. Ideal for extended stays.',
        amenities: [
            { label: 'WiFi', icon: <Wifi size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Electric Kettle', icon: <Coffee size={24} /> },
            { label: 'Full Kitchen', icon: <CookingPot size={24} /> },
            { label: 'Living Room', icon: <Tv size={24} /> },
            { label: 'Free Parking', icon: <Car size={24} /> }
        ],
        price: 5000, cleaningFee: 200, serviceFee: 250
    },
    'apt2': {
        title: '2BHK Family Apartment',
        location: 'Al Baith Hotel',
        rating: 4.90, reviews: 92,
        host: { name: 'Al Baith', years: 10, image: null, superhost: true },
        images: [
            '/images/webp/rooms/apartments/5.jpg.webp',
            '/images/webp/rooms/apartments/6.jpg.webp',
            '/images/webp/rooms/apartments/4.jpg.webp',
            '/images/webp/rooms/apartments/12.jpg.webp'
        ],
        guests: 5, bedrooms: 2, beds: 2, baths: 2,
        description: 'Spacious 2BHK apartment ideal for families, featuring modern furnishings, great panoramic views, and large kitchen spaces.',
        amenities: [
            { label: 'WiFi', icon: <Wifi size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Full Kitchen', icon: <CookingPot size={24} /> },
            { label: 'Washing Machine', icon: <WashingMachine size={24} /> },
            { label: 'Free Parking', icon: <Car size={24} /> }
        ],
        price: 5500, cleaningFee: 300, serviceFee: 350
    },
    'apt3': {
        title: '3BHK Penthouse Apartment',
        location: 'Al Baith Hotel',
        rating: 4.96, reviews: 120,
        host: { name: 'Al Baith', years: 10, image: null, superhost: true },
        images: [
            '/images/webp/rooms/apartments/14.jpg.webp',
            '/images/webp/rooms/apartments/15.jpg.webp',
            '/images/webp/rooms/apartments/3.jpg.webp',
            '/images/webp/rooms/apartments/5.jpg.webp',
            '/images/webp/rooms/apartments/25.jpg.webp',
            '/images/webp/rooms/apartments/4.jpg.webp'
        ],
        guests: 8, bedrooms: 3, beds: 3, baths: 3,
        description: 'Luxury 3BHK penthouse style apartment perfect for large groups or families seeking premium privacy with extraordinary city views.',
        amenities: [
            { label: 'WiFi', icon: <Wifi size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Full Chef Kitchen', icon: <CookingPot size={24} /> },
            { label: 'In-Unit Washer', icon: <WashingMachine size={24} /> },
            { label: 'Reserved Parking', icon: <Car size={24} /> }
        ],
        price: 8500, cleaningFee: 450, serviceFee: 500
    }
};

export function getListingDetail(id) {
    if (LISTING_DATA[id]) return LISTING_DATA[id];
    return {
        title: `Beautiful Stay #${id}`,
        location: 'Al Baith Hotel',
        rating: 4.9, reviews: 128,
        host: { name: 'Sarah', years: 5, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', superhost: true },
        images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
        ],
        guests: 4, bedrooms: 2, beds: 2, baths: 2,
        description: 'Escape to this architecturally stunning property. Enjoy all the comforts of home with premium amenities.',
        amenities: [
            { label: 'Fast wifi', icon: <Wifi size={24} /> },
            { label: 'Fully equipped kitchen', icon: <CookingPot size={24} /> },
            { label: 'Free parking', icon: <Car size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Smart TV', icon: <Tv size={24} /> },
            { label: 'Washer & Dryer', icon: <WashingMachine size={24} /> }
        ],
        price: 245, cleaningFee: 65, serviceFee: 95
    };
}

// Helper to format dates as YYYY-MM-DD in local time
function toDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function calcNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function ListingDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const listing = getListingDetail(id);

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guestsCount, setGuestsCount] = useState(1);
    const [activePicker, setActivePicker] = useState(null);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [activeImgIndex, setActiveImgIndex] = useState(0);
    const [errors, setErrors] = useState({});

    const [isDescExpanded, setIsDescExpanded] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return null;
        // Parse YYYY-MM-DD
        const [y, m, d] = dateStr.split('-');
        const date = new Date(y, parseInt(m) - 1, parseInt(d));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const calcNights = (inDate, outDate) => {
        if (!inDate || !outDate) return 0;
        const diff = new Date(outDate) - new Date(inDate);
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const nights = calcNights(checkIn, checkOut);
    const subtotal = listing.price * nights;
    const total = subtotal + listing.cleaningFee + listing.serviceFee;

    const handleReserve = (e) => {
        if (e) e.stopPropagation();

        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!checkIn) {
            newErrors.checkIn = 'This field is required.';
        } else if (new Date(checkIn) < today) {
            newErrors.checkIn = 'Please select a valid future date.';
        }

        if (!checkOut) {
            newErrors.checkOut = 'This field is required.';
        }

        if (checkIn && checkOut) {
            const inDate = new Date(checkIn);
            const outDate = new Date(checkOut);

            if (checkIn === checkOut) {
                newErrors.checkOut = 'Check-in and checkout dates cannot be the same.';
            } else if (outDate < inDate) {
                newErrors.checkOut = 'Checkout date must be after check-in date.';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            if (isMobile) {
                setShowBottomSheet(true);
                if (!checkIn || newErrors.checkIn) {
                    setActivePicker('in');
                } else {
                    setActivePicker('out');
                }
            }
            return;
        }

        setErrors({});
        if (isMobile) {
            setShowBottomSheet(false);
            setActivePicker(null);
        }

        try {
            navigate(`/checkout/${id}`, {
                state: { checkIn, checkOut, guestsCount, nights, total, subtotal }
            });
        } catch (err) {
            console.error('Navigation failed:', err);
            toast.error('Navigation failed');
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: listing.title,
            text: `Check out this amazing stay at Al Baith: ${listing.title}`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                } catch (copyErr) { }
            }
        }
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        if (!isSaved) toast.success('Saved to wishlist');
    };

    const galleryRef = useRef(null);

    const scrollToImage = (index) => {
        if (!galleryRef.current) return;
        const width = galleryRef.current.offsetWidth;
        galleryRef.current.scrollTo({ left: index * width, behavior: 'smooth' });
        setActiveImgIndex(index);
    };

    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeftDrag = useRef(0);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - galleryRef.current.offsetLeft;
        scrollLeftDrag.current = galleryRef.current.scrollLeft;
        galleryRef.current.style.cursor = 'grabbing';
        galleryRef.current.style.scrollSnapType = 'none'; // Disable snap during drag
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        if (galleryRef.current) {
            galleryRef.current.style.cursor = 'grab';
            galleryRef.current.style.scrollSnapType = 'x mandatory'; // Re-enable snap
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - galleryRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        galleryRef.current.scrollLeft = scrollLeftDrag.current - walk;
    };

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.offsetWidth;
        const index = Math.round(scrollLeft / width);
        setActiveImgIndex(index);
    };

    const NAVBAR_HEIGHT = 64;

    // DESKTOP VIEW
    if (!isMobile) {
        return (
            <div style={{ width: '100%', backgroundColor: '#F9F8F6', paddingTop: '100px', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
                <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    
                    {/* Back Arrow */}
                    <div style={{ marginBottom: '16px' }}>
                        <button 
                            onClick={() => navigate('/rooms')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                            <ArrowLeft size={24} color="#333" />
                        </button>
                    </div>

                    {/* Title Section */}
                    <div style={{ marginBottom: '8px' }}>
                        <h1 style={{ fontSize: '42px', fontWeight: 400, color: '#1B3A2D', margin: 0, fontFamily: 'var(--font-heading)' }}>
                            {listing.title}
                        </h1>
                    </div>

                    {/* Metadata Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '15px', color: '#1B3A2D' }}>
                            <Star size={16} fill="#FF385C" color="#FF385C" /> 
                            <span style={{ fontWeight: 700 }}>{listing.rating}</span>
                            <span style={{ margin: '0 4px' }}>·</span>
                            <span style={{ color: '#1B3A2D', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}>{listing.reviews} reviews</span>
                            <span style={{ margin: '0 8px', color: '#888' }}>·</span>
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Al Baith Hotel " + listing.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#1B3A2D' }}
                            >
                                <MapPin size={16} />
                                <span style={{ color: '#1B3A2D', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}>{listing.location}</span>
                            </a>
                        </div>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <button 
                                onClick={handleShare}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 500, color: '#1B3A2D' }}
                            >
                                <Share2 size={18} /> <span style={{ textDecoration: 'underline' }}>Share</span>
                            </button>
                            <button 
                                onClick={handleSave}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 500, color: '#1B3A2D' }}
                            >
                                <Heart size={18} fill={isSaved ? "#1B3A2D" : "none"} color="#1B3A2D" /> <span style={{ textDecoration: 'underline' }}>Save</span>
                            </button>
                        </div>
                    </div>

                    {/* Image Grid */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gridTemplateRows: 'repeat(2, 280px)', 
                        gap: '12px', 
                        width: '100%', 
                        borderRadius: '24px', 
                        overflow: 'hidden', 
                        marginBottom: '48px',
                        boxShadow: '0 4px 30px rgba(0,0,0,0.05)'
                    }}>
                        {/* Large Main Image */}
                        <div style={{ gridColumn: 'span 2', gridRow: 'span 2', position: 'relative' }}>
                            <img 
                                src={listing.images[0]} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                alt={`${listing.title} – Al Baith Rest House, Ernakulam, Kerala`}
                            />
                        </div>
                        {/* Smaller Images */}
                        <div style={{ gridColumn: 'span 1', gridRow: 'span 1' }}>
                            <img 
                                src={listing.images[1] || listing.images[0]} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                alt={`${listing.title} – Al Baith Rest House, Ernakulam, Kerala`}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 1', gridRow: 'span 1' }}>
                            <img 
                                src={listing.images[2] || listing.images[0]} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                alt={`${listing.title} – Al Baith Rest House, Ernakulam, Kerala`}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 1', gridRow: 'span 1' }}>
                            <img 
                                src={listing.images[3] || listing.images[0]} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                alt={`${listing.title} – Al Baith Rest House, Ernakulam, Kerala`}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 1', gridRow: 'span 1', position: 'relative' }}>
                            <img 
                                src={listing.images[4] || listing.images[0]} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                alt={`${listing.title} – Al Baith Rest House, Ernakulam, Kerala`}
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div style={{ display: 'flex', gap: '80px', marginBottom: '80px' }}>
                        {/* Left Column: Description & Amenities */}
                        <div style={{ flex: 1.8 }}>
                            <div style={{ marginBottom: '40px' }}>
                                <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#333', margin: 0 }}>
                                    {listing.description}
                                </p>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #EEE', margin: '40px 0' }} />

                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#1B3A2D', margin: '0 0 24px 0', fontFamily: 'var(--font-heading)' }}>
                                    What We Offer
                                </h2>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(2, 1fr)', 
                                    gap: '20px'
                                }}>
                                    {listing.amenities.map((a, i) => (
                                        <div key={i} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '16px',
                                            fontSize: '16px',
                                            color: '#444'
                                        }}>
                                            <div style={{ color: '#1B3A2D' }}>{cloneElement(a.icon, { size: 24, strokeWidth: 1.5 })}</div>
                                            <span>{a.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Booking Card */}
                        <div style={{ flex: 1, position: 'relative' }}>
                            <div style={{ 
                                position: 'sticky', 
                                top: '100px', 
                                background: 'white', 
                                borderRadius: '24px', 
                                padding: '32px', 
                                boxShadow: '0 10px 40px rgba(0,0,0,0.06)', 
                                border: '1px solid #F0F0F0' 
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <div>
                                        <span style={{ fontSize: '28px', fontWeight: 600, color: '#1B3A2D' }}>₹{listing.price}</span>
                                        <span style={{ fontSize: '16px', color: '#666', marginLeft: '4px' }}>/night</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                                        <Star size={16} fill="#000" />
                                        <span>{listing.rating}</span>
                                    </div>
                                </div>

                                <div style={{ 
                                    border: '1px solid #DDD', 
                                    borderRadius: '12px', 
                                    overflow: 'visible',
                                    marginBottom: '24px',
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', borderBottom: '1px solid #DDD' }}>
                                        <div 
                                            onClick={() => setActivePicker(activePicker === 'in' ? null : 'in')}
                                            style={{ flex: 1, padding: '12px', borderRight: '1px solid #DDD', cursor: 'pointer', position: 'relative' }}
                                        >
                                            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Check-in</div>
                                            <div style={{ color: !checkIn ? '#aaa' : '#000', fontSize: '14px' }}>
                                                {formatDisplayDate(checkIn) || 'Add date'}
                                            </div>
                                            {activePicker === 'in' && (
                                                <div className="calendar-popover" onClick={e => e.stopPropagation()}>
                                                    <BookingCalendar
                                                        selectedDate={checkIn}
                                                        onSelect={(date) => { setCheckIn(date); setActivePicker('out'); setErrors({}); }}
                                                        minDate={toDateStr(new Date())}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div 
                                            onClick={() => setActivePicker(activePicker === 'out' ? null : 'out')}
                                            style={{ flex: 1, padding: '12px', cursor: 'pointer', position: 'relative' }}
                                        >
                                            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Checkout</div>
                                            <div style={{ color: !checkOut ? '#aaa' : '#000', fontSize: '14px' }}>
                                                {formatDisplayDate(checkOut) || 'Add date'}
                                            </div>
                                            {activePicker === 'out' && (
                                                <div className="calendar-popover align-right" onClick={e => e.stopPropagation()}>
                                                    <BookingCalendar
                                                        selectedDate={checkOut}
                                                        onSelect={(date) => { setCheckOut(date); setActivePicker(null); setErrors({}); }}
                                                        minDate={checkIn || toDateStr(new Date())}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ padding: '12px' }}>
                                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Guests</div>
                                        <select 
                                            value={guestsCount} 
                                            onChange={e => setGuestsCount(parseInt(e.target.value))}
                                            style={{ border: 'none', width: '100%', outline: 'none', fontSize: '14px', background: 'none' }}
                                        >
                                            {[...Array(listing.guests)].map((_, i) => (
                                                <option key={i+1} value={i+1}>{i+1} guest{i > 0 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                {Object.keys(errors).length > 0 && (
                                    <div style={{ color: '#FF385C', fontSize: '12px', marginBottom: '12px', fontWeight: 500 }}>
                                        {Object.values(errors)[0]}
                                    </div>
                                )}

                                <button
                                    onClick={handleReserve}
                                    style={{ 
                                        width: '100%', 
                                        height: '56px', 
                                        background: 'var(--bg-deep-green)', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '12px', 
                                        fontSize: '18px', 
                                        fontWeight: 600, 
                                        cursor: 'pointer',
                                        marginBottom: '16px'
                                    }}
                                >
                                    Reserve Now
                                </button>

                                <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
                                    You won't be charged yet
                                </div>

                                {nights > 0 && (
                                    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444' }}>
                                            <span style={{ textDecoration: 'underline' }}>₹{listing.price} x {nights} nights</span>
                                            <span>₹{subtotal}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444' }}>
                                            <span style={{ textDecoration: 'underline' }}>Cleaning fee</span>
                                            <span>₹{listing.cleaningFee}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444' }}>
                                            <span style={{ textDecoration: 'underline' }}>Service fee</span>
                                            <span>₹{listing.serviceFee}</span>
                                        </div>
                                        <hr style={{ border: 'none', borderTop: '1px solid #EEE', margin: '4px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 600, color: '#1B3A2D' }}>
                                            <span>Total</span>
                                            <span>₹{total}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Date Selector Modal if needed */}
                    {showBottomSheet && (
                        <div onClick={() => setShowBottomSheet(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div onClick={e => e.stopPropagation()} style={{ width: '450px', backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                                    <h3 style={{ margin: 0, fontSize: '24px' }}>Select Dates</h3>
                                    <button onClick={() => setShowBottomSheet(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                                </div>
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Check-in</label>
                                        <input type="date" value={checkIn} min={toDateStr(new Date())} onChange={e => {setCheckIn(e.target.value); setErrors({})}} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #DDD', fontSize: '16px' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Checkout</label>
                                        <input type="date" value={checkOut} min={checkIn} onChange={e => {setCheckOut(e.target.value); setErrors({})}} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #DDD', fontSize: '16px' }} />
                                    </div>
                                </div>
                                <button onClick={handleReserve} style={{ width: '100%', height: '60px', backgroundColor: 'var(--bg-deep-green)', color: '#FFFFFF', border: 'none', borderRadius: '16px', fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>Confirm Booking</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // MOBILE VIEW
    return (
        <div style={{ width: '100%', overflowX: 'hidden', backgroundColor: '#fcfcfc', paddingTop: '56px' }}>
            {/* Image Section */}
            <div style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden', borderRadius: '0 0 24px 24px' }}>
                {/* Overlay Navigation/Action Icons */}
                <div style={{ 
                    position: 'absolute', 
                    top: '16px', 
                    left: '0', 
                    right: '0', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0 16px', 
                    zIndex: 3 
                }}>
                    <button 
                        onClick={() => navigate('/rooms')}
                        style={{ 
                            background: '#FFFFFF', 
                            borderRadius: '50%', 
                            width: '40px', 
                            height: '40px', 
                            border: 'none', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)', 
                            cursor: 'pointer' 
                        }}
                    >
                        <ArrowLeft size={20} color="#000000" />
                    </button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            onClick={handleSave}
                            style={{ 
                                background: '#FFFFFF', 
                                borderRadius: '50%', 
                                width: '40px', 
                                height: '40px', 
                                border: 'none', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)', 
                                cursor: 'pointer' 
                            }}
                        >
                            <Heart size={20} fill={isSaved ? "#000000" : "none"} color="#000000" />
                        </button>
                        <button 
                            onClick={handleShare}
                            style={{ 
                                background: '#FFFFFF', 
                                borderRadius: '50%', 
                                width: '40px', 
                                height: '40px', 
                                border: 'none', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)', 
                                cursor: 'pointer' 
                            }}
                        >
                            <Share2 size={20} color="#000000" />
                        </button>
                    </div>
                </div>

                {/* Main Scrollable Image Gallery */}
                <div 
                    ref={galleryRef} 
                    onScroll={handleScroll}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseUp}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    style={{ 
                        display: 'flex', 
                        width: '100%', 
                        height: '100%', 
                        overflowX: 'auto', 
                        scrollSnapType: 'x mandatory', 
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        cursor: 'grab',
                        userSelect: 'none'
                    }}
                >
                    {listing.images.map((img, i) => (
                        <img 
                            key={i} 
                            src={img} 
                            alt={`${listing.title} – Al Baith Rest House, Ernakulam, Kerala`} 
                            draggable={false}
                            style={{ 
                                flex: '0 0 100%', 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                scrollSnapAlign: 'center',
                                display: 'block',
                                pointerEvents: 'none'
                             }} 
                        />
                    ))}
                </div>

                {/* Dot Indicators Overlaid */}
                {listing.images.length > 1 && (
                    <div style={{ 
                        position: 'absolute', 
                        bottom: '32px', 
                        left: '0', 
                        right: '0', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '6px', 
                        zIndex: 2,
                        pointerEvents: 'none'
                    }}>
                        {listing.images.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => scrollToImage(i)}
                                style={{ 
                                    width: i === activeImgIndex ? '20px' : '8px', 
                                    height: '8px', 
                                    borderRadius: '50px', 
                                    backgroundColor: 'rgba(255,255,255,0.9)', 
                                    transition: 'width 0.3s ease',
                                    cursor: 'pointer',
                                    pointerEvents: 'auto'
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* WHITE CONTENT CARD Overlapping Image */}
            <div style={{ 
                marginTop: '-24px', 
                borderRadius: '24px 24px 0 0', 
                backgroundColor: '#FFFFFF', 
                padding: '24px 20px 100px 20px', 
                position: 'relative', 
                zIndex: 4, 
                boxShadow: '0 -4px 10px rgba(0,0,0,0.02)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h1 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 400, 
                        color: '#000000', 
                        margin: 0, 
                        fontFamily: 'var(--font-heading)' 
                    }}>
                        {listing.title}
                    </h1>
                </div>
                
                <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Al Baith Hotel " + listing.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#444444', fontSize: '0.9rem', marginBottom: '16px', textDecoration: 'none' }}
                >
                    <MapPin size={16} />
                    <span style={{ textDecoration: 'underline' }}>{listing.location}</span>
                </a>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={18} fill="#000000" color="#000000" />
                        <strong style={{ color: '#000000', fontSize: '1rem', fontWeight: 500 }}>{listing.rating}</strong>
                        <span style={{ color: '#555555', fontSize: '0.9rem' }}>({listing.reviews} reviews)</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 500, color: '#000000' }}>
                        ₹{listing.price}<span style={{ fontSize: '0.9rem', color: '#555555', fontWeight: 400 }}>/night</span>
                    </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <p style={{ 
                        fontSize: '0.95rem', 
                        lineHeight: '1.6', 
                        color: '#333333', 
                        margin: 0
                    }}>
                        {listing.description}
                    </p>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 400, color: '#000000', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>What We Offer</h2>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '12px'
                    }}>
                        {listing.amenities.map((a, idx) => (
                            <div key={idx} style={{ 
                                backgroundColor: '#FFFFFF', 
                                border: '1px solid #EDEDED', 
                                borderRadius: '16px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '8px',
                                padding: '12px',
                                minHeight: '80px'
                            }}>
                                <div style={{ color: '#000000' }}>
                                    {cloneElement(a.icon, { size: 20, strokeWidth: 1.5 })}
                                </div>
                                <span style={{ fontSize: '0.65rem', color: '#444444', fontWeight: 500, textAlign: 'center', lineHeight: '1.1' }}>{a.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                    <button 
                        onClick={handleReserve}
                        style={{ 
                            width: '100%', 
                            height: '56px', 
                            backgroundColor: 'var(--bg-deep-green)', 
                            color: '#FFFFFF', 
                            border: 'none', 
                            borderRadius: '16px', 
                            fontSize: '1rem', 
                            fontWeight: 400, 
                            cursor: 'pointer' 
                        }}
                    >
                        Book Now
                    </button>
                </div>



                {/* Errors */}
                {Object.keys(errors).length > 0 && (
                    <div style={{ position: 'fixed', bottom: '100px', left: '20px', right: '20px', zIndex: 11 }}>
                        <div style={{ background: '#000000', color: '#FFFFFF', padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}>
                            {Object.values(errors)[0]}
                        </div>
                    </div>
                )}
            </div>

            {/* Date Selection Overlay */}
            {showBottomSheet && (
                <div 
                    onClick={() => setShowBottomSheet(false)}
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}
                >
                    <div 
                        onClick={e => e.stopPropagation()}
                        style={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: '24px 24px 0 0', padding: '24px', position: 'relative', boxShadow: '0 -10px 25px rgba(0,0,0,0.1)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>
                                {(!activePicker || activePicker === 'in') ? 'Select Check-in' : 'Select Checkout'}
                            </h3>
                            <button onClick={() => setShowBottomSheet(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        {/* CLEAR DATE DISPLAY SUMMARY */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <div 
                                onClick={() => setActivePicker('in')}
                                style={{ 
                                    flex: 1, 
                                    padding: '12px', 
                                    borderRadius: '12px', 
                                    border: (!activePicker || activePicker === 'in') ? '2.5px solid var(--bg-deep-green)' : '1px solid #EEE', 
                                    backgroundColor: '#F9F9F9',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '4px' }}>Check-in</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: checkIn ? '#000' : '#AAA' }}>
                                    {formatDisplayDate(checkIn) || 'Tap to select'}
                                </div>
                            </div>
                            <div 
                                onClick={() => checkIn && setActivePicker('out')}
                                style={{ 
                                    flex: 1, 
                                    padding: '12px', 
                                    borderRadius: '12px', 
                                    border: (activePicker === 'out') ? '2.5px solid var(--bg-deep-green)' : '1px solid #EEE', 
                                    backgroundColor: '#F9F9F9',
                                    cursor: checkIn ? 'pointer' : 'default',
                                    opacity: checkIn ? 1 : 0.6
                                }}
                            >
                                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, marginBottom: '4px' }}>Checkout</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: checkOut ? '#000' : '#AAA' }}>
                                    {formatDisplayDate(checkOut) || 'Tap to select'}
                                </div>
                            </div>
                        </div>

                        {(!activePicker || activePicker === 'in') ? (
                            <>
                                <BookingCalendar
                                    selectedDate={checkIn}
                                    onSelect={(date) => { setCheckIn(date); setActivePicker('out'); setErrors({}); }}
                                    minDate={toDateStr(new Date())}
                                />
                                <button 
                                    onClick={() => setActivePicker('out')}
                                    disabled={!checkIn}
                                    style={{ 
                                        width: '100%', 
                                        height: '52px', 
                                        backgroundColor: checkIn ? 'var(--bg-deep-green)' : '#D0D0D0', 
                                        color: '#FFFFFF', 
                                        border: 'none', 
                                        borderRadius: '12px', 
                                        fontWeight: 600, 
                                        marginTop: '20px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Select Checkout Date
                                </button>
                            </>
                        ) : (
                            <>
                                <BookingCalendar
                                    selectedDate={checkOut}
                                    onSelect={(date) => { setCheckOut(date); setErrors({}); }}
                                    minDate={checkIn || toDateStr(new Date())}
                                />
                                <button 
                                    onClick={handleReserve}
                                    disabled={!checkIn || !checkOut}
                                    style={{ 
                                        width: '100%', 
                                        height: '52px', 
                                        backgroundColor: (checkIn && checkOut) ? '#000000' : '#D0D0D0', 
                                        color: '#FFFFFF', 
                                        border: 'none', 
                                        borderRadius: '12px', 
                                        fontWeight: 700, 
                                        marginTop: '20px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Confirm Dates
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}