import { createClient } from '@insforge/sdk';

const INSFORGE_URL = 'https://hve9xz4u.us-east.insforge.app';
const INSFORGE_API_KEY = 'ik_6726f2a82b00c4d6d9918526a4a9f65d';

const client = createClient({
    baseUrl: INSFORGE_URL,
    anonKey: INSFORGE_API_KEY,
});

async function run() {
    console.log("Starting test...");
    const { data, error } = await client.database
        .from('bookings')
        .insert([{
            guest_name: 'SDK Test',
            guest_email: 'sdk@test.com',
            guest_phone: '1234567890',
            room_id: 'standard',
            check_in_date: '2026-03-25',
            check_out_date: '2026-03-28',
            listing_title: 'Standard',
            guests_count: 1,
            total_price: 3000,
            status: 'confirmed',
            total_nights: 3,
            extra_bed: false,
            special_requests: ''
        }])
        .select()
        .single();

    if (error) {
        console.error("Error Object:", error);
        console.error("Code:", error.code);
        console.error("Details:", error.details);
        console.error("Hint:", error.hint);
        console.error("Message:", error.message);
    } else {
        console.log("Success:", data);
    }
}
run();
