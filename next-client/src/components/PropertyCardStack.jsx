'use client';

import { Bookmark, MapPin, Wifi, Lamp, Coffee, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyCardStack = ({ room, onClick }) => {
  const title = room?.name || room?.title || "Standard Room";
  const location = "Kerala, India";
  const imageUrl = room?.photos?.[0] || room?.img || "/images/webp/rooms/standard_1.webp";
  const basePrice = room?.pricing_per_night || (room?.price?.replace?.(/\D/g, "")) || 1500;
  const price = Math.round(Number(basePrice) * 1.13);
  const rating = room?.rating || "4.9";
  const reviews = room?.reviews_count || room?.reviews || "6.8K";
  const guests = room?.details_max_guests || room?.maxGuests || 2;

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full font-sans">
      {/* Card Stack Container */}
      <div className="relative w-full h-[510px] flex items-center justify-center">
        {/* Main Card */}
        <motion.div
          className="relative z-20 w-[91%] md:w-[90%] h-[470px] bg-white rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-50 overflow-hidden flex flex-col cursor-pointer group"
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
          onClick={onClick}
        >
          {/* Top Half: Image Container */}
          <div className="relative h-[48%] w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={`${title} – Al Baith Rest House, Ernakulam, Kerala`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Half: Content Section */}
          <div className="p-3.5 flex flex-col items-start text-left flex-1">
            {/* Title */}
            <h3 className="text-[1.2rem] font-serif text-gray-900 mb-0.5 leading-tight">{title}</h3>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Al Baith Hotel " + location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-400 mb-2 hover:text-[#C9A96E] transition-colors cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="text-[0.75rem] font-medium underline underline-offset-2">{location}</span>
            </a>

            {/* Amenities Icons */}
            <div className="flex items-center gap-3.5 mb-3">
              <Wifi className="w-4.5 h-4.5 text-[#C9A96E] stroke-[1.2]" />
              <Lamp className="w-4.5 h-4.5 text-[#C9A96E] stroke-[1.2]" />
              <Coffee className="w-4.5 h-4.5 text-[#C9A96E] stroke-[1.2]" />
              <ShieldCheck className="w-4.5 h-4.5 text-[#C9A96E] stroke-[1.2]" />
            </div>

            {/* Capacity Text */}
            <div className="text-[0.75rem] text-gray-400 mb-1.5 font-medium">
              Capacity: Up to {guests} Guests
            </div>

            {/* Pricing Row */}
            <div className="flex items-center justify-between w-full mb-3">
              <div className="text-gray-900">
                <span className="text-[1.15rem] font-bold">₹{Number(price).toLocaleString()}</span>
                <span className="text-[0.8rem] font-medium text-gray-800">/night</span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                <Star className="w-3.5 h-3.5 fill-gray-900" />
                <span className="text-[0.9rem]">{rating}</span>
                <span className="text-gray-400 font-medium text-[0.7rem]">({reviews})</span>
              </div>
            </div>

            {/* VIEW ROOM Button */}
            <button className="btn-view-room">
              VIEW ROOM <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyCardStack;
