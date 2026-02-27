/**
 * InsForge client for frontend — direct database access.
 * In development, falls back to the local Express API.
 * In production, uses the InsForge SDK directly.
 */
import { createClient } from '@insforge/sdk';

const INSFORGE_URL = import.meta.env.VITE_INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app';
const INSFORGE_ANON_KEY = import.meta.env.VITE_INSFORGE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjgzNjN9.FEEJcdIXtJoQa-7drZfFuCmh5BRn1qCFdvKGdLXZ4vw';

// Always point to the Express server (handles bookings + email sending)
const SERVER_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
    const res = await fetch(`${SERVER_BASE}/api/bookings`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch bookings');
    return json.data;
}

export async function createBooking(bookingData) {
    // ALWAYS go through Express server so emails are sent via nodemailer
    const res = await fetch(`${SERVER_BASE}/api/bookings`, {
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
        const updateObj = { ...updates };
        // Map camelCase to snake_case for fields known to the SDK
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
        if (updates.extraBed !== undefined) updateObj.extra_bed = updates.extraBed;
        if (updates.specialRequests !== undefined) updateObj.special_requests = updates.specialRequests;

        const { data, error } = await db
            .from('bookings')
            .update(updateObj)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
    const res = await fetch(`${SERVER_BASE}/api/bookings/${id}`, {
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
    const res = await fetch(`${SERVER_BASE}/api/bookings/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Delete failed');
    return true;
}
