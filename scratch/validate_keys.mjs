import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID?.trim(),
    key_secret: process.env.RAZORPAY_KEY_SECRET?.trim()
});

async function test() {
    try {
        const payments = await razorpay.payments.all({ count: 1 });
        console.log('Success! Key is valid.');
    } catch (e) {
        console.error('Failed API call:', e);
    }
}

test();
