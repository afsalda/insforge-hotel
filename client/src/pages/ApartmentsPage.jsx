import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PropertyCardStack from '../components/PropertyCardStack';

const APARTMENT_DATA = {
    '1bhk': { id: 'apt1', name: '1BHK Apartment', pricing_per_night: 2500, maxGuests: 3, desc: 'Cozy fully furnished 1BHK apartment with complete kitchen and living room.', amenities: ['WiFi', 'Kitchen', 'Electric Kettle', 'Living Room', 'AC', 'Parking'], extraBedAvailable: false, img: '/images/webp/rooms/apartments/3.jpg.webp' },
    '2bhk': { id: 'apt2', name: '2BHK Apartment', pricing_per_night: 4000, maxGuests: 5, desc: 'Spacious 2BHK apartment ideal for families, featuring modern furnishings and great views.', amenities: ['WiFi', 'Kitchen', 'Electric Kettle', 'Living Room', 'AC', 'Parking', '2 Baths'], extraBedAvailable: true, img: '/images/webp/rooms/apartments/5.jpg.webp' },
    '3bhk': { id: 'apt3', name: '3BHK Apartment', pricing_per_night: 5000, maxGuests: 8, desc: 'Luxury 3BHK penthouse style apartment for large groups with premium amenities.', amenities: ['WiFi', 'Kitchen', 'Electric Kettle', 'Living Room', 'AC', 'Parking', '3 Baths', 'Balcony'], extraBedAvailable: true, img: '/images/webp/rooms/apartments/14.jpg.webp' }
};

export default function ApartmentsPage() {
    const navigate = useNavigate();

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-off-white)', paddingBottom: '60px' }}>
            {/* Back Button Container (Static) */}
            <div className="px-4 md:px-6 mx-auto max-w-[1200px]">
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

            <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
                <div className="rooms-all-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 w-full">
                    {Object.values(APARTMENT_DATA).map(apt => (
                        <div key={apt.id}>
                            <PropertyCardStack 
                                room={apt} 
                                onClick={() => navigate(`/rooms/${apt.id}`)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
