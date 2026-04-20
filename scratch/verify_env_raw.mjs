import pkg from 'razorpay/package.json' assert { type: 'json' };
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const keyId = process.env.RAZORPAY_KEY_ID || 'MISSING';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'MISSING';

console.log('Razorpay SDK Version:', pkg.version);
console.log('Key ID (prefix):', keyId.slice(0, 10));
console.log('Key Secret (first bit):', keySecret.slice(0, 5));
console.log('Key Secret (last bit):', keySecret.slice(-5));
console.log('Key Secret Length:', keySecret.length);
