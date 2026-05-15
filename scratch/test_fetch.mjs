async function test() {
    try {
        const res = await fetch('https://hve9xz4u.us-east.insforge.app/api/database/records/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Body:", text);
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}
test();
