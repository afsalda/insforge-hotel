import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * BookingConfirmationModal - Premium Ticket Design
 * Plays a confirmation chime on mount.
 * Renders a dynamic barcode based on the booking reference.
 */

function playConfirmationSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  
  // Resume context if suspended (common on mobile/safari)
  // We wrap the playback in the resume promise to ensure it only plays when ready
  ctx.resume().then(() => {
    // A more premium "success" chime: A major chord progression
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const times = [0, 0.08, 0.16, 0.28];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + times[i]);

      gain.gain.setValueAtTime(0, ctx.currentTime + times[i]);
      // Increased volume for better audibility
      gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + times[i] + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + times[i] + 0.4);

      osc.start(ctx.currentTime + times[i]);
      osc.stop(ctx.currentTime + times[i] + 0.5);
    });
    
    // Close context after playback to save resources
    setTimeout(() => ctx.close(), 2000);
  }).catch(e => console.warn("Audio context resume failed:", e));
}

export default function BookingConfirmationModal({ booking, onClose }) {
  const barcodeRef = useRef(null);
  const ticketRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Play sound on mount with a tiny delay to ensure everything is ready
    const timer = setTimeout(() => {
      try {
        playConfirmationSound();
      } catch (e) {
        console.warn("Audio playback failed:", e);
      }
    }, 300);

    // Simple barcode renderer using canvas
    if (barcodeRef.current && booking?.ref) {
      drawBarcode(barcodeRef.current, booking.ref);
    }
    
    return () => clearTimeout(timer);
  }, [booking?.ref]);

  function drawBarcode(canvas, text) {
    const ctx = canvas.getContext("2d");
    // Higher resolution for sharp PDF rendering
    canvas.width = 600; 
    canvas.height = 120;
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

    let x = 40;
    for (let i = 0; i < 75; i++) {
        const w = rng(i) > 0.6 ? 6 : 3;
        if (rng(i + 100) > 0.25) {
            ctx.fillRect(x, 10, w, 100);
        }
        x += w + 4;
        if (x > 560) break;
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

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || isDownloading) return;
    setIsDownloading(true);
    
    try {
      const isMobile = window.innerWidth <= 768;
      const element = ticketRef.current;
      
      // Delay to ensure any mount animations or font rendering is complete
      await new Promise(r => setTimeout(r, isMobile ? 1500 : 800));

      // Fixed width for capture to ensure consistent layout across different devices
      const captureWidth = isMobile ? 480 : 800;
      
      const canvas = await html2canvas(element, {
        scale: 2.0, // Reduced from 2.5 to save memory on mobile while keeping high quality
        useCORS: true,
        logging: true, // Enabled logging for debugging
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: captureWidth,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("booking-ticket");
          if (clonedElement) {
            // Force stable styles for capture
            clonedElement.style.width = `${captureWidth}px`;
            clonedElement.style.maxWidth = "none";
            clonedElement.style.height = "auto";
            clonedElement.style.transform = "none";
            clonedElement.style.animation = "none";
            clonedElement.style.position = "relative";
            clonedElement.style.margin = "0";
            clonedElement.style.padding = "0";
            clonedElement.style.display = "block";
            clonedElement.style.background = "#ffffff";
            clonedElement.style.borderRadius = "0"; // Remove border radius for clean PDF edges
            
            // Hide the ticket-divider punch holes which look weird in PDF without backdrop
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
              .ticket-divider::before, .ticket-divider::after {
                display: none !important;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            `;
            clonedDoc.head.appendChild(style);

            // Fix visibility of nested elements
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach(el => {
                el.style.opacity = "1";
                el.style.visibility = "visible";
                if (el.tagName === 'svg' || el.tagName === 'canvas') {
                    el.style.display = 'block';
                }
            });
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      if (!imgData || imgData === 'data:,') {
        throw new Error("Generated canvas is empty");
      }

      const pdfWidth = captureWidth;
      const pdfHeight = (canvas.height / canvas.width) * captureWidth;
      
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'l' : 'p',
        unit: 'pt',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      const fileName = `Al-Baith-Booking-${bookingRef}.pdf`;
      pdf.save(fileName);
      
      if (isMobile) {
        setTimeout(() => {
          alert("Ticket downloaded successfully!");
        }, 300);
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
          zIndex: 10000,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start", // Start at top for long content
          padding: "50px 16px",
          overflowY: "auto",
          animation: "fadeIn 0.3s ease",
        }}
      >
        {/* Ticket Modal */}
        <div 
          onClick={e => e.stopPropagation()}
          className="modal-ticket-container"
          style={{
            position: "relative",
            background: "#fff",
            borderRadius: "20px",
            zIndex: 10001,
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            animation: "slideUp 0.4s ease-out forwards",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            margin: "0 auto",
            touchAction: "pan-y",
            overflow: "visible"
          }}
        >
          <div id="booking-ticket" ref={ticketRef} style={{ background: "#fff", borderRadius: "20px" }}>
            {/* ── Header Area ── */}
            <div className="modal-ticket-header" style={{
            background: "linear-gradient(165deg, #1a3d2b 0%, #0a1a0f 100%)",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}>
             {/* Glossy Overlay */}
             <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)", pointerEvents: "none" }}></div>

            {/* Brand Logo */}
            <div className="ticket-brand-logo" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>🌙</span>
              <span style={{ color: "#C9A84C", fontWeight: 800, fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Al Baith</span>
            </div>

            {/* Checkmark Icon */}
            <div className="ticket-check-icon" style={{
              width: 44, height: 44,
              background: "rgba(201,168,76,0.12)",
              border: "2.5px solid #C9A84C",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
              animation: "popIn 0.4s 0.2s ease-out both",
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "drawCheck 0.6s 0.5s ease forwards" }} />
                </svg>
            </div>

            <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 12px", fontWeight: 500 }}>
              {guestName} · {guests} guest{guests > 1 ? "s" : ""}
            </p>

            {/* Ref Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(201,168,76,0.45)",
              borderRadius: 30, padding: "4px 12px",
            }}>
              <span style={{ fontSize: 13 }}>🔖</span>
              <span style={{ color: "#C9A84C", fontFamily: "monospace", fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>
                Ref: {bookingRef}
              </span>
            </div>
          </div>

          <div className="ticket-divider" style={{ position: "relative", height: 0, zIndex: 11 }}></div>

          {/* ── Body ── */}
          <div className="modal-ticket-body" style={{ background: "#fff", borderRadius: "20px 20px 24px 24px", marginTop: "-10px" }}>

            {/* Room Info */}
            <div style={{ textAlign: "center", marginBottom: 12, padding: "12px 14px" }}>
                <p style={{ fontWeight: 400, fontSize: 13, color: "#1a3d2b", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "1px", lineHeight: "1.3" }}>
                {roomType}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 11 }}>
                <span style={{
                    background: "#f0f7f4", color: "#2d6a4f",
                    padding: "2px 6px", borderRadius: 6, fontWeight: 700, border: "1px solid #e2ece6"
                }}>{checkIn}</span>
                <span style={{ color: "#C9A84C", fontWeight: 800 }}>→</span>
                <span style={{
                    background: "#f0f7f4", color: "#2d6a4f",
                    padding: "2px 6px", borderRadius: 6, fontWeight: 700, border: "1px solid #e2ece6"
                }}>{checkOut}</span>
                <span style={{ color: "#999", fontWeight: 600 }}>· {nights}N</span>
                </div>
            </div>


            <div style={{ borderTop: "2px dashed #f0f0f0", margin: "0 -24px 24px" }}></div>

            {/* Payment Summary */}
            <div style={{
              background: "#fafbf9", borderRadius: 16,
              border: "1px solid #f0f4f1", overflow: "hidden", marginBottom: 12,
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 14px", borderBottom: "1px solid #f0f4f1",
              }}>
                <span style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>Deposit Paid</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: "#1a3a2a" }}>
                  ₹{depositPaid.toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 14px", background: "#fffdf9",
              }}>
                <span style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>Balance at Check-in</span>
                <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: "#c0392b" }}>
                  ₹{balanceDue.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* WhatsApp Notice */}
            {whatsappNumber && (
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "#f0fbf5", border: "1px solid #dceedf",
                borderRadius: 12, padding: "8px 12px", marginBottom: 12,
              }}>
                <span style={{ fontSize: 20 }}>💬</span>
                <p style={{ margin: 0, fontSize: 11.5, color: "#2d6a4f", lineHeight: 1.4, fontWeight: 500 }}>
                  A WhatsApp confirmation has been sent to{" "}
                  <strong style={{ color: "#1a3a2a" }}>{whatsappNumber}</strong>
                </p>
              </div>
            )}

            <div style={{ borderTop: "2px dashed #f0f0f0", margin: "0 -24px 24px" }}></div>

            {/* Barcode Section */}
            <div className="barcode-section" style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              width: "100%",
              marginBottom: 12 
            }}>
              <canvas 
                ref={barcodeRef} 
                style={{ 
                  maxWidth: "220px", 
                  width: "100%", 
                  height: 48, 
                  borderRadius: 4 
                }} 
              />
              <p style={{ 
                fontFamily: "monospace", 
                fontSize: 9, 
                color: "#999", 
                marginTop: 4, 
                marginBottom: 8, 
                letterSpacing: 4, 
                textTransform: "uppercase",
                textAlign: "center"
              }}>
                {bookingRef}
              </p>
            </div>
            </div>
          </div>


          {/* Button Section - Outside ticketRef so it's not in the PDF */}
          <div className="modal-ticket-body" style={{ background: "#fff", borderRadius: "0 0 24px 24px", paddingTop: 0 }}>
            <div className="download-btn-container" style={{ padding: "0 0 10px" }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadPDF();
                  }} 
                  disabled={isDownloading}
                  style={{
                    width: "100%", padding: "12px",
                    background: isDownloading ? "#ccc" : "linear-gradient(135deg, #1a3d2b, #2d6a4f)",
                    color: "#fff", fontWeight: 800, fontSize: 13,
                    border: "none", borderRadius: 12, cursor: isDownloading ? "not-allowed" : "pointer",
                    letterSpacing: 1, textTransform: "uppercase",
                    boxShadow: "0 10px 20px rgba(45,106,79,0.2)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {isDownloading ? "Generating PDF..." : "📥 DOWNLOAD AS PDF"}
                </button>
                <p 
                  onClick={onClose}
                  style={{
                    textAlign: "center",
                    fontSize: "11px",
                    color: "#666",
                    marginTop: "12px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontWeight: 500
                  }}
                >
                  Back to Home
                </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes popIn {
          from { transform: scale(0); opacity: 0 }
          to   { transform: scale(1); opacity: 1 }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0 }
        }
        
        .modal-ticket-container {
          width: min(380px, 94vw);
          max-height: 94vh;
          overflow-y: auto;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none;    /* Firefox */
        }
        
        .modal-ticket-header {
          padding: 16px 18px 14px;
        }

        .modal-ticket-body {
          padding: 24px 16px 16px;
        }

        .barcode-section {
          margin-top: 5px;
        }
        
        @media (min-width: 769px) {
          .modal-ticket-container {
            width: 700px !important;
            max-height: 90vh !important;
          }
          .modal-ticket-header {
            padding: 8px 18px 4px !important;
          }
          .ticket-brand-logo {
            margin-bottom: 8px !important;
          }
          .ticket-check-icon {
            width: 34px !important;
            height: 34px !important;
            margin-bottom: 6px !important;
          }
          .ticket-check-icon svg {
            width: 16px !important;
            height: 16px !important;
          }
          .modal-ticket-header h2 {
            font-size: 14px !important;
          }
          .modal-ticket-header p {
            margin-bottom: 5px !important;
          }
          .modal-ticket-body {
            padding: 10px 16px 10px !important;
          }
          .barcode-section {
            margin-bottom: 2px !important;
          }
          .barcode-section canvas {
            height: 38px !important;
            max-width: 600px !important;
          }
          .barcode-section p {
            margin-top: 2px !important;
            margin-bottom: 5px !important;
          }
        }
        
        .modal-ticket-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
        
        @media (max-width: 768px) {
          .modal-ticket-container {
            max-height: 96vh !important;
          }
          .modal-ticket-header {
            padding: 14px 16px 12px !important;
          }
          .ticket-brand-logo {
            margin-bottom: 10px !important;
          }
          .ticket-check-icon {
            width: 38px !important;
            height: 38px !important;
            margin-bottom: 6px !important;
          }
          .modal-ticket-header h2 {
            font-size: 15px !important;
          }
          .modal-ticket-header p {
            margin-bottom: 8px !important;
            font-size: 11px !important;
          }
          .modal-ticket-body {
            padding: 16px 14px 14px !important;
          }
          .barcode-section {
            margin-top: 2px !important;
            margin-bottom: 6px !important;
          }
          .barcode-section canvas {
            height: 40px !important;
          }
          .barcode-section p {
            margin-top: 4px !important;
            margin-bottom: 6px !important;
            font-size: 8px !important;
          }
        }

        .ticket-divider::before,
        .ticket-divider::after {
          content: '';
          position: absolute;
          width: 32px;
          height: 32px;
          background: rgba(0, 0, 0, 0.55);
          border-radius: 50%;
          z-index: 10;
          top: -16px;
        }
        
        .ticket-divider::before {
          left: -16px;
        }
        
        .ticket-divider::after {
          right: -16px;
        }
      `}</style>
    </>
  );
}
