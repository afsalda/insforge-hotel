import { useNavigate } from 'react-router-dom';

const APARTMENT_DATA = {
    '1bhk': { id: 'apartments_1bhk', name: '1BHK Apartment', price: '₹3,500 / night', maxGuests: 3, desc: 'Cozy fully furnished 1BHK apartment with complete kitchen and living room.', amenities: ['WiFi', 'Kitchen', 'Living Room', 'AC', 'Parking'], extraBedAvailable: false, img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' },
    '2bhk': { id: 'apartments_2bhk', name: '2BHK Apartment', price: '₹5,500 / night', maxGuests: 5, desc: 'Spacious 2BHK apartment ideal for families, featuring modern furnishings and great views.', amenities: ['WiFi', 'Kitchen', 'Living Room', 'AC', 'Parking', '2 Baths'], extraBedAvailable: true, img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80' },
    '3bhk': { id: 'apartments_3bhk', name: '3BHK Apartment', price: '₹8,500 / night', maxGuests: 8, desc: 'Luxury 3BHK penthouse style apartment for large groups with premium amenities.', amenities: ['WiFi', 'Kitchen', 'Living Room', 'AC', 'Parking', '3 Baths', 'Balcony'], extraBedAvailable: true, img: 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=600&q=80' }
};

export default function ApartmentsPage() {
    const navigate = useNavigate();

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-off-white)', paddingBottom: '60px' }}>
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
