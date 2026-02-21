import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Lock, Loader2, Star, CheckCircle } from 'lucide-react';
import { getListingDetail } from './ListingDetailPage';
import { createBooking } from '../lib/api';

export default function CheckoutPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // The data passed from previous route via "navigate('/book/id', { state: {...} })"
    const { checkIn, checkOut, guestsCount, nights, total, subtotal, listing: stateListing } = location.state || {};

    // We fetch the listing manually if not in state
    const listing = stateListing || getListingDetail(id);

    // If user loaded the page without dates, redirect back
    useEffect(() => {
        if (!checkIn || !checkOut) {
            navigate(`/room/${id}`);
        }
        window.scrollTo(0, 0);
    }, [checkIn, checkOut, id, navigate]);

    // Flow steps: 1: Details, 2: Payment, 3: Review, 4: Success
    const [step, setStep] = useState(1);

    // Step 1 Form
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [bookingStatus, setBookingStatus] = useState('idle');

    // Play premium success sound effect when booking is confirmed
    useEffect(() => {
        if (step === 4 && bookingStatus === 'success') {
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-win-confirmation-2033.mp3');
            audio.volume = 0.5;
            audio.play().catch(err => console.log('Audio playback prevented by browser:', err));
        }
    }, [step, bookingStatus]);

    const handleConfirmDetails = () => {
        if (!guestName.trim() || !guestEmail.trim()) {
            setErrorMsg('Name and email are required to continue.');
            return;
        }
        setErrorMsg('');
        setStep(2);
    };

    const handleConfirmPayment = () => {
        setStep(3);
    };

    const handleAddPaymentAndBook = async () => {
        setBookingStatus('loading');
        setErrorMsg('');

        try {
            await createBooking({
                guestName: guestName.trim(),
                guestEmail: guestEmail.trim(),
                guestPhone: guestPhone.trim(),
                roomId: `${id}`,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                listingTitle: listing.title,
                guestsCount: guestsCount || 1,
                totalPrice: total || 0,
                status: 'pending',
                totalNights: nights || 1,
                extraBed: false,
                specialRequests: ''
            });

            setBookingStatus('success');
            setStep(4);
        } catch (err) {
            setBookingStatus('error');
            setErrorMsg(err.message);
        }
    };

    if (!checkIn || !checkOut) return null; // Avoid render crash while redirecting

    if (step === 4 && bookingStatus === 'success') {
        return (
            <div className="checkout-success-page">
                <div className="checkout-success-container">
                    <div className="success-modal-animated checkout-success-card">
                        <div className="icon-container-success">
                            <div className="check-circle-wrapper">
                                <svg className="check-svg" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="success-title">Booking Confirmed!</h2>

                        <div className="success-details-group">
                            <p className="success-room-type">{listing.title}</p>
                            <div className="success-booking-summary">
                                <span>{checkIn}</span>
                                <span className="summary-arrow">→</span>
                                <span>{checkOut}</span>
                                <span className="summary-divider">·</span>
                                <span>{guestsCount} guest{guestsCount > 1 ? 's' : ''}</span>
                                <span className="summary-divider">·</span>
                                <strong className="success-price">₹{total}</strong>
                            </div>
                            <p className="success-confirmation-msg">
                                Your reservation has been securely saved. A confirmation email has been sent to <strong className="success-email">{guestEmail}</strong>.
                            </p>
                        </div>

                        <div className="success-action-area">
                            <button
                                className="btn-success-return"
                                onClick={() => navigate('/')}
                            >
                                Return Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page-content" style={{ maxWidth: '1120px', margin: '0 auto', padding: '120px 24px 80px', fontFamily: 'var(--font-sans)', color: 'var(--text-charcoal)' }}>
            <div className="checkout-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-8px' }} className="hover-bg-gray checkout-back">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="checkout-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', letterSpacing: '0.02em', margin: 0, textTransform: 'uppercase' }}>
                    Confirm and pay
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '80px', alignItems: 'flex-start' }} className="checkout-layout">
                {/* Left Column (Accordion Steps) */}
                <div style={{ flex: 1, display: 'flex', gap: '24px', flexDirection: 'column' }}>

                    {/* STEP 1 */}
                    <div className="checkout-step-card login-step-card" style={{ border: '1px solid #EBEBEB', borderRadius: '16px', padding: '24px', background: 'white' }}>
                        <div className="checkout-step-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: step === 1 ? '24px' : '8px' }}>
                            <h2 className="checkout-step-title" style={{ fontSize: '1.35rem', margin: 0 }}>1. Log in or sign up</h2>
                            {step > 1 && (
                                <div className="checkout-success-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '1rem' }}>
                                    <CheckCircle2 size={20} /> Logged in
                                </div>
                            )}
                        </div>

                        {step === 1 ? (
                            <div>
                                <p style={{ color: '#717171', marginBottom: '20px' }}>Please provide your details below to securely log your reservation.</p>
                                <div className="checkout-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Full Name *</label>
                                        <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} style={{ width: '100%', padding: '14px', border: '1px solid #B0B0B0', borderRadius: '8px', fontSize: '1rem' }} placeholder="Jane Doe" />
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Email Address *</label>
                                        <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} style={{ width: '100%', padding: '14px', border: '1px solid #B0B0B0', borderRadius: '8px', fontSize: '1rem' }} placeholder="jane@example.com" />
                                    </div>
                                </div>
                                <div className="form-group" style={{ margin: 0, marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Phone Number</label>
                                    <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} style={{ width: '100%', padding: '14px', border: '1px solid #B0B0B0', borderRadius: '8px', fontSize: '1rem' }} placeholder="+1 (555) 000-0000" />
                                </div>

                                {errorMsg && <p style={{ color: '#e11d48', fontSize: '0.9rem', marginBottom: '16px' }}>{errorMsg}</p>}

                                <button onClick={handleConfirmDetails} style={{ background: '#222222', color: 'white', padding: '14px 24px', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                                    Continue
                                </button>
                            </div>
                        ) : (
                            <p className="checkout-connected-text" style={{ color: '#717171', margin: 0, fontSize: '1rem' }}>Connected as {guestEmail}</p>
                        )}
                    </div>

                    {/* STEP 2 */}
                    <div className="checkout-step-card payment-step-card" style={{ border: '1px solid #EBEBEB', borderRadius: '16px', padding: '24px', background: 'white', opacity: step >= 2 ? 1 : 0.6 }}>
                        <div className="checkout-step-header payment-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 className="checkout-step-title payment-title" style={{ fontSize: '1.35rem', margin: 0, color: step >= 2 ? '#222' : '#B0B0B0' }}>2. Add a payment method</h2>
                            {step === 2 && (
                                <button
                                    onClick={handleConfirmPayment}
                                    style={{ background: '#222222', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Confirm Payment
                                </button>
                            )}
                            {step > 2 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '1rem' }}>
                                    <CheckCircle2 size={20} /> Paid
                                </div>
                            )}
                        </div>
                        {step === 2 && (
                            <p className="checkout-secure-text" style={{ color: '#717171', margin: '16px 0 0 0', fontSize: '1rem' }}>Secure payment via Al-Baith encrypted gateway.</p>
                        )}
                        {step > 2 && (
                            <p className="checkout-paid-text" style={{ color: '#717171', margin: '8px 0 0 0', fontSize: '1rem' }}>Card ending in •••• 1234</p>
                        )}
                    </div>

                    {/* STEP 3 */}
                    <div className="checkout-step-card review-step-card" style={{ border: '1px solid #EBEBEB', borderRadius: '16px', padding: '24px', background: 'white', opacity: step >= 3 ? 1 : 0.6 }}>
                        <div className="checkout-step-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: step === 3 ? '16px' : '0' }}>
                            <h2 className="checkout-step-title" style={{ fontSize: '1.35rem', margin: 0, color: step >= 3 ? '#222' : '#B0B0B0' }}>3. Review your reservation</h2>
                            {step < 3 && <Lock size={24} color="#B0B0B0" className="checkout-lock-icon" />}
                        </div>

                        {step === 3 && (
                            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                                <p style={{ color: '#717171', marginBottom: '24px' }}>Please review your booking details before final confirmation.</p>

                                <div style={{ background: '#F7F7F7', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#717171', margin: '0 0 4px 0' }}>Dates</h4>
                                            <p style={{ margin: 0, fontWeight: 500 }}>{checkIn} – {checkOut}</p>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#717171', margin: '0 0 4px 0' }}>Guests</h4>
                                            <p style={{ margin: 0, fontWeight: 500 }}>{guestsCount} guest{guestsCount > 1 ? 's' : ''}</p>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#717171', margin: '0 0 4px 0' }}>Guest Details</h4>
                                            <p style={{ margin: 0, fontWeight: 500 }}>{guestName}</p>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#717171' }}>{guestEmail}</p>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#717171', margin: '0 0 4px 0' }}>Total Cost</h4>
                                            <p style={{ margin: 0, fontWeight: 600, color: 'var(--accent-gold)' }}>₹{total}</p>
                                        </div>
                                    </div>
                                </div>

                                {errorMsg && <p style={{ color: '#e11d48', fontSize: '0.9rem', marginBottom: '16px' }}>{errorMsg}</p>}

                                <button
                                    onClick={handleAddPaymentAndBook}
                                    style={{ background: 'var(--accent-gold)', color: 'white', padding: '16px 32px', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 700, cursor: bookingStatus === 'loading' ? 'wait' : 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    disabled={bookingStatus === 'loading'}
                                >
                                    {bookingStatus === 'loading' ? <><Loader2 size={20} className="spin-icon" /> Completing Booking...</> : 'Confirm and Reserve Room'}
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#717171', marginTop: '12px' }}>
                                    By selecting the button above, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Column (Booking Details Card) */}
                <div className="booking-sidebar" style={{ width: '400px', flexShrink: 0 }}>
                    <div className="checkout-room-summary-card" style={{ position: 'sticky', top: '120px', border: '1px solid #EBEBEB', borderRadius: '16px', padding: '24px', background: 'white', boxShadow: '0 6px 16px rgba(0,0,0,0.06)' }}>
                        <div className="summary-room-info" style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #EBEBEB', paddingBottom: '24px', marginBottom: '24px' }}>
                            <img src={listing.images[0]} alt={listing.title} className="summary-room-img" style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div className="summary-details">
                                <p className="summary-label" style={{ fontSize: '0.85rem', color: '#717171', margin: '0 0 4px 0' }}>{listing.location === 'Al Baith Hotel' ? 'Al Baith Hotel' : listing.location}</p>
                                <h3 className="summary-title" style={{ fontSize: '1rem', margin: '0 0 8px 0', fontWeight: 500, lineHeight: 1.3 }}>{listing.title}</h3>
                                <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Star size={12} fill="#222" /> <strong>{listing.rating}</strong> ({listing.reviews} reviews)
                                </div>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.35rem', marginBottom: '24px' }}>Price details</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#222' }}>
                                <span>₹{listing.price} x {nights} nights</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#222' }}>
                                <span>Cleaning fee</span>
                                <span>₹{listing.cleaningFee}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#222' }}>
                                <span>Al-Baith service fee</span>
                                <span>₹{listing.serviceFee}</span>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #EBEBEB', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                            <span>Total (USD)</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                @media (max-width: 900px) {
                    .checkout-page-content {
                        padding: 100px 16px 80px !important;
                    }
                    .checkout-header {
                        margin-bottom: 24px !important;
                        gap: 8px !important;
                    }
                    .checkout-title {
                        font-size: 1.8rem !important;
                        line-height: 1.2 !important;
                    }
                    .checkout-layout {
                        flex-direction: column;
                        gap: 32px !important;
                    }
                    .checkout-form-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .booking-sidebar {
                        width: 100% !important;
                        margin-bottom: 0;
                    }
                }
                .hover-bg-gray:hover {
                    background-color: #f3f4f6 !important;
                }
                .spin-icon {
                    animation: spin 1s infinite linear;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                /* Success Animation Styles moved to index.css */
            `}</style>
        </div>
    );
}
