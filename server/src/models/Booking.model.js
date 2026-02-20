/**
 * Booking Model — InsForge SDK
 * Full CRUD operations for bookings table
 */
import { db } from '../config/insforge.js';

const TABLE = 'bookings';

// CREATE
export const createBooking = async (bookingData) => {
    const { data, error } = await db
        .from(TABLE)
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
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// READ ALL
export const getAllBookings = async () => {
    const { data, error } = await db
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// READ ONE by ID
export const getBookingById = async (id) => {
    const { data, error } = await db
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

// UPDATE
export const updateBooking = async (id, updates) => {
    const updateObj = {};
    if (updates.guestName) updateObj.guest_name = updates.guestName;
    if (updates.guestEmail) updateObj.guest_email = updates.guestEmail;
    if (updates.guestPhone) updateObj.guest_phone = updates.guestPhone;
    if (updates.roomId) updateObj.room_id = updates.roomId;
    if (updates.checkInDate) updateObj.check_in_date = updates.checkInDate;
    if (updates.checkOutDate) updateObj.check_out_date = updates.checkOutDate;
    if (updates.listingTitle) updateObj.listing_title = updates.listingTitle;
    if (updates.guestsCount) updateObj.guests_count = updates.guestsCount;
    if (updates.totalPrice) updateObj.total_price = updates.totalPrice;
    if (updates.status) updateObj.status = updates.status;

    const { data, error } = await db
        .from(TABLE)
        .update(updateObj)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// DELETE
export const deleteBooking = async (id) => {
    const { error } = await db
        .from(TABLE)
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
};
