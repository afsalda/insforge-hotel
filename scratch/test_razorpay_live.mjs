/**
 * Direct Razorpay API test — bypasses the entire app stack.
 * Tests the live keys by creating a minimal ₹1 order.
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const keyId = process.env.RAZORPAY_KEY_ID?.trim();
const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

console.log('=== Razorpay Live Key Diagnostic ===');
console.log(`Key ID:     "${keyId}"`);
console.log(`Key ID len: ${keyId?.length}`);
console.log(`Secret len: ${keySecret?.length}`);
console.log(`Key prefix: ${keyId?.substring(0, 8)}`);
console.log('');

// Test 1: Direct HTTP call to Razorpay (no SDK — eliminates SDK bugs)
console.log('--- Test 1: Direct HTTP to Razorpay orders.create ---');
try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: 100,       // 100 paise = ₹1
            currency: 'INR',
            receipt: 'test_receipt_001',
        }),
    });

    const data = await response.json();
    console.log(`HTTP Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
    
    if (response.ok) {
        console.log('\n✅ SUCCESS — Razorpay accepted the keys and created an order!');
        console.log(`   Order ID: ${data.id}`);
    } else {
        console.log('\n❌ FAILED — Razorpay rejected the request.');
        console.log(`   Error code: ${data.error?.code}`);
        console.log(`   Description: ${data.error?.description}`);
        console.log(`   Reason: ${data.error?.reason}`);
    }
} catch (err) {
    console.error('Network error:', err.message);
}

// Test 2: SDK-based call
console.log('\n--- Test 2: Razorpay SDK orders.create ---');
try {
    const Razorpay = (await import('razorpay')).default;
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
        amount: 100,
        currency: 'INR',
        receipt: 'test_sdk_001',
    });
    console.log('✅ SDK SUCCESS — Order ID:', order.id);
} catch (err) {
    console.log('❌ SDK FAILED');
    console.log('   Error:', err.error?.description || err.message);
    console.log('   Code:', err.error?.code || err.statusCode || 'unknown');
    console.log('   Full:', JSON.stringify(err.error || err, null, 2));
}

// Test 3: Check what the frontend would see
console.log('\n--- Test 3: Simulated /api/create-booking POST ---');
try {
    const res = await fetch('http://localhost:3000/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            guestName: 'Test User',
            guestEmail: 'test@example.com',
            guestPhone: '9876543210',
            roomId: 'test-room',
            checkInDate: '2026-04-20',
            checkOutDate: '2026-04-21',
            listingTitle: 'Test Room',
            guestsCount: 1,
            totalPrice: 1,
            totalNights: 1,
        }),
    });
    const data = await res.json();
    console.log(`HTTP Status: ${res.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
        console.log('\n✅ LOCAL API SUCCESS');
        console.log(`   The key returned to frontend: "${data.data?.key}"`);
    } else {
        console.log('\n❌ LOCAL API FAILED');
    }
} catch (err) {
    console.log('❌ LOCAL API unreachable:', err.message);
    console.log('   (Is dev-api-server running on port 3000?)');
}
