/**
 * Seed 5 sample bookings
 * INSERT uses array format: .insert([{...}, {...}])
 */
import { db } from '../config/insforge.js';

export const seedBookings = async () => {
    const { data, error } = await db.from('bookings').insert([
        {
            guest_name: 'James Wilson',
            guest_email: 'james@email.com',
            guest_phone: '+1-555-0101',
            room_id: 'ROOM-101',
            check_in_date: '2025-02-15'
        },
        {
            guest_name: 'Sarah Johnson',
            guest_email: 'sarah@email.com',
            guest_phone: '+1-555-0102',
            room_id: 'ROOM-205',
            check_in_date: '2025-02-20'
        },
        {
            guest_name: 'Aisha Patel',
            guest_email: 'aisha@email.com',
            guest_phone: '+44-7700-0103',
            room_id: 'ROOM-310',
            check_in_date: '2025-03-01'
        },
        {
            guest_name: 'Lucas Martin',
            guest_email: 'lucas@email.com',
            guest_phone: '+33-6-5550104',
            room_id: 'ROOM-102',
            check_in_date: '2025-03-10'
        },
        {
            guest_name: 'Yuki Tanaka',
            guest_email: 'yuki@email.com',
            guest_phone: '+81-90-5550105',
            room_id: 'ROOM-408',
            check_in_date: '2025-03-15'
        }
    ]).select();

    if (error) throw error;
    console.log(`✅ Seeded ${data.length} bookings`);
};
