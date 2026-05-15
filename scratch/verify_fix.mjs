/**
 * Verify the fix — send _booking_confirmed WITH header parameter
 */
const TOKEN = 'EAATGo8APsC8BReQ0K4dvNchLqA4yo8mZCGCxjw0Mxx5AwYMjYT0ufVy7oymFYZC9RyJeBHFvyvpYqxoDQQ5L1UlgSSxrKHVs46F3b6fnHCRlnS2elJY3D9cr3svk3yH3BptUuLexRT6eS6nx7vvNUrEGbLSmZBecjTydHrjPgb9inbHQ09leawlRaXNMwZDZD';
const PHONE_NUMBER_ID = '1084998618027495';
const TEST_PHONE = '918589003444';

const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

console.log('=== Sending _booking_confirmed WITH header parameter ===');

const body = {
    messaging_product: 'whatsapp',
    to: TEST_PHONE,
    type: 'template',
    template: {
        name: '_booking_confirmed',
        language: { code: 'en' },
        components: [
            {
                type: 'header',
                parameters: [
                    { type: 'text', text: 'ALB-2026-TEST1' }
                ]
            },
            {
                type: 'body',
                parameters: [
                    { type: 'text', text: 'Test Guest' },
                    { type: 'text', text: 'Standard Room' },
                    { type: 'text', text: '16 May 2026' },
                    { type: 'text', text: '17 May 2026' },
                    { type: 'text', text: '₹1500' }
                ]
            }
        ]
    }
};

const res = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify(body)
});

const data = await res.json();
console.log('Status:', res.status);
console.log('Response:', JSON.stringify(data, null, 2));

if (res.ok) {
    console.log('\n✅ FIX VERIFIED — Message sent successfully!');
} else {
    console.log('\n❌ Still failing — check the error above.');
}
