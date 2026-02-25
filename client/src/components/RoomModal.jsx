import { useState, useEffect, useRef } from 'react';
import { createClient } from '@insforge/sdk';

const gsap = window.gsap;

// Initialize InsForge client
const INSFORGE_URL = import.meta.env.VITE_INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app';
const INSFORGE_ANON_KEY = import.meta.env.VITE_INSFORGE_ANON_KEY || '';
const insforge = createClient({ baseUrl: INSFORGE_URL, anonKey: INSFORGE_ANON_KEY });

export default function RoomModal({ isOpen, onClose, room }) {
    const [view, setView] = useState('details'); // 'details', 'form', 'success'
    const [form, setForm] = useState({
        guest_name: '', email: '', phone: '', checkin_date: '', checkout_date: '',
        num_guests: 1, extra_bed: false, special_requests: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [totalNights, setTotalNights] = useState(0);

    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    const detailsRef = useRef(null);
    const formRef = useRef(null);
    const successRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setView('details');
            setForm({
                guest_name: '', email: '', phone: '', checkin_date: '', checkout_date: '',
                num_guests: 1, extra_bed: false, special_requests: ''
            });
            setErrors({});
            setTotalNights(0);

            gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
            );
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleClose = () => {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 });
        gsap.to(modalRef.current, {
            opacity: 0, scale: 0.95, duration: 0.25,
            onComplete: onClose
        });
    };

    const handleBookClick = () => {
        gsap.to(detailsRef.current, { x: '-100%', duration: 0.4, ease: 'power3.inOut' });
        gsap.fromTo(formRef.current,
            { x: '100%', display: 'block' },
            { x: '0%', duration: 0.4, ease: 'power3.inOut', onComplete: () => setView('form') }
        );
    };

    const handleBackToDetails = () => {
        gsap.to(formRef.current, { x: '100%', duration: 0.4, ease: 'power3.inOut' });
        gsap.to(detailsRef.current, {
            x: '0%', duration: 0.4, ease: 'power3.inOut', onComplete: () => {
                setView('details');
                if (formRef.current) formRef.current.style.display = 'none';
            }
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => {
            const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'checkin_date' || name === 'checkout_date') {
                const inDate = new Date(name === 'checkin_date' ? value : updated.checkin_date);
                const outDate = new Date(name === 'checkout_date' ? value : updated.checkout_date);

                // Auto-update checkout date if checkin changes and checkout is before checkin
                if (name === 'checkin_date' && outDate <= inDate) {
                    const newOut = new Date(inDate);
                    newOut.setDate(newOut.getDate() + 1);
                    updated.checkout_date = newOut.toISOString().split('T')[0];
                }

                const finalInDate = new Date(updated.checkin_date);
                const finalOutDate = new Date(updated.checkout_date);
                if (finalInDate && finalOutDate && finalOutDate > finalInDate) {
                    const diffTime = Math.abs(finalOutDate - finalInDate);
                    setTotalNights(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                } else {
                    setTotalNights(0);
                }
            }
            return updated;
        });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const errs = {};
        if (!form.guest_name.trim()) errs.guest_name = 'Required';
        if (!form.email.trim()) errs.email = 'Required';
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
        if (!form.phone.trim()) errs.phone = 'Required';
        if (!form.checkin_date) errs.checkin_date = 'Required';
        if (!form.checkout_date) errs.checkout_date = 'Required';
        if (form.checkin_date && form.checkout_date && form.checkout_date <= form.checkin_date) {
            errs.checkout_date = 'Must be after check-in';
        }
        if (!form.num_guests || form.num_guests < 1 || form.num_guests > room.maxGuests) {
            errs.num_guests = `Max ${room.maxGuests} guests`;
        }
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validateForm();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setSubmitting(true);
        const numericPrice = typeof room.price === 'string' && room.price.includes('Contact') ? 0 : parseInt(room.price.replace(/[^\d]/g, ''));
        const finalPrice = numericPrice * totalNights;

        try {
            const { error } = await insforge.database.from('bookings').insert([{
                guest_name: form.guest_name.trim(),
                guest_email: form.email.trim(),
                guest_phone: form.phone.trim(),
                room_id: room.type || room.name,
                check_in_date: form.checkin_date,
                check_out_date: form.checkout_date,
                listing_title: room.name,
                guests_count: parseInt(form.num_guests),
                extra_bed: form.extra_bed,
                special_requests: form.special_requests.trim(),
                total_nights: totalNights,
                total_price: finalPrice,
                status: 'pending'
            }]);

            if (error) throw error;

            // Transition to success
            gsap.to(formRef.current, {
                opacity: 0, duration: 0.3, onComplete: () => {
                    setView('success');
                    gsap.fromTo(successRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
                }
            });
        } catch (err) {
            console.error(err);
            alert('Booking failed: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen || !room) return null;

    const today = new Date().toISOString().split('T')[0];
    const minCheckout = form.checkin_date ? new Date(new Date(form.checkin_date).getTime() + 86400000).toISOString().split('T')[0] : today;

    const numericPrice = typeof room.price === 'string' && room.price.includes('Contact') ? 0 : parseInt(room.price.replace(/[^\d]/g, ''));

    return (
        <>
            <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-container {
          background: #FFFFFF;
          border-radius: 24px;
          max-width: 680px;
          width: 100%;
          position: relative;
          padding: 32px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: transparent;
          border: 1px solid var(--accent-gold);
          color: var(--accent-gold);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          z-index: 10;
        }
        .modal-close:hover {
          background: var(--accent-gold);
          color: #fff;
        }
        .modal-content-wrapper {
          position: relative;
          min-height: 500px;
        }
        .modal-panel {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        @media (max-width: 768px) {
          .modal-overlay { align-items: flex-end; padding: 0; }
          .modal-container { border-radius: 24px 24px 0 0; max-height: 85vh; overflow-y: auto; padding: 24px 20px; }
          .drag-handle { width: 40px; height: 4px; background: #E5E7EB; border-radius: 2px; margin: 0 auto 16px; }
        }
        .room-img { width: 100%; height: 240px; object-fit: cover; border-radius: 120px 120px 0 0; margin-bottom: 24px; }
        .pill { display: inline-block; padding: 4px 12px; background: rgba(201,169,110,0.1); color: var(--accent-gold-dim); border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin: 0 6px 6px 0; border: 1px solid rgba(201,169,110,0.2); }
        .booking-input { width: 100%; padding: 12px 14px; border: 1px solid #E5E7EB; border-radius: 12px; font-size: 0.95rem; font-family: var(--font-sans); }
        .booking-input:focus { outline: none; border-color: var(--accent-gold); }
        .booking-input.error { border-color: #EF4444; }
        .error-msg { font-size: 0.75rem; color: #EF4444; display: block; margin-top: 4px; }
        
        .success-circle { stroke-dasharray: 188; stroke-dashoffset: 188; animation: circleDraw 0.6s ease-out forwards; }
        .success-check { stroke-dasharray: 48; stroke-dashoffset: 48; animation: checkDraw 0.4s 0.4s ease-out forwards; }
        @keyframes circleDraw { to { stroke-dashoffset: 0; } }
        @keyframes checkDraw { to { stroke-dashoffset: 0; } }
      `}</style>

            <div className="modal-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}>
                <div className="modal-container" ref={modalRef}>
                    <div className="md:hidden drag-handle"></div>
                    <button className="modal-close" onClick={handleClose}>×</button>

                    <div className="modal-content-wrapper">

                        {/* ── ROOM DETAILS PANEL ── */}
                        <div className="modal-panel" ref={detailsRef} style={{ visibility: view === 'success' ? 'hidden' : 'visible' }}>
                            <img src={room.img} alt={room.name} className="room-img" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <div>
                                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#2C2C2C', margin: 0 }}>{room.name}</h2>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.2rem' }}>{room.price}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>👥 Max {room.maxGuests} Guests</div>
                                </div>
                            </div>

                            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 20 }}>{room.desc}</p>

                            <div style={{ marginBottom: 20 }}>
                                {room.amenities.map(am => <span key={am} className="pill">{am}</span>)}
                            </div>

                            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: 24, padding: '12px 16px', background: '#F9FAFB', borderRadius: 8 }}>
                                <strong>Extra Bed:</strong> {room.extraBedAvailable ? '✅ Available (no extra charge)' : '❌ Not available'}
                            </div>

                            <button
                                onClick={handleBookClick}
                                style={{ width: '100%', background: 'var(--accent-gold)', color: '#fff', padding: '16px', borderRadius: 12, border: 'none', fontSize: '1.1rem', fontFamily: 'var(--font-serif)', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                            >
                                Book Now
                            </button>
                        </div>

                        {/* ── BOOKING FORM PANEL ── */}
                        <div className="modal-panel" ref={formRef} style={{ display: 'none', height: '100%', overflowY: 'auto', paddingRight: 8 }}>
                            <button
                                onClick={handleBackToDetails}
                                style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center', marginBottom: 20, padding: 0 }}
                            >
                                ← Room Details
                            </button>

                            <div style={{ display: 'inline-block', background: 'var(--bg-deep-green)', color: 'var(--accent-gold)', padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 24 }}>
                                {room.name}
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: 4 }}>Guest Full Name *</label>
                                        <input type="text" name="guest_name" value={form.guest_name} onChange={handleChange} className={`booking-input ${errors.guest_name ? 'error' : ''}`} />
                                        {errors.guest_name && <span className="error-msg">{errors.guest_name}</span>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: 4 }}>Email Address *</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} className={`booking-input ${errors.email ? 'error' : ''}`} />
                                        {errors.email && <span className="error-msg">{errors.email}</span>}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: 4 }}>Phone Number *</label>
                                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={`booking-input ${errors.phone ? 'error' : ''}`} />
                                        {errors.phone && <span className="error-msg">{errors.phone}</span>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: 4 }}>Number of Guests *</label>
                                        <input type="number" name="num_guests" min="1" max={room.maxGuests} value={form.num_guests} onChange={handleChange} className={`booking-input ${errors.num_guests ? 'error' : ''}`} />
                                        {errors.num_guests && <span className="error-msg">{errors.num_guests}</span>}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: 4 }}>Check-in Date *</label>
                                        <input type="date" name="checkin_date" min={today} value={form.checkin_date} onChange={handleChange} className={`booking-input ${errors.checkin_date ? 'error' : ''}`} />
                                        {errors.checkin_date && <span className="error-msg">{errors.checkin_date}</span>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: 4 }}>Check-out Date *</label>
                                        <input type="date" name="checkout_date" min={minCheckout} value={form.checkout_date} onChange={handleChange} className={`booking-input ${errors.checkout_date ? 'error' : ''}`} />
                                        {errors.checkout_date && <span className="error-msg">{errors.checkout_date}</span>}
                                    </div>
                                </div>

                                {room.extraBedAvailable && (
                                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input type="checkbox" id="extra_bed" name="extra_bed" checked={form.extra_bed} onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'var(--accent-gold)' }} />
                                        <label htmlFor="extra_bed" style={{ fontSize: '0.9rem', color: '#333', cursor: 'pointer' }}>Request Extra Bed (Free)</label>
                                    </div>
                                )}

                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: 4 }}>Special Requests (optional)</label>
                                    <textarea name="special_requests" value={form.special_requests} onChange={handleChange} placeholder="Any special requests or requirements..." className="booking-input" style={{ resize: 'none', height: 80 }}></textarea>
                                </div>

                                {/* Live Price Summary Box */}
                                <div style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.4)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                                        <span style={{ color: '#666' }}>Room</span>
                                        <strong style={{ color: '#2C2C2C' }}>{room.name}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                                        <span style={{ color: '#666' }}>Dates</span>
                                        <strong style={{ color: '#2C2C2C' }}>{form.checkin_date ? form.checkin_date : '-'} to {form.checkout_date ? form.checkout_date : '-'}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                                        <span style={{ color: '#666' }}>Nights</span>
                                        <strong style={{ color: '#2C2C2C' }}>{totalNights}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                                        <span style={{ color: '#666' }}>Rate</span>
                                        <strong style={{ color: '#2C2C2C' }}>{room.price}</strong>
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(201,169,110,0.4)', margin: '12px 0' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                        <span style={{ color: '#2C2C2C' }}>Total Estimate</span>
                                        <span style={{ color: 'var(--accent-gold)' }}>{numericPrice > 0 && totalNights > 0 ? `₹${(numericPrice * totalNights).toLocaleString()}` : '—'}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{ width: '100%', background: 'var(--accent-gold)', color: '#fff', padding: '16px', borderRadius: 12, border: 'none', fontSize: '1.15rem', fontFamily: 'var(--font-serif)', fontWeight: 'bold', cursor: submitting ? 'wait' : 'pointer', transition: 'opacity 0.2s', opacity: submitting ? 0.7 : 1 }}
                                >
                                    {submitting ? 'Processing...' : 'Confirm Booking'}
                                </button>
                            </form>
                        </div>

                        {/* ── SUCCESS PANEL ── */}
                        {view === 'success' && (
                            <div className="modal-panel" ref={successRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%' }}>
                                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ marginBottom: 24 }}>
                                    <circle cx="40" cy="40" r="38" stroke="var(--accent-gold)" strokeWidth="3" fill="rgba(201,169,110,0.1)" className="success-circle" />
                                    <path d="M25 40 L35 50 L55 30" stroke="var(--accent-gold)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" className="success-check" />
                                </svg>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#2C2C2C', margin: '0 0 8px 0' }}>Booking Confirmed!</h2>

                                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, width: '100%', textAlign: 'left', marginBottom: 32 }}>
                                    <p style={{ margin: '0 0 8px', fontSize: '0.9rem' }}><strong style={{ color: '#666', display: 'inline-block', width: 90 }}>Guest:</strong> {form.guest_name}</p>
                                    <p style={{ margin: '0 0 8px', fontSize: '0.9rem' }}><strong style={{ color: '#666', display: 'inline-block', width: 90 }}>Room:</strong> {room.name}</p>
                                    <p style={{ margin: '0 0 8px', fontSize: '0.9rem' }}><strong style={{ color: '#666', display: 'inline-block', width: 90 }}>Check-in:</strong> {form.checkin_date}</p>
                                    <p style={{ margin: '0 0 8px', fontSize: '0.9rem' }}><strong style={{ color: '#666', display: 'inline-block', width: 90 }}>Check-out:</strong> {form.checkout_date}</p>
                                    <p style={{ margin: '0 0 8px', fontSize: '0.9rem' }}><strong style={{ color: '#666', display: 'inline-block', width: 90 }}>Nights:</strong> {totalNights}</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}><strong style={{ color: '#666', display: 'inline-block', width: 90, fontWeight: 'normal' }}>Total:</strong> {numericPrice > 0 && totalNights > 0 ? `₹${(numericPrice * totalNights).toLocaleString()}` : 'Contact for pricing'}</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
                                    <button onClick={handleClose} style={{ width: '100%', padding: '14px', borderRadius: 12, border: '1px solid var(--accent-gold)', backgroundColor: 'transparent', color: 'var(--accent-gold)', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>Close</button>
                                    <button onClick={() => { setView('details'); if (formRef.current) formRef.current.style.display = 'none'; }} style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>Make Another Booking</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
