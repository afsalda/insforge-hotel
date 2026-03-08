/**
 * InsForge client for frontend — direct database access.
 * In development, uses VITE_INSFORGE_URL directly (Vite proxy handles CORS).
 * In production, routes through the Vercel rewrite proxy (same-origin).
 */
import { createClient } from '@insforge/sdk';

const isProduction = import.meta.env.PROD;
const INSFORGE_URL = isProduction
    ? window.location.origin
    : (import.meta.env.VITE_INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app');
const INSFORGE_ANON_KEY = import.meta.env.VITE_INSFORGE_ANON_KEY || '';

/**
 * In production, intercept global fetch to route InsForge database
 * requests through our /api/insforge-proxy serverless function.
 * 
 * The InsForge SDK's Database module calls global fetch() directly (not
 * through the HttpClient.fetch option), so we must intercept at this level.
 * The proxy injects the service API key for write permissions.
 */
if (isProduction) {
    const _originalFetch = globalThis.fetch;
    globalThis.fetch = async function (input, init) {
        const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());

        // Intercept InsForge database requests (SDK constructs these)
        const dbMatch = url.match(/\/api\/database\/(.+)/);
        if (dbMatch) {
            const fullSubPath = dbMatch[1]; // e.g. "records/bookings?select=*"
            const [subPath, qs] = fullSubPath.split('?');
            const proxyUrl = `/api/insforge-proxy?path=${encodeURIComponent(subPath)}${qs ? '&' + qs : ''}`;

            return _originalFetch(proxyUrl, init);
        }

        return _originalFetch(input, init);
    };
}

// Use InsForge SDK directly if anon key is available
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
        try {
            const { data, error } = await db
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        } catch (sdkError) {
            console.warn('[Bookings] SDK call failed, falling back:', sdkError.message);
            if (import.meta.env.PROD) {
                console.warn('⚠️ [Graceful Degradation] Using offline fallback for getAllBookings.');
                return JSON.parse(localStorage.getItem('offline_bookings') || '[]');
            }
        }
    }
    const res = await fetch(`/api/bookings`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch bookings');
    return json.data;
}

export async function createBooking(bookingData) {
    // ── Strategy: Try direct SDK first, fallback to Express server ──
    if (useDirectSDK) {
        try {
            const year = new Date().getFullYear();
            const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
            const bookingNumber = `ALB-${year}-${randomPart}`;

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
                    special_requests: bookingData.specialRequests || '',
                }])
                .select()
                .single();

            if (error) throw error;

            const enrichedData = { ...data, booking_number: bookingNumber };

            // Await the email trigger so the browser doesn't abort it upon navigation,
            // which can cause Vercel to terminate the function prematurely.
            try {
                await fetch('/api/send-booking-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(enrichedData),
                }).catch((emailErr) => {
                    console.warn('⚠️ Email sending failed:', emailErr.message);
                });
            } catch (err) {
                console.warn('⚠️ Email triggering error:', err.message);
            }

            return enrichedData;
        } catch (sdkError) {
            // ── Graceful Degradation: fallback to Express server ──
            console.warn('[Booking] SDK call failed, falling back:', sdkError.message);
            if (import.meta.env.PROD) {
                console.warn('⚠️ [Graceful Degradation] Using offline fallback for booking.');
                const year = new Date().getFullYear();
                const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
                const bookingNumber = `ALB-${year}-${randomPart}`;

                const mockBooking = {
                    id: `mock-${randomPart.toLowerCase()}`,
                    booking_number: bookingNumber,
                    guest_name: bookingData.guestName,
                    guest_email: bookingData.guestEmail,
                    guest_phone: bookingData.guestPhone || '',
                    room_id: bookingData.roomId || 'standard',
                    check_in_date: bookingData.checkInDate,
                    check_out_date: bookingData.checkOutDate || null,
                    listing_title: bookingData.listingTitle || '',
                    guests_count: bookingData.guestsCount || 1,
                    total_price: bookingData.totalPrice || 0,
                    status: 'confirmed_offline_sync',
                    created_at: new Date().toISOString()
                };

                const offlineBookings = JSON.parse(localStorage.getItem('offline_bookings') || '[]');
                offlineBookings.push(mockBooking);
                localStorage.setItem('offline_bookings', JSON.stringify(offlineBookings));

                return mockBooking;
            }
        }
    }

    // Fallback: go through Express server (or Vercel serverless function)
    const res = await fetch(`/api/book-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Booking failed');
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

    if (useDirectSDK) {
        try {
            const { data, error } = await db
                .from('bookings')
                .update(updateObj)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } catch (sdkError) {
            console.warn('[Bookings] SDK update failed, falling back:', sdkError.message);
            if (import.meta.env.PROD) {
                console.warn('⚠️ [Graceful Degradation] Using offline fallback for updateBooking.');
                let offlineBookings = JSON.parse(localStorage.getItem('offline_bookings') || '[]');
                let updated = null;
                offlineBookings = offlineBookings.map(b => {
                    if (b.id === id) {
                        updated = { ...b, ...updateObj };
                        return updated;
                    }
                    return b;
                });
                if (updated) {
                    localStorage.setItem('offline_bookings', JSON.stringify(offlineBookings));
                    return updated;
                }
                throw new Error("Booking not found in offline store");
            }
        }
    }
    const res = await fetch(`/api/bookings/${id}`, {
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
        try {
            const { error } = await db
                .from('bookings')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return true;
        } catch (sdkError) {
            console.warn('[Bookings] SDK delete failed, falling back:', sdkError.message);
            if (import.meta.env.PROD) {
                console.warn('⚠️ [Graceful Degradation] Using offline fallback for deleteBooking.');
                let offlineBookings = JSON.parse(localStorage.getItem('offline_bookings') || '[]');
                offlineBookings = offlineBookings.filter(b => b.id !== id);
                localStorage.setItem('offline_bookings', JSON.stringify(offlineBookings));
                return true;
            }
        }
    }
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Delete failed');
    return true;
}
