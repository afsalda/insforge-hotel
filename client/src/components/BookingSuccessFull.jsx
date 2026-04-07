import React, { useEffect } from 'react';
import './BookingSuccessFull.css';

function Barcode({ value }) {
  let seed = 0;
  for (let i = 0; i < value.length; i++) {
    seed = ((seed << 5) - seed + value.charCodeAt(i)) | 0;
  }
  const rng = n => { const x = Math.sin(seed + n) * 10000; return x - Math.floor(x); };
  const bars = Array.from({ length: 55 }, (_, i) => ({ w: rng(i) > 0.65 ? 3 : rng(i) > 0.35 ? 2 : 1.5 }));
  const GAP = 2, SVG_W = 220, SVG_H = 56;
  const total = bars.reduce((a, b) => a + b.w + GAP, 0) - GAP;
  let cx = (SVG_W - total) / 2;

  const startX = (SVG_W - total) / 2 - 4;

  return (
    <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} aria-label="Booking barcode">
        {bars.map((bar, i) => {
            const x = cx;
            cx += bar.w + GAP;
            return (
                <rect key={i} x={x} y="4" width={bar.w} height={SVG_H - 8} fill="#1a3a2a" opacity="0.82" />
            );
        })}
        <rect x={startX} y="4" width={total + 8} height="3" fill="#C9A84C" opacity="0.7" style={{ animation: 'barScan 2.4s ease-in-out infinite' }} />
    </svg>
  );
}

function Confetti() {
  useEffect(() => {
    const colors = ["#C9A84C","#2d6a4f","#ffffff","#f4d03f","#a8d5b5","#e8c97e"];
    const container = document.getElementById("confetti-container");
    if (!container) return;
    let pieces = [];

    function spawn() {
      for (let i = 0; i < 90; i++) {
        const el = document.createElement("div");
        el.classList.add("confetti-piece");
        const isRect = Math.random() > 0.4;
        const size   = 6 + Math.random() * 8;
        el.style.cssText = `
          left: ${Math.random() * 100}%;
          top: -3%;
          width: ${size}px;
          height: ${isRect ? size * 2.5 : size}px;
          border-radius: ${isRect ? "2px" : "50%"};
          background-color: ${colors[i % colors.length]};
          transform: rotate(${Math.random() * 360}deg);
          animation-duration: ${2.8 + Math.random() * 2.2}s;
          animation-delay: ${Math.random() * 1.6}s;
        `;
        container.appendChild(el);
        pieces.push(el);
      }
      setTimeout(() => { pieces.forEach(p => p.remove()); pieces = []; }, 7000);
    }
    const timer = setTimeout(spawn, 180);
    return () => clearTimeout(timer);
  }, []);

  return <div id="confetti-container" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}></div>;
}

export default function BookingSuccessFull({
    guestName,
    guestPhone,
    guestsCount,
    checkIn,
    checkOut,
    nights,
    depositAmount,
    balanceAmount,
    bookingRef,
    listingTitle,
    onReturnHome
}) {
  const formatDate = (dateStr) => {
      try {
          return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch {
          return dateStr;
      }
  };

  return (
    <div className="booking-success-wrapper">
        <Confetti />
        
        {/* Nav */}
        <header className="bs-header">
          <div className="bs-logo">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <path d="M20 13A8 8 0 0 1 8 5a10 10 0 1 0 12 8z" fill="#C9A84C"/>
              <circle cx="21" cy="6" r="1.5" fill="#C9A84C"/>
            </svg>
            <span className="bs-logo-text">AL BAITH</span>
          </div>
          <button className="bs-menu-btn" aria-label="Menu" onClick={onReturnHome}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </header>

        {/* Main */}
        <main className="bs-main">
          <div className="bs-card">
            {/* punch holes */}
            <div className="bs-punch bs-punch-l" aria-hidden="true"></div>
            <div className="bs-punch bs-punch-r" aria-hidden="true"></div>

            {/* header */}
            <div className="bs-card-header">
              <div className="bs-check-wrap">
                <div className="bs-glow-ring" aria-hidden="true"></div>
                <div className="bs-check-circle">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                       stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
              </div>

              <h1 className="bs-card-title">Booking Confirmed!</h1>
              <p className="bs-card-sub">{guestName} &middot; {guestsCount} guest{guestsCount > 1 ? 's' : ''}</p>

              <div className="bs-ref-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <path d="M9 9h6M9 12h6M9 15h4"/>
                </svg>
                <span className="bs-ref-text">Ref: {bookingRef}</span>
              </div>
            </div>

            {/* body */}
            <div className="bs-card-body">

              <div>
                <p className="bs-room-name">{listingTitle}</p>
                <div className="bs-dates-row" style={{ marginTop: '8px' }}>
                  <span className="bs-date-chip">{formatDate(checkIn)}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                  <span className="bs-date-chip">{formatDate(checkOut)}</span>
                  <span className="bs-nights">&middot; {nights} nights</span>
                </div>
              </div>

              <div className="bs-divider"></div>

              <div className="bs-payment-box">
                <div className="bs-pay-row">
                  <span className="bs-pay-label">Deposit Paid</span>
                  <span className="bs-pay-value bs-pay-dep">₹{depositAmount}</span>
                </div>
                <div className="bs-pay-line"></div>
                <div className="bs-pay-row">
                  <span className="bs-pay-label">Balance Due at Check-in</span>
                  <span className="bs-pay-value bs-pay-bal">₹{balanceAmount}</span>
                </div>
              </div>

              <div className="bs-wa-box">
                <div className="bs-wa-icon">
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <circle cx="16" cy="16" r="16" fill="#25D366"/>
                    <path d="M22.7 9.3A9.4 9.4 0 0 0 16 6.6a9.45 9.45 0 0 0-8.15 14.18L6.6 25.4l4.74-1.24A9.44 9.44 0 0 0 25.4 16a9.4 9.4 0 0 0-2.7-6.7zm-6.7 14.5a7.84 7.84 0 0 1-4-1.1l-.29-.17-3.02.79.8-2.95-.19-.3a7.85 7.85 0 1 1 6.7 3.73zm4.3-5.88c-.24-.12-1.4-.69-1.61-.77-.22-.08-.37-.12-.53.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06a6.6 6.6 0 0 1-1.93-1.19 7.27 7.27 0 0 1-1.34-1.67c-.14-.24 0-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.28-.73-1.76-.19-.46-.39-.4-.53-.4h-.46a.88.88 0 0 0-.64.3 2.7 2.7 0 0 0-.84 2c0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28z" fill="white"/>
                  </svg>
                </div>
                <p className="bs-wa-text">A WhatsApp confirmation has been sent to <strong className="bs-wa-num">{guestPhone}</strong></p>
              </div>

              <div className="bs-divider"></div>

              {/* Barcode */}
              <div className="bs-barcode-wrap">
                <Barcode value={bookingRef} />
                <span className="bs-barcode-val">{bookingRef}</span>
              </div>

              <button className="bs-cta-btn" onClick={onReturnHome}>RETURN HOME</button>
            </div>
          </div>
        </main>
    </div>
  );
}
