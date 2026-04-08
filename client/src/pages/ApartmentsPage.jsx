import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const APARTMENT_DATA = {
    '1bhk': { id: 'apt1', name: '1BHK Apartment', price: '₹5,000 / night', maxGuests: 3, desc: 'Cozy fully furnished 1BHK apartment with complete kitchen and living room.', amenities: ['WiFi', 'Kitchen', 'Electric Kettle', 'Living Room', 'AC', 'Parking'], extraBedAvailable: false, img: '/images/rooms/apartments/3.jpg.jpeg' },
    '2bhk': { id: 'apt2', name: '2BHK Apartment', price: '₹5,500 / night', maxGuests: 5, desc: 'Spacious 2BHK apartment ideal for families, featuring modern furnishings and great views.', amenities: ['WiFi', 'Kitchen', 'Electric Kettle', 'Living Room', 'AC', 'Parking', '2 Baths'], extraBedAvailable: true, img: '/images/rooms/apartments/5.jpg.jpeg' },
    '3bhk': { id: 'apt3', name: '3BHK Apartment', price: '₹8,500 / night', maxGuests: 8, desc: 'Luxury 3BHK penthouse style apartment for large groups with premium amenities.', amenities: ['WiFi', 'Kitchen', 'Electric Kettle', 'Living Room', 'AC', 'Parking', '3 Baths', 'Balcony'], extraBedAvailable: true, img: '/images/rooms/apartments/14.jpg.jpeg' }
};

export default function ApartmentsPage() {
    const navigate = useNavigate();

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-off-white)', paddingBottom: '60px' }}>
            {/* Back Button Container (Static) */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <button 
                    onClick={() => navigate('/')} 
                    className="checkout-back-btn" 
                    style={{ position: 'static', marginBottom: '20px' }}
                >
                    <ChevronLeft size={24} color="var(--accent-gold)" />
                </button>
            </div>

            <div className="section-header">
                <h2 className="section-title">Apartments</h2>
                <p className="section-subtitle">Extended stay private apartments.</p>
            </div>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <div className="rooms-all-grid">
                    {Object.values(APARTMENT_DATA).map(apt => (
                        <div className="room-card-v2" key={apt.id}>
                            <div className="room-card-image">
                                <img src={apt.img} alt={apt.name} />
                                <div className="room-card-price-tag">{apt.price}</div>
                            </div>
                            <div className="room-card-info-v2">
                                <h3>{apt.name}</h3>
                                <p>{apt.desc}</p>
                                <div className="feature-chips-container" style={{ marginBottom: '16px' }}>
                                    {apt.amenities.slice(0, 4).map(a => (
                                        <div key={a} className="feature-chip" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                                            <span>{a}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="room-card-actions">
                                    <button className="btn-rooms-primary" onClick={() => navigate(`/room/${apt.id}`)}>
                                        BOOK NOW
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}
