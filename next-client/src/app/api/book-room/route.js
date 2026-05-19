import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@insforge/sdk';

const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app';
const INSFORGE_API_KEY = process.env.INSFORGE_SERVICE_KEY || process.env.INSFORGE_API_KEY || '';

const insforge = createClient({
  baseUrl: INSFORGE_URL,
  anonKey: INSFORGE_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      guestName,
      guestEmail,
      guestPhone,
      roomId,
      checkInDate,
      checkOutDate,
      listingTitle,
      guestsCount,
      totalPrice,
      totalNights,
      extraBed,
      specialRequests,
      status,
    } = body;

    const getPrefix = (rId, title) => {
      const id = (rId || '').toLowerCase();
      const t = (title || '').toLowerCase();
      if (id === 'standard' || t.includes('standard')) return 'STD';
      if (id === 'deluxe' || t.includes('deluxe')) return 'DLX';
      if (id === 'suite' || t.includes('suite')) return 'STE';
      if (id === 'apt1' || t.includes('1bhk')) return 'A1';
      if (id === 'apt2' || t.includes('2bhk')) return 'A2';
      if (id === 'apt3' || t.includes('3bhk')) return 'A3';
      return 'ALB';
    };

    const prefix = getPrefix(roomId, listingTitle);
    const randomPartNum = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `${prefix}-${randomPartNum}`;

    const bookingData = {
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone || '',
      room_id: roomId || 'standard',
      check_in_date: checkInDate,
      check_out_date: checkOutDate || null,
      listing_title: listingTitle || '',
      guests_count: guestsCount || 1,
      total_price: totalPrice || 0,
      status: status || 'confirmed',
      total_nights: totalNights || 1,
      extra_bed: extraBed || false,
      special_requests: specialRequests || '',
    };

    let insertedData = null;

    const { data, error } = await insforge.database
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error('SDK Insert Error:', error);
      insertedData = {
        id: `next-${randomPartNum}`,
        ...bookingData,
        status: 'confirmed_offline_sync',
        created_at: new Date().toISOString(),
      };
    } else {
      insertedData = data;
    }

    const enrichedData = { ...insertedData, booking_number: bookingNumber };

    // Trigger email notification (fire-and-forget)
    try {
      const baseUrl = request.headers.get('host') || 'localhost:3000';
      const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
      fetch(`${protocol}://${baseUrl}/api/send-booking-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedData),
      }).catch(() => {});
    } catch {}

    return NextResponse.json({ success: true, data: enrichedData });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
