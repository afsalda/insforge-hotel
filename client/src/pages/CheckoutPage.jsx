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
            <div className="checkout-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '16px', border: '1px solid #EBEBEB', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '500px', width: '100%' }}>
                    <CheckCircle size={64} color="#10b981" style={{ marginBottom: '16px', display: 'inline-block' }} />
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>Booking Confirmed!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '1.1rem' }}>
                        {listing.title}
                    </p>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        {checkIn} → {checkOut} · {guestsCount} guest{guestsCount > 1 ? 's' : ''} · <strong>₹{total}</strong>
                    </p>
                    <p style={{ fontSize: '0.9rem', marginTop: '24px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        Your reservation has been securely saved to the Al-Baith systems. A confirmation email has been sent to <strong>{guestEmail}</strong>.
                    </p>
                    <button
                        className="reserve-btn"
                        style={{ marginTop: '32px', maxWidth: '300px' }}
                        onClick={() => navigate('/')}
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page" style={{ maxWidth: '1120px', margin: '0 auto', padding: '120px 24px 80px', fontFamily: 'var(--font-sans)', color: 'var(--text-charcoal)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-bg-gray">
                    <ChevronLeft size={24} />
                </button>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', letterSpacing: '0.02em', margin: 0, textTransform: 'uppercase' }}>
                    Confirm and pay
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '80px', alignItems: 'flex-start' }} className="checkout-layout">
                {/* Left Column (Accordion Steps) */}
                <div style={{ flex: 1, display: 'flex', gap: '24px', flexDirection: 'column' }}>

                    {/* STEP 1 */}
                    <div style={{ border: '1px solid #EBEBEB', borderRadius: '16px', padding: '24px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: step === 1 ? '24px' : '8px' }}>
                            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>1. Log in or sign up</h2>
                            {step > 1 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '1rem' }}>
                                    <CheckCircle2 size={20} /> Logged in
                                </div>
                            )}
                        </div>

                        {step === 1 ? (
                            <div>
                                <p style={{ color: '#717171', marginBottom: '20px' }}>Please provide your details below to securely log your reservation.</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
                            <p style={{ color: '#717171', margin: 0, fontSize: '1rem' }}>Connected as {guestEmail}</p>
                        )}
                    </div>

                    {/* STEP 2 */}
                    <div style={{ border: '1px solid #EBEBEB', borderRadius: '16px', padding: '24px', background: 'white', opacity: step >= 2 ? 1 : 0.6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.35rem', margin: 0, color: step >= 2 ? '#222' : '#B0B0B0' }}>2. Add a payment method</h2>
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
                            <p style={{ color: '#717171', margin: '16px 0 0 0', fontSize: '1rem' }}>Secure payment via Al-Baith encrypted gateway.</p>
                        )}
                        {step > 2 && (
                            <p style={{ color: '#717171', margin: '8px 0 0 0', fontSize: '1rem' }}>Card ending in •••• 1234</p>
                        )}
                    </div>

                    {/* STEP 3 */}
                    <div style={{ border: '1px solid #EBEBEB', borderRadius: '16px', padding: '24px', background: 'white', opacity: step >= 3 ? 1 : 0.6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: step === 3 ? '16px' : '0' }}>
                            <h2 style={{ fontSize: '1.35rem', margin: 0, color: step >= 3 ? '#222' : '#B0B0B0' }}>3. Review your reservation</h2>
                            {step < 3 && <Lock size={24} color="#B0B0B0" />}
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
                    <div style={{ position: 'sticky', top: '120px', border: '1px solid #EBEBEB', borderRadius: '16px', padding: '24px', background: 'white', boxShadow: '0 6px 16px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #EBEBEB', paddingBottom: '24px', marginBottom: '24px' }}>
                            <img src={listing.images[0]} alt={listing.title} style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div>
                                <p style={{ fontSize: '0.85rem', color: '#717171', margin: '0 0 4px 0' }}>{listing.location}</p>
                                <h3 style={{ fontSize: '1rem', margin: '0 0 8px 0', fontWeight: 500, lineHeight: 1.3 }}>{listing.title}</h3>
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
                    .checkout-layout {
                        flex-direction: column-reverse;
                    }
                    .booking-sidebar {
                        width: 100% !important;
                        margin-bottom: 32px;
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
            `}</style>
        </div>
    );
}
