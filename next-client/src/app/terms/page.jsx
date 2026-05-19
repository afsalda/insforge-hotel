export const metadata = {
  title: 'Terms & Conditions',
  description: 'Read the terms and conditions for booking at Al Baith Rest House, Ernakulam, Kerala.',
};

export default function TermsConditionsPage() {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-cream)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
          Terms &amp; Conditions
        </h1>

        <div style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(201,169,110,0.12)' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>1. Check-in / Check-out</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Standard check-in time is 12:00 PM and check-out is 11:00 AM. Early check-in and late check-out are subject to availability and may incur additional charges.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>2. Guest Identification</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Valid government-issued photo identification is required at check-in for all guests. This is mandatory as per government regulations.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>3. Property Rules</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Smoking is not permitted inside rooms. Guests are responsible for any damage caused to hotel property during their stay. Quiet hours are from 10:00 PM to 7:00 AM.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>4. Payment</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              We accept major credit/debit cards, UPI, and online payment methods. A deposit may be required at the time of booking. Full payment is due at check-in unless otherwise arranged.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>5. Liability</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Al Baith Rest House is not responsible for loss or damage to personal belongings. Guests are advised to use the in-room safe for valuables.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
