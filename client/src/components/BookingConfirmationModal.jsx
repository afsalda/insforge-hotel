import { useEffect, useRef } from "react";

/**
 * BookingConfirmationModal - Premium Ticket Design
 * Plays a confirmation chime on mount.
 * Renders a dynamic barcode based on the booking reference.
 */

function playConfirmationSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const times = [0, 0.12, 0.24, 0.38];

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + times[i]);

    gain.gain.setValueAtTime(0, ctx.currentTime + times[i]);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + times[i] + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + times[i] + 0.5);

    osc.start(ctx.currentTime + times[i]);
    osc.stop(ctx.currentTime + times[i] + 0.5);
  });
}

export default function BookingConfirmationModal({ booking, onClose }) {
  const barcodeRef = useRef(null);

  useEffect(() => {
    // Play sound on mount
    try {
      playConfirmationSound();
    } catch (e) {
      console.warn("Audio playback failed:", e);
    }

    // Simple barcode renderer using canvas
    if (barcodeRef.current && booking?.ref) {
      drawBarcode(barcodeRef.current, booking.ref);
    }
  }, [booking?.ref]);

  function drawBarcode(canvas, text) {
    const ctx = canvas.getContext("2d");
    canvas.width = 240;
    canvas.height = 60;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a3a2a";
    
    // Seeded random for consistent barcode look
    let seed = 0;
    for (let i = 0; i < text.length; i++) seed += text.charCodeAt(i);
    const rng = (n) => {
        const x = Math.sin(seed + n) * 10000;
        return x - Math.floor(x);
    };

    let x = 15;
    for (let i = 0; i < 65; i++) {
        const w = rng(i) > 0.6 ? 3 : 1.5;
        if (rng(i + 100) > 0.25) {
            ctx.fillRect(x, 5, w, 50);
        }
        x += w + 2;
        if (x > 225) break;
    }
  }

  const {
    guestName = "Guest",
    guests = 1,
    ref: bookingRef = "ALB-0000-XXXXX",
    roomType = "Standard Room",
    checkIn = "Apr 8, 2026",
    checkOut = "Apr 23, 2026",
    nights = 1,
    depositPaid = 0,
    balanceDue = 0,
    whatsappNumber = "",
  } = booking || {};

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(10, 26, 15, 0.9)",
          backdropFilter: "blur(8px)",
          zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.3s ease",
          padding: "20px"
        }}
      >
        {/* Ticket Modal */}
        <div 
          onClick={e => e.stopPropagation()}
          style={{
            position: "relative",
            width: "min(380px, 94vw)",
            background: "#fff",
            borderRadius: "24px",
            overflow: "visible", // For notches
            zIndex: 10000,
            boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
            animation: "ticketSlideUp 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}
        >
          {/* Ticket Notches */}
          <div style={{ position: "absolute", width: 32, height: 32, background: "rgba(10, 26, 15, 1)", borderRadius: "50%", left: -16, top: "42%", zIndex: 10 }}></div>
          <div style={{ position: "absolute", width: 32, height: 32, background: "rgba(10, 26, 15, 1)", borderRadius: "50%", right: -16, top: "42%", zIndex: 10 }}></div>

          {/* ── Header Area ── */}
          <div style={{
            background: "linear-gradient(165deg, #1a3d2b 0%, #0a1a0f 100%)",
            borderRadius: "24px 24px 0 0",
            padding: "32px 24px 28px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}>
             {/* Glossy Overlay */}
             <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)", pointerEvents: "none" }}></div>

            <button onClick={onClose} style={{
              position: "absolute", top: 18, right: 18,
              background: "rgba(255,255,255,0.12)",
              border: "none", borderRadius: "50%",
              width: 32, height: 32, cursor: "pointer",
              color: "#fff", fontSize: 16, display: "flex", 
              alignItems: "center", justifyContent: "center",
            }}>✕</button>

            {/* Brand Logo */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 22 }}>🌙</span>
              <span style={{ color: "#C9A84C", fontWeight: 800, fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Al Baith</span>
            </div>

            {/* Checkmark Icon */}
            <div style={{
              width: 58, height: 58,
              background: "rgba(201,168,76,0.12)",
              border: "2.5px solid #C9A84C",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
              animation: "popIn 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
            }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "drawCheck 0.6s 0.5s ease forwards" }} />
                </svg>
            </div>

            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, margin: "0 0 18px", fontWeight: 500 }}>
              {guestName} · {guests} guest{guests > 1 ? "s" : ""}
            </p>

            {/* Ref Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(201,168,76,0.45)",
              borderRadius: 30, padding: "7px 18px",
            }}>
              <span style={{ fontSize: 13 }}>🔖</span>
              <span style={{ color: "#C9A84C", fontFamily: "monospace", fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>
                Ref: {bookingRef}
              </span>
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "28px 24px 32px", background: "#fff", borderRadius: "0 0 24px 24px" }}>

            {/* Room Info */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <p style={{ fontWeight: 800, fontSize: 16, color: "#1a3d2b", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                {roomType}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 13 }}>
                <span style={{
                    background: "#f0f7f4", color: "#2d6a4f",
                    padding: "5px 14px", borderRadius: 8, fontWeight: 700, border: "1px solid #e2ece6"
                }}>{checkIn}</span>
                <span style={{ color: "#C9A84C", fontWeight: 800 }}>→</span>
                <span style={{
                    background: "#f0f7f4", color: "#2d6a4f",
                    padding: "5px 14px", borderRadius: 8, fontWeight: 700, border: "1px solid #e2ece6"
                }}>{checkOut}</span>
                <span style={{ color: "#999", fontWeight: 600 }}>· {nights}N</span>
                </div>
            </div>

            <div style={{ borderTop: "2px dashed #f0f0f0", margin: "0 -24px 24px" }}></div>

            {/* Payment Summary */}
            <div style={{
              background: "#fafbf9", borderRadius: 16,
              border: "1px solid #f0f4f1", overflow: "hidden", marginBottom: 20,
            }}>
              <div style={{
                display: "flex", justify_content: "space-between", align_items: "center",
                padding: "14px 18px", borderBottom: "1px solid #f0f4f1",
              }}>
                <span style={{ fontSize: 14, color: "#666", fontWeight: 500 }}>Deposit Paid</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15, color: "#1a3a2a" }}>
                  ₹{depositPaid.toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{
                display: "flex", justify_content: "space-between", align_items: "center",
                padding: "14px 18px", background: "#fffdf9",
              }}>
                <span style={{ fontSize: 14, color: "#666", fontWeight: 500 }}>Balance at Check-in</span>
                <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 17, color: "#c0392b" }}>
                  ₹{balanceDue.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* WhatsApp Notice */}
            {whatsappNumber && (
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "#f0fbf5", border: "1px solid #dceedf",
                borderRadius: 12, padding: "12px 18px", marginBottom: 24,
              }}>
                <span style={{ fontSize: 20 }}>💬</span>
                <p style={{ margin: 0, fontSize: 13, color: "#2d6a4f", lineHeight: 1.5, fontWeight: 500 }}>
                  A WhatsApp confirmation has been sent to{" "}
                  <strong style={{ color: "#1a3a2a" }}>{whatsappNumber}</strong>
                </p>
              </div>
            )}

            <div style={{ borderTop: "2px dashed #f0f0f0", margin: "0 -24px 24px" }}></div>

            {/* Barcode Section */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <canvas ref={barcodeRef} style={{ maxWidth: "100%", borderRadius: 4, height: 50 }} />
              <p style={{ fontFamily: "monospace", fontSize: 11, color: "#aaa", marginTop: 8, letterSpacing: 4, textTransform: "uppercase" }}>
                {bookingRef}
              </p>
            </div>

            {/* Close Button */}
            <button onClick={onClose} style={{
              width: "100%", padding: "18px",
              background: "linear-gradient(135deg, #1a3d2b, #2d6a4f)",
              color: "#fff", fontWeight: 800, fontSize: 15,
              border: "none", borderRadius: 16, cursor: "pointer",
              letterSpacing: 1, textTransform: "uppercase",
              boxShadow: "0 10px 20px rgba(45,106,79,0.2)",
              transition: "transform 0.2s, background 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              RETURN HOME
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ticketSlideUp {
          from { opacity: 0; transform: translateY(60px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popIn {
          from { transform: scale(0); opacity: 0 }
          to   { transform: scale(1); opacity: 1 }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0 }
        }
      `}</style>
    </>
  );
}
