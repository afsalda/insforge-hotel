export const metadata = {
  title: 'Privacy Policy',
  description: 'Read the privacy policy for Al Baith Rest House, Ernakulam, Kerala. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-cream)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
          Privacy Policy
        </h1>

        <div style={{ background: 'white', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(201,169,110,0.12)' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>1. Information We Collect</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              We collect personal information including your name, email address, phone number, and payment details when you make a booking at Al Baith Rest House.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>2. How We Use Your Information</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Your information is used to process bookings, send confirmation emails, and improve our services. We do not sell or share your personal data with third parties for marketing purposes.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>3. Data Security</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              We implement industry-standard security measures to protect your personal information. Payment processing is handled through secure, PCI-compliant payment gateways.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>4. Cookies</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Our website may use cookies to enhance your browsing experience. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '12px' }}>5. Contact</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              For privacy-related inquiries, please contact us at <a href="mailto:albaith.booking@gmail.com" style={{ color: 'var(--accent-gold)' }}>albaith.booking@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
