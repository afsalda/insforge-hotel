/**
 * InsForge client for Next.js frontend — direct database access.
 * Uses NEXT_PUBLIC_ environment variables.
 */
import { createClient } from '@insforge/sdk';

const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app';
const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

export const insforge = createClient({
  baseUrl: INSFORGE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

export const db = insforge.database;

// ─── Bookings API ───

export async function getAllBookings() {
  try {
    const { data, error } = await db
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('[Bookings] SDK call failed:', err.message);
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('offline_bookings') || '[]');
    }
    return [];
  }
}

export async function createBooking(bookingData) {
  // Use API route handler (has service key for write permissions)
  const res = await fetch(`/api/book-room`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  const text = await res.text();
  if (!text) throw new Error('Empty response from server');

  const json = JSON.parse(text);
  if (!json.success) throw new Error(json.error || 'Booking failed');
  return json.data;
}

export async function updateBooking(id, updates) {
  const updateObj = { ...updates };
  if (updates.guestName) updateObj.guest_name = updates.guestName;
  if (updates.guestEmail) updateObj.guest_email = updates.guestEmail;
  if (updates.guestPhone) updateObj.guest_phone = updates.guestPhone;
  if (updates.roomId) updateObj.room_id = updates.roomId;
  if (updates.checkInDate) updateObj.check_in_date = updates.checkInDate;
  if (updates.checkOutDate) updateObj.check_out_date = updates.checkOutDate;
  if (updates.listingTitle) updateObj.listing_title = updates.listingTitle;
  if (updates.guestsCount) updateObj.guests_count = updates.guestsCount;
  if (updates.totalPrice) updateObj.total_price = updates.totalPrice;
  if (updates.totalNights) updateObj.total_nights = updates.totalNights;
  if (updates.extra_bed !== undefined) updateObj.extra_bed = updates.extra_bed;
  if (updates.specialRequests !== undefined) updateObj.special_requests = updates.specialRequests;

  try {
    const { data, error } = await db
      .from('bookings')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('[Bookings] SDK update failed:', err.message);
    throw err;
  }
}

export async function deleteBooking(id) {
  try {
    const { error } = await db
      .from('bookings')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('[Bookings] SDK delete failed:', err.message);
    throw err;
  }
}

export async function verifyPayment(paymentData) {
  const res = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Verification failed' }));
    throw new Error(err.error || `Server error: ${res.status}`);
  }

  return await res.json();
}
