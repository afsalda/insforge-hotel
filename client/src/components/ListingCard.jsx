import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';

export default function ListingCard({ listing }) {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);

    return (
        <div className="listing-card fade-in-up" onClick={() => navigate(`/listing/${listing.id}`)}>
            <div className="card-image-wrapper">
                <img
                    src={listing.image}
                    alt={listing.title}
                    loading="lazy"
                />
                <button
                    className="favorite-btn"
                    onClick={e => { e.stopPropagation(); setLiked(!liked); }}
                    aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart
                        size={24}
                        fill={liked ? '#FF385C' : 'rgba(0,0,0,0.5)'}
                        color={liked ? '#FF385C' : 'white'}
                        strokeWidth={liked ? 0 : 2}
                    />
                </button>
                <div className="card-dots">
                    <span className="card-dot active"></span>
                    <span className="card-dot"></span>
                    <span className="card-dot"></span>
                </div>
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
