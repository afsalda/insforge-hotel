import React from 'react';

export const ReviewAutoSlider = () => {
    const reviews = [
        {
            name: "Priya Menon",
            rating: 5,
            text: "Absolutely stunning stay! The suite room exceeded all our expectations. The jacuzzi with city views was pure magic.",
            location: "Bangalore, India"
        },
        {
            name: "Ahmed Al-Rashid",
            rating: 5,
            text: "Al Baith reminds me of the finest Arabian hospitality. The attention to detail and elegant décor made this a memorable experience.",
            location: "Dubai, UAE"
        },
        {
            name: "Sarah Johnson",
            rating: 5,
            text: "We booked the 2BHK apartment for a family vacation. Spacious, clean, and beautifully furnished. Best value for money in Kochi.",
            location: "London, UK"
        },
        {
            name: "Arun Menon",
            rating: 5,
            text: "Absolutely wonderful stay. The rooms were spotless and the staff were incredibly welcoming.",
            location: "Kerala, India"
        },
        {
            name: "James Carter",
            rating: 4,
            text: "Great location, beautiful property, and excellent service. Will definitely return.",
            location: "UK"
        },
        {
            name: "Fatima Al-Hassan",
            rating: 5,
            text: "The attention to detail and warmth of the staff made our trip truly special.",
            location: "Dubai"
        },
        {
            name: "Sneha Krishnan",
            rating: 5,
            text: "A hidden gem. Peaceful, elegant, and everything we needed for a perfect getaway.",
            location: "Chennai"
        },
        {
            name: "Mohammed Rizwan",
            rating: 4,
            text: "Superb amenities, clean rooms, and responsive staff. Highly recommended.",
            location: "Kochi"
        }
    ];

    const duplicatedReviews = [...reviews, ...reviews];

    return (
        <>
            <style>{`
        @keyframes scroll-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .infinite-scroll { animation: scroll-right 30s linear infinite; }
        .infinite-scroll:hover { animation-play-state: paused; }
        .scroll-container {
          mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
          width: 100%;
          overflow: hidden;
        }
        .review-card { 
            transition: all 0.3s ease;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
        .review-card:hover { transform: translateY(-5px) scale(1.03); }
      `}</style>
            <section className="w-full py-16 overflow-hidden">
                <div className="scroll-container w-full">
                    <div className="infinite-scroll flex gap-6 w-max px-4 py-8">

                        {duplicatedReviews.map((review, index) => (
                            <div key={index} className="review-card flex-shrink-0 w-72 bg-white/90 border border-gray-100 rounded-2xl shadow-md p-6 flex flex-col gap-3">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed italic">"{review.text}"</p>
                                <div className="mt-auto">
                                    <p className="text-gray-900 font-semibold text-sm">{review.name}</p>
                                    <p className="text-gray-500 text-xs">{review.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
