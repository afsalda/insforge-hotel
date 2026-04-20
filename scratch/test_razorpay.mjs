import Razorpay from 'razorpay';
console.log('Razorpay:', typeof Razorpay);
try {
    const r = new Razorpay({ key_id: 'test', key_secret: 'test' });
    console.log('Constructor worked');
} catch (e) {
    console.log('Constructor failed:', e.message);
}
