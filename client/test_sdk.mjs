import { createClient } from '@insforge/sdk';

const client = createClient({
    baseUrl: 'https://hve9xz4u.us-east.insforge.app',
    anonKey: 'ik_6726f2a82b00c4d6d9918526a4a9f65d'
});

async function test() {
    const { data, error } = await client.database
        .from('bookings')
        .insert([{
            guest_name: "test",
            guest_email: "test@test.com",
            guest_phone: "123",
            room_id: "standard",
            check_in_date: "2026-03-10",
            check_out_date: "2026-03-12",
            listing_title: "Test Room",
            guests_count: 1,
            total_price: 100,
            status: "pending",
            total_nights: 2,
            extra_bed: false,
            special_requests: ""
        }])
        .select()
        .single();

    console.log("SDK insert data:", data);
    console.log("SDK insert error:", error);
}

test();
