import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-deep-green)',
      color: 'var(--text-cream)',
      textAlign: 'center',
      padding: '24px'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(4rem, 10vw, 8rem)',
        color: 'var(--accent-gold)',
        marginBottom: '16px',
        fontWeight: 300
      }}>
        404
      </h1>
      <p style={{
        fontSize: '1.2rem',
        color: 'rgba(245, 240, 232, 0.7)',
        marginBottom: '40px',
        maxWidth: '400px'
      }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '16px 36px',
          fontSize: '0.9rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          color: 'var(--bg-deep-green)',
          background: 'var(--accent-gold)',
          borderRadius: '50px',
          textDecoration: 'none',
          transition: 'transform 0.3s ease'
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
