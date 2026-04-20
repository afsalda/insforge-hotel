import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('razorpay/package.json');
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const keyId = process.env.RAZORPAY_KEY_ID || 'MISSING';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'MISSING';

console.log('Razorpay SDK Version:', pkg.version);
console.log('Key ID (prefix):', keyId.slice(0, 10));
console.log('Key Secret (first 3):', keySecret.slice(0, 3));
console.log('Key Secret (last 3):', keySecret.slice(-3));
console.log('Key Secret Length:', keySecret.length);
