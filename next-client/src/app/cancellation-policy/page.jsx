export const metadata = {
  title: 'Cancellation & Refund Policy',
  description: 'Read the cancellation and refund policy for Al Baith Rest House, Ernakulam, Kerala. Understand our booking terms before making a reservation.',
};

export default function CancellationPolicyPage() {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-cream)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
          Cancellation &amp; Refund Policy
        </h1>

        <div style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(201,169,110,0.12)' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>1. Cancellation Policy</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              All bookings at Al Baith Rest House may be cancelled free of charge up to 24 hours before the scheduled check-in date. Cancellations made within 24 hours of check-in are subject to a one-night charge.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>2. Refund Process</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Eligible refunds will be processed within 7-10 business days from the date of cancellation. Refunds will be credited to the original payment method.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>3. No-Show Policy</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              In case of a no-show, the full booking amount will be charged. No refund will be provided for no-shows.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>4. Modification of Bookings</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Changes to bookings (dates, room type) are subject to availability and may result in price adjustments. Please contact us at least 48 hours before check-in to request modifications.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>5. Contact</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              For cancellation or refund inquiries, please contact us at <a href="mailto:albaith.booking@gmail.com" style={{ color: 'var(--accent-gold)' }}>albaith.booking@gmail.com</a> or call <a href="tel:6238304411" style={{ color: 'var(--accent-gold)' }}>6238-304411</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
