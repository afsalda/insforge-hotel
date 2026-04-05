import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const APARTMENT_DATA = {
    '1bhk': { id: 'apt1', name: '1BHK Apartment', price: '₹5,000 / night', maxGuests: 3, desc: 'Cozy fully furnished 1BHK apartment with complete kitchen and living room.', amenities: ['WiFi', 'Kitchen', 'Living Room', 'AC', 'Parking'], extraBedAvailable: false, img: '/images/rooms/apartments/3.jpg.jpeg' },
    '2bhk': { id: 'apt2', name: '2BHK Apartment', price: '₹5,500 / night', maxGuests: 5, desc: 'Spacious 2BHK apartment ideal for families, featuring modern furnishings and great views.', amenities: ['WiFi', 'Kitchen', 'Living Room', 'AC', 'Parking', '2 Baths'], extraBedAvailable: true, img: '/images/rooms/apartments/5.jpg.jpeg' },
    '3bhk': { id: 'apt3', name: '3BHK Apartment', price: '₹8,500 / night', maxGuests: 8, desc: 'Luxury 3BHK penthouse style apartment for large groups with premium amenities.', amenities: ['WiFi', 'Kitchen', 'Living Room', 'AC', 'Parking', '3 Baths', 'Balcony'], extraBedAvailable: true, img: '/images/rooms/apartments/14.jpg.jpeg' }
};

export default function ApartmentsPage() {
    const navigate = useNavigate();

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-off-white)', paddingBottom: '60px', position: 'relative' }}>
            <button 
                onClick={() => navigate('/')} 
                className="checkout-back-btn" 
                style={{ position: 'absolute', top: '110px', left: '5%', background: 'white', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer', zIndex: 10 }}
            >
                <ChevronLeft size={24} />
            </button>
            <div className="section-header">
                <h2 className="section-title">Apartments</h2>
                <p className="section-subtitle">Extended stay private apartments.</p>
            </div>

            <div className="rooms-grid" style={{ padding: '0 5%' }}>
                {Object.values(APARTMENT_DATA).map(apt => (
                    <div className="room-card" key={apt.id}>
                        <div className="room-card-image-wrapper">
                            <img src={apt.img} alt={apt.name} />
                        </div>
                        <div className="room-card-info">
                            <h3>{apt.name}</h3>
                            <p className="room-price">{apt.price}</p>
                            <p>{apt.desc}</p>
                            <div className="room-amenities">
                                {apt.amenities.slice(0, 3).map(a => <span key={a}>{a}</span>)}
                            </div>
                            <button className="btn-view-room" onClick={() => navigate(`/room/${apt.id}`)}>Book This Apartment</button>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
}
