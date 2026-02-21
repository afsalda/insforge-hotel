import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Star, Share2, Heart, Award, KeyRound, Wifi,
    Car, Snowflake, CookingPot, Tv, WashingMachine, Waves,
    Trees, ChevronRight, CheckCircle, Loader2, X
} from 'lucide-react';
import { createBooking } from '../lib/api.js';
import BookingCalendar from '../components/BookingCalendar';

export const LISTING_DATA = {
    'standard_room': {
        title: 'Standard Room',
        location: 'Al Baith Hotel',
        rating: 4.85, reviews: 142,
        host: { name: 'Al Baith', years: 10, image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=150&q=80', superhost: true },
        images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
            'https://images.unsplash.com/photo-1584132967334-10e028b1db15?w=800&q=80',
            'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80'
        ],
        guests: 2, bedrooms: 1, beds: 1, baths: 1,
        description: 'A cozy and comfortable room with all essential amenities for a relaxing stay. Perfect for solo travelers or couples.',
        amenities: [
            { label: 'WiFi', icon: <Wifi size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Smart TV', icon: <Tv size={24} /> },
            { label: 'Power Backup', icon: <KeyRound size={24} /> }
        ],
        price: 1500, cleaningFee: 200, serviceFee: 150
    },
    'deluxe_room': {
        title: 'Deluxe Room',
        location: 'Upper Levels, Al Baith Hotel',
        rating: 4.95, reviews: 312,
        host: { name: 'Al Baith', years: 10, image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=150&q=80', superhost: true },
        images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80',
            'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'
        ],
        guests: 3, bedrooms: 1, beds: 2, baths: 1,
        description: 'A spacious king bed retreat with premium furnishings, city views, and optional extra bed available for small families.',
        amenities: [
            { label: 'WiFi', icon: <Wifi size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Smart TV', icon: <Tv size={24} /> },
            { label: 'City View', icon: <Tv size={24} /> },
            { label: 'Extra Bed (Free)', icon: <Trees size={24} /> }
        ],
        price: 1800, cleaningFee: 250, serviceFee: 200
    },
    'suite_room': {
        title: 'Suite Room',
        location: 'Penthouse Level, Al Baith Hotel',
        rating: 5.0, reviews: 89,
        host: { name: 'Al Baith', years: 10, image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=150&q=80', superhost: true },
        images: [
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80',
            'https://images.unsplash.com/photo-1561501878-aabd62634533?w=800&q=80',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800&q=80'
        ],
        guests: 4, bedrooms: 2, beds: 2, baths: 2,
        description: 'Luxury suite with separate lounge, mini kitchen, jacuzzi, and panoramic skyline views. 550 sq ft of pure elegance.',
        amenities: [
            { label: 'WiFi', icon: <Wifi size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Smart TV', icon: <Tv size={24} /> },
            { label: 'Heater', icon: <Snowflake size={24} /> },
            { label: 'Power Backup', icon: <KeyRound size={24} /> },
            { label: 'Lift', icon: <ArrowLeft size={24} /> },
            { label: 'Mini Kitchen', icon: <CookingPot size={24} /> },
            { label: 'Mini Fridge', icon: <Snowflake size={24} /> },
            { label: 'Jacuzzi', icon: <Waves size={24} /> },
            { label: 'Panoramic View', icon: <Trees size={24} /> }
        ],
        price: 5000, cleaningFee: 350, serviceFee: 400
    },
    'executive_room': {
        title: 'Executive Room',
        location: 'Business Wing, Al Baith Hotel',
        rating: 4.92, reviews: 156,
        host: { name: 'Al Baith', years: 10, image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=150&q=80', superhost: true },
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
            { label: 'Work Desk', icon: <Tv size={24} /> },
            { label: 'Balcony', icon: <Trees size={24} /> }
        ],
        price: 2500, cleaningFee: 250, serviceFee: 200
    },
    'apartments_1bhk': {
        title: '1BHK Apartment',
        location: 'Residential Wing, Al Baith',
        rating: 4.88, reviews: 54,
        host: { name: 'Al Baith', years: 10, image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=150&q=80', superhost: true },
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80'
        ],
        guests: 3, bedrooms: 1, beds: 1, baths: 1,
        description: 'Cozy fully furnished 1BHK apartment with a complete kitchen, living room, and high-speed Wi-Fi. Ideal for extended stays.',
        amenities: [
            { label: 'WiFi', icon: <Wifi size={24} /> },
            { label: 'Air conditioning', icon: <Snowflake size={24} /> },
            { label: 'Full Kitchen', icon: <CookingPot size={24} /> },
            { label: 'Living Room', icon: <Tv size={24} /> },
            { label: 'Free Parking', icon: <Car size={24} /> }
        ],
        price: 3500, cleaningFee: 200, serviceFee: 250
    },
    'apartments_2bhk': {
        title: '2BHK Family Apartment',
        location: 'Residential Wing, Al Baith',
        rating: 4.90, reviews: 92,
        host: { name: 'Al Baith', years: 10, image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=150&q=80', superhost: true },
        images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800&q=80',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80'
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
    'apartments_3bhk': {
        title: '3BHK Penthouse Apartment',
        location: 'Penthouse Residential, Al Baith',
        rating: 4.96, reviews: 120,
        host: { name: 'Al Baith', years: 10, image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=150&q=80', superhost: true },
        images: [
            'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
            'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'
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

    // Default dates: tomorrow + 5 days
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fiveDaysLater = new Date(tomorrow);
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

    const [checkIn, setCheckIn] = useState(toDateStr(tomorrow));
    const [checkOut, setCheckOut] = useState(toDateStr(fiveDaysLater));
    const [guestsCount, setGuestsCount] = useState(1);
    const [activePicker, setActivePicker] = useState(null); // 'in', 'out', or null
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return null;
        const [y, m, d] = dateStr.split('-');
        return `${m}/${d}/${y}`;
    };

    useEffect(() => {
        console.log('ListingDetailPage mounted for ID:', id);
    }, [id]);

    const nights = calcNights(checkIn, checkOut);
    const subtotal = listing.price * nights;
    const total = subtotal + listing.cleaningFee + listing.serviceFee;

    const handleReserve = () => {
        console.log('Reserve clicked', { checkIn, checkOut, nights, total });
        if (nights < 1) {
            alert('Please select valid check-in and check-out dates.');
            return;
        }
        try {
            navigate(`/checkout/${id}`, {
                state: { checkIn, checkOut, guestsCount, nights, total, subtotal }
            });
        } catch (err) {
            console.error('Navigation failed:', err);
            alert('Navigation failed: ' + err.message);
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
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
                // Fallback to clipboard if share fails
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                } catch (copyErr) {
                    console.error('Clipboard copy failed:', copyErr);
                }
            }
        }
    };

    const [isSaved, setIsSaved] = useState(false);
    const handleSave = () => {
        setIsSaved(!isSaved);
        // In a real app, you would sync this with a backend or local storage
    };

    return (
        <>
            <div className="detail-page">
                <button className="detail-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Back
                </button>

                <h1 className="detail-title">{listing.title}</h1>
                <div className="detail-meta">
                    <div className="detail-meta-left">
                        <Star size={14} fill="#FF385C" stroke="#FF385C" className="rating-star" />
                        <strong>{listing.rating}</strong>
                        <span>·</span>
                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>{listing.reviews} reviews</span>
                        <span>·</span>
                        <span>{listing.location}</span>
                    </div>
                    <div className="detail-actions">
                        <button className="detail-action-btn" onClick={handleShare}>
                            <Share2 size={16} /> Share
                        </button>
                        <button
                            className={`detail-action-btn ${isSaved ? 'saved' : ''}`}
                            onClick={handleSave}
                        >
                            <Heart size={16} fill={isSaved ? '#FF385C' : 'transparent'} color={isSaved ? '#FF385C' : 'currentColor'} />
                            {isSaved ? 'Saved' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="detail-gallery">
                    <div className="main-img">
                        <img src={listing.images[0]} alt={listing.title} />
                    </div>
                    {listing.images.slice(1, 5).map((img, i) => (
                        <img key={i} src={img} alt={`${listing.title} ${i + 2}`} />
                    ))}
                </div>

                {/* Body */}
                <div className="detail-body">
                    {/* Left column */}
                    <div className="detail-info">
                        <div className="host-row">
                            <div className="host-text">
                                <h2>Entire home hosted by {listing.host.name}</h2>
                                <p>{listing.guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.baths} baths</p>
                            </div>
                            <img src={listing.host.image} alt={listing.host.name} className="host-avatar" />
                        </div>

                        <div className="highlight-list">
                            {listing.host.superhost && (
                                <div className="highlight-item">
                                    <div className="highlight-icon"><Award size={28} /></div>
                                    <div>
                                        <h4>{listing.host.name} is a Superhost</h4>
                                        <p>Superhosts are experienced, highly rated hosts committed to providing great stays.</p>
                                    </div>
                                </div>
                            )}
                            <div className="highlight-item">
                                <div className="highlight-icon"><KeyRound size={28} /></div>
                                <div>
                                    <h4>Great check-in experience</h4>
                                    <p>95% of recent guests gave the check-in process a 5-star rating.</p>
                                </div>
                            </div>
                        </div>

                        <div className="desc-section">
                            <p>{listing.description}</p>
                            <button className="show-more-btn">Show more <ChevronRight size={16} /></button>
                        </div>

                        <div className="amenities-section">
                            <h3>What this place offers</h3>
                            <div className="amenities-grid">
                                {listing.amenities.slice(0, 6).map((a, idx) => (
                                    <div className="amenity-row" key={idx}>
                                        {a.icon}
                                        <span>{a.label}</span>
                                    </div>
                                ))}
                            </div>
                            {listing.amenities.length > 6 && (
                                <button className="show-amenities-btn" onClick={() => setShowAllAmenities(true)}>
                                    Show all {listing.amenities.length} amenities
                                </button>
                            )}
                        </div>

                        {/* Amenities Modal */}
                        {showAllAmenities && (
                            <div className="amenities-modal-overlay" onClick={() => setShowAllAmenities(false)}>
                                <div className="amenities-modal-container" onClick={e => e.stopPropagation()}>
                                    <div className="amenities-modal-header">
                                        <button className="modal-close-btn" onClick={() => setShowAllAmenities(false)}>
                                            <X size={24} />
                                        </button>
                                        <h2>What this place offers</h2>
                                    </div>
                                    <div className="amenities-modal-list">
                                        {listing.amenities.map((a, idx) => (
                                            <div className="amenity-modal-item" key={idx}>
                                                <div className="amenity-icon">{a.icon}</div>
                                                <div className="amenity-info">
                                                    <span className="amenity-label">{a.label}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Sidebar */}
                    <div>
                        <div className="booking-card">
                            <div className="booking-price-row">
                                <div className="booking-price">₹{listing.price} <span>night</span></div>
                                <div className="booking-rating">
                                    <Star size={12} fill="black" /> {listing.rating} · {listing.reviews} reviews
                                </div>
                            </div>

                            <div className="booking-fields">
                                <div className="booking-dates">
                                    <div
                                        className={`booking-field ${activePicker === 'in' ? 'active' : ''}`}
                                        onClick={() => setActivePicker(activePicker === 'in' ? null : 'in')}
                                        style={{ cursor: 'pointer', position: 'relative' }}
                                    >
                                        <label>CHECK-IN</label>
                                        <div className={`date-display ${!checkIn ? 'placeholder' : ''}`}>
                                            {formatDisplayDate(checkIn) || 'Add date'}
                                        </div>
                                        {activePicker === 'in' && (
                                            <div className="calendar-popover" onClick={e => e.stopPropagation()}>
                                                <BookingCalendar
                                                    selectedDate={checkIn}
                                                    onSelect={(date) => {
                                                        setCheckIn(date);
                                                        setActivePicker('out');
                                                    }}
                                                    minDate={toDateStr(new Date())}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className={`booking-field ${activePicker === 'out' ? 'active' : ''}`}
                                        onClick={() => setActivePicker(activePicker === 'out' ? null : 'out')}
                                        style={{ cursor: 'pointer', position: 'relative' }}
                                    >
                                        <label>CHECKOUT</label>
                                        <div className={`date-display ${!checkOut ? 'placeholder' : ''}`}>
                                            {formatDisplayDate(checkOut) || 'Add date'}
                                        </div>
                                        {activePicker === 'out' && (
                                            <div className="calendar-popover align-right" onClick={e => e.stopPropagation()}>
                                                <BookingCalendar
                                                    selectedDate={checkOut}
                                                    onSelect={(date) => {
                                                        setCheckOut(date);
                                                        setActivePicker(null);
                                                    }}
                                                    minDate={checkIn}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="booking-field">
                                    <label>GUESTS</label>
                                    <select
                                        value={guestsCount}
                                        onChange={e => setGuestsCount(Number(e.target.value))}
                                    >
                                        {Array.from({ length: listing.guests }, (_, i) => i + 1).map(n => (
                                            <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button className="reserve-btn" onClick={handleReserve}>Reserve</button>
                            <div className="no-charge">You won't be charged yet</div>

                            {nights > 0 && (
                                <div className="price-breakdown">
                                    <div className="price-row underline">
                                        <span>₹{listing.price} x {nights} nights</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    <div className="price-row underline">
                                        <span>Cleaning fee</span>
                                        <span>₹{listing.cleaningFee}</span>
                                    </div>
                                    <div className="price-row underline">
                                        <span>Al Baith service fee</span>
                                        <span>₹{listing.serviceFee}</span>
                                    </div>
                                    <div className="price-total">
                                        <span>Total before taxes</span>
                                        <span>₹{total}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile bottom bar */}
            <div className="detail-bottom-bar">
                <div className="detail-bottom-price">
                    <strong>₹{listing.price}</strong> <span>night</span>
                </div>
                <button className="detail-bottom-reserve" onClick={handleReserve}>Reserve</button>
            </div>


        </>
    );
}
