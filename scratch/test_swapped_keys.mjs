import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Swapping them
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_SECRET?.trim(),
    key_secret: process.env.RAZORPAY_KEY_ID?.trim()
});

async function test() {
    try {
        const payments = await razorpay.payments.all({ count: 1 });
        console.log('Success! Swapped keys worked.');
    } catch (e) {
        console.error('Failed API call (swapped):', e.error || e.message);
    }
}

test();
