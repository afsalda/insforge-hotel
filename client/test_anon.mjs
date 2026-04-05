import { createClient } from '@insforge/sdk';

const client = createClient({
    baseUrl: 'https://hve9xz4u.us-east.insforge.app',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0OTUzODl9.Pmpc_o1e_9C6omg9KS8tOToB1t-UT0ev5I_8ZYhFq70'
});

async function test() {
    const { data, error } = await client.database
        .from('bookings')
        .insert([{
            guest_name: "test_anon",
            guest_email: "test@anon.com",
            room_id: "standard",
            check_in_date: "2026-03-10"
        }])
        .select()
        .single();

    console.log("SDK anon data:", data);
    console.log("SDK anon error:", error);
}

test();
