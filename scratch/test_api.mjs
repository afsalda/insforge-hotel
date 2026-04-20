// Using global fetch

async function test() {
    const res = await fetch('http://localhost:3000/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            guestName: 'Test Guest',
            guestEmail: 'test@example.com',
            guestPhone: '9876543210',
            roomId: 'standard',
            checkInDate: '2026-04-19',
            checkOutDate: '2026-04-21',
            listingTitle: 'Standard Room',
            guestsCount: 1,
            totalPrice: 3350,
            totalNights: 2
        })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(data, null, 2));
}

test();
