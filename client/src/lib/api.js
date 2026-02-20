/**
 * InsForge client for frontend — direct database access.
 * In development, falls back to the local Express API.
 * In production, uses the InsForge SDK directly.
 */
import { createClient } from '@insforge/sdk';

const INSFORGE_URL = import.meta.env.VITE_INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app';
const INSFORGE_ANON_KEY = import.meta.env.VITE_INSFORGE_ANON_KEY || '';
const API_URL = import.meta.env.VITE_API_URL || '';

// Use InsForge SDK directly if anon key is available (production)
const useDirectSDK = !!INSFORGE_ANON_KEY;

let db = null;
if (useDirectSDK) {
    const client = createClient({
        baseUrl: INSFORGE_URL,
        anonKey: INSFORGE_ANON_KEY,
    });
    db = client.database;
}

// ─── Bookings API ───

export async function getAllBookings() {
    if (useDirectSDK) {
        const { data, error } = await db
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }
    // Fallback to Express API
    const base = API_URL || 'http://localhost:5000';
    const res = await fetch(`${base}/api/bookings`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch bookings');
    return json.data;
}

export async function createBooking(bookingData) {
    if (useDirectSDK) {
        const { data, error } = await db
            .from('bookings')
            .insert([{
                guest_name: bookingData.guestName,
                guest_email: bookingData.guestEmail,
                guest_phone: bookingData.guestPhone || '',
                room_id: bookingData.roomId || 'standard',
                check_in_date: bookingData.checkInDate,
                check_out_date: bookingData.checkOutDate || null,
                listing_title: bookingData.listingTitle || '',
                guests_count: bookingData.guestsCount || 1,
                total_price: bookingData.totalPrice || 0,
                status: bookingData.status || 'confirmed',
                total_nights: bookingData.totalNights || 1,
                extra_bed: bookingData.extraBed || false,
                special_requests: bookingData.specialRequests || ''
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
    const base = API_URL || 'http://localhost:5000';
    const res = await fetch(`${base}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Booking failed');
    return json.data;
}

export async function updateBooking(id, updates) {
    if (useDirectSDK) {
        const updateObj = {};
        if (updates.status) updateObj.status = updates.status;
        if (updates.guestName) updateObj.guest_name = updates.guestName;

        const { data, error } = await db
            .from('bookings')
            .update(updateObj)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
    const base = API_URL || 'http://localhost:5000';
    const res = await fetch(`${base}/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Update failed');
    return json.data;
}

export async function deleteBooking(id) {
    if (useDirectSDK) {
        const { error } = await db
            .from('bookings')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
    const base = API_URL || 'http://localhost:5000';
    const res = await fetch(`${base}/api/bookings/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Delete failed');
    return true;
}
