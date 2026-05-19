import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';

export const metadata = {
  title: 'Checkout — Complete Your Booking',
  description: 'Securely complete your room booking at Al Baith Rest House, Ernakulam. Pay a 30% deposit via Razorpay.',
};

export default function CheckoutPage({ params }) {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><div className="loading-spinner"></div></div>}>
      <CheckoutClient roomId={params.id} />
    </Suspense>
  );
}
