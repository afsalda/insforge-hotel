import ListingDetailClient from './ListingDetailClient';

// Re-import LISTING_DATA from the client component for metadata generation
const LISTING_DATA_META = {
  'standard': { title: 'Standard Room', description: 'A cozy and comfortable room with all essential amenities for a relaxing stay at Al Baith Rest House, Ernakulam.', image: '/images/webp/rooms/standard_1.webp' },
  'deluxe': { title: 'Deluxe Room', description: 'A spacious king bed retreat with premium furnishings and city views at Al Baith Rest House, Ernakulam.', image: '/images/webp/rooms/deluxe_1.webp' },
  'suite': { title: 'Suite Room', description: 'Luxury suite with jacuzzi and panoramic skyline views at Al Baith Rest House, Ernakulam.', image: '/images/webp/rooms/suite_1.webp' },
  'executive': { title: 'Executive Room', description: 'Sophisticated workspace and luxury bedding for the modern professional at Al Baith Rest House.', image: '/images/webp/rooms/deluxe_1.webp' },
};

export async function generateMetadata({ params }) {
  const roomId = params.roomId;
  const meta = LISTING_DATA_META[roomId];

  if (meta) {
    return {
      title: `${meta.title} — Book Now`,
      description: meta.description,
      openGraph: {
        title: `${meta.title} | Al Baith Rest House`,
        description: meta.description,
        images: [meta.image],
      },
    };
  }

  return {
    title: 'Room Details — Al Baith Rest House',
    description: 'View room details and book your stay at Al Baith Rest House, Ernakulam, Kerala.',
  };
}

export default function RoomDetailPage({ params }) {
  return <ListingDetailClient roomId={params.roomId} />;
}
