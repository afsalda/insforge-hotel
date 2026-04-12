import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';

export default function ListingCard({ listing }) {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);

    return (
        <div className="listing-card fade-in-up" onClick={() => navigate(`/rooms/${listing.id}`)}>
            <div className="card-image-wrapper">
                <img
                    src={listing.image}
                    alt={`${listing.title} – Al Baith Rest House, Ernakulam, Kerala`}
                    loading="lazy"
                />
            </div>
            <div className="card-info">
                <div className="card-header">
                    <span className="card-location">{listing.location}</span>
                    <span className="card-rating">
                        <Star size={14} fill="black" stroke="black" /> {listing.rating}
                    </span>
                </div>
                <div className="card-distance">{listing.distance}</div>
                <div className="card-dates">{listing.dates}</div>
                <div className="card-price">
                    <strong>₹{listing.price}</strong> night
                </div>
            </div>
        </div>
    );
}
