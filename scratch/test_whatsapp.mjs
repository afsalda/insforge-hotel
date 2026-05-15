/**
 * Quick test script — sends a WhatsApp template message via Meta Cloud API
 * to verify that the credentials and template name are valid.
 */

const TOKEN = 'EAATGo8APsC8BReQ0K4dvNchLqA4yo8mZCGCxjw0Mxx5AwYMjYT0ufVy7oymFYZC9RyJeBHFvyvpYqxoDQQ5L1UlgSSxrKHVs46F3b6fnHCRlnS2elJY3D9cr3svk3yH3BptUuLexRT6eS6nx7vvNUrEGbLSmZBecjTydHrjPgb9inbHQ09leawlRaXNMwZDZD';
const PHONE_NUMBER_ID = '1084998618027495';
const OWNER_PHONE = '918589003444';

const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

// Test 1: Customer booking confirmation template
async function testCustomerTemplate() {
    console.log('\n=== Test 1: _booking_confirmed template ===');
    const body = {
        messaging_product: 'whatsapp',
        to: OWNER_PHONE,
        type: 'template',
        template: {
            name: '_booking_confirmed',
            language: { code: 'en' },
            components: [{
                type: 'body',
                parameters: [
                    { type: 'text', text: 'Test Guest' },
                    { type: 'text', text: 'Standard Room' },
                    { type: 'text', text: '16 May 2026' },
                    { type: 'text', text: '17 May 2026' },
                    { type: 'text', text: '₹1500' }
                ]
            }]
        }
    };

    try {
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
    } catch (err) {
        console.error('Network error:', err.message);
    }
}

// Test 2: Owner new booking alert template
async function testOwnerTemplate() {
    console.log('\n=== Test 2: new_booking_alert template ===');
    const body = {
        messaging_product: 'whatsapp',
        to: OWNER_PHONE,
        type: 'template',
        template: {
            name: 'new_booking_alert',
            language: { code: 'en' },
            components: [{
                type: 'body',
                parameters: [
                    { type: 'text', text: 'Test Guest' },
                    { type: 'text', text: 'Standard Room' },
                    { type: 'text', text: '16 May 2026' },
                    { type: 'text', text: '17 May 2026' }
                ]
            }]
        }
    };

    try {
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
    } catch (err) {
        console.error('Network error:', err.message);
    }
}

// Test 3: Simple text message (to verify credentials)
async function testPlainMessage() {
    console.log('\n=== Test 3: Plain text message (verify credentials) ===');
    const body = {
        messaging_product: 'whatsapp',
        to: OWNER_PHONE,
        type: 'text',
        text: { body: 'Test from Al Baith booking system — ignore this message.' }
    };

    try {
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
    } catch (err) {
        console.error('Network error:', err.message);
    }
}

await testPlainMessage();
await testCustomerTemplate();
await testOwnerTemplate();
