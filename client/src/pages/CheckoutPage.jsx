import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Lock, Loader2, Star, Shield, MessageCircle } from 'lucide-react';
import { getListingDetail } from './ListingDetailPage';
import BookingConfirmationModal from '../components/BookingConfirmationModal';


/**
 * CheckoutPage — Razorpay 30% Deposit Flow
 *
 * Flow:
 * 1. Guest fills in details (name, email, phone)
 * 2. Clicks "Pay 30% Deposit" → Razorpay checkout opens
 * 3. On success → POST /api/verify-payment → WhatsApp sent to customer + owner
 * 4. Success screen shown
 */

// Load Razorpay SDK dynamically
function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export default function CheckoutPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { checkIn, checkOut, guestsCount, nights, total, subtotal, listing: stateListing } = location.state || {};
    const listing = stateListing || getListingDetail(id);

    useEffect(() => {
        if (!checkIn || !checkOut) {
            navigate(`/rooms/${id}`);
        }
        window.scrollTo(0, 0);
    }, [checkIn, checkOut, id, navigate]);

    // Steps: 1 = Details, 2 = Review & Pay, 3 = Success
    const [step, setStep] = useState(1);

    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [bookingStatus, setBookingStatus] = useState('idle');
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    // Redirect-fallback: if Razorpay redirected back with query params, verify payment
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paymentId = params.get('razorpay_payment_id');
        const orderId = params.get('razorpay_order_id');
        const signature = params.get('razorpay_signature');

        if (paymentId && orderId && signature) {
            const savedDetails = sessionStorage.getItem('pendingBooking');
            const bookingDetails = savedDetails ? JSON.parse(savedDetails) : {};

            fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_payment_id: paymentId,
                    razorpay_order_id: orderId,
                    razorpay_signature: signature,
                    bookingDetails,
                }),
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    sessionStorage.removeItem('pendingBooking');
                    setConfirmedBooking(data.data);
                    setBookingStatus('success');
                    setStep(3);
                    window.history.replaceState({}, '', window.location.pathname);
                }
            })
            .catch(err => console.error('Redirect verify failed:', err));
        }
    }, []);

    const depositAmount = Math.round(total * 0.3);
    const balanceAmount = total - depositAmount;



    const formatDateRange = (start, end) => {
        if (!start || !end) return '';
        try {
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return `${new Date(start).toLocaleDateString('en-US', options)} – ${new Date(end).toLocaleDateString('en-US', options)}`;
        } catch {
            return `${start} – ${end}`;
        }
    };

    const validateField = (name, value) => {
        let error = '';
        if (!value.trim()) {
            error = 'This field is required.';
        } else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Please enter a valid email address.';
        } else if (name === 'phone' && !/^\d{10}$/.test(value.replace(/\D/g, ''))) {
            error = 'Please enter a valid 10-digit phone number.';
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleConfirmDetails = () => {
        const nameError = validateField('name', guestName);
        const emailError = validateField('email', guestEmail);
        const phoneError = validateField('phone', guestPhone);
        if (nameError || emailError || phoneError) return;
        setStep(2);
    };

    // ─── Razorpay Payment Flow ───
    const handlePayDeposit = async () => {
        setBookingStatus('loading');
        setErrors(prev => ({ ...prev, api: '' }));

        try {
            // Step A: Load Razorpay SDK
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                throw new Error('Failed to load payment gateway. Please check your internet connection.');
            }

            // Step B: Create order on backend
            const orderRes = await fetch('/api/create-booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestName: guestName.trim(),
                    guestEmail: guestEmail.trim(),
                    guestPhone: guestPhone.trim(),
                    roomId: id,
                    checkInDate: checkIn,
                    checkOutDate: checkOut,
                    listingTitle: listing.title,
                    guestsCount: guestsCount || 1,
                    totalPrice: total || 0,
                    totalNights: nights || 1,
                }),
            });

            if (!orderRes.ok) {
                const errData = await orderRes.json().catch(() => ({}));
                throw new Error(errData.error || `Server error: ${orderRes.status}`);
            }

            const { data: orderData } = await orderRes.json();

            // Step C: Open Razorpay checkout
            const options = {
                key: orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Al Baith Rest House',
                description: `Deposit for ${listing.title}`,
                order_id: orderData.orderId,
                redirect: false,
                prefill: {
                    name: guestName.trim(),
                    email: guestEmail.trim(),
                    contact: guestPhone.trim(),
                },
                theme: {
                    color: '#1a5c3a',
                },
                handler: async function (response) {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
                    
                    // Step D: Verify payment on backend
                    try {
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_payment_id,
                                razorpay_order_id,
                                razorpay_signature,
                                bookingDetails: {
                                    bookingNumber: orderData.bookingNumber,
                                    guestName: guestName.trim(),
                                    guestEmail: guestEmail.trim(),
                                    guestPhone: guestPhone.trim(),
                                    listingTitle: listing.title,
                                    checkInDate: checkIn,
                                    checkOutDate: checkOut,
                                    totalPrice: total,
                                    depositAmount: orderData.depositAmount,
                                    guestsCount: guestsCount || 1,
                                    totalNights: nights || 1,
                                },
                            }),
                        });

                        if (!verifyRes.ok) {
                            const errData = await verifyRes.json().catch(() => ({}));
                            throw new Error(errData.error || 'Payment verification failed');
                        }

                        const { data: verifiedData } = await verifyRes.json();
                        
                        // Successfully verified -> Navigate/Show Success Screen
                        setConfirmedBooking(verifiedData);
                        setBookingStatus('success');
                        setStep(3);

                        // WhatsApp and Email notifications are triggered by the backend (verify-payment)
                    } catch (verifyErr) {
                        console.error('Verification error:', verifyErr);
                        setBookingStatus('error');
                        setErrors(prev => ({
                            ...prev,
                            api: `Payment received but verification failed. Ref: ${orderData.bookingNumber}. Please contact us.`,
                        }));
                    }
                },
                modal: {
                    ondismiss: function () {
                        setBookingStatus('idle');
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setBookingStatus('error');
                setErrors(prev => ({
                    ...prev,
                    api: response.error?.description || 'Payment failed. Please try again.',
                }));
            });
            sessionStorage.setItem('pendingBooking', JSON.stringify({
                bookingNumber: orderData.bookingNumber,
                guestName: guestName.trim(),
                guestEmail: guestEmail.trim(),
                guestPhone: guestPhone.trim(),
                listingTitle: listing.title,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                totalPrice: total,
                depositAmount: orderData.depositAmount,
                guestsCount: guestsCount || 1,
                totalNights: nights || 1,
            }));
            rzp.open();
        } catch (err) {
            setBookingStatus('error');
            let userMessage = 'Something went wrong. Please try again.';
            const raw = (err.message || '').toLowerCase();
            if (raw.includes('failed to fetch') || raw.includes('networkerror') || raw.includes('network')) {
                userMessage = 'Unable to connect to our servers. Please check your internet connection.';
            } else if (raw.includes('503') || raw.includes('unavailable')) {
                userMessage = 'Our booking service is temporarily unavailable. Please try again shortly.';
            } else if (err.message) {
                userMessage = err.message;
            }
            setErrors(prev => ({ ...prev, api: userMessage }));
        }
    };

    if (!checkIn || !checkOut) return null;

    // ─── SUCCESS SCREEN ───
    if (step === 3 && bookingStatus === 'success') {
        const bookingRef = confirmedBooking?.bookingNumber || confirmedBooking?.paymentId?.slice(0, 12) || 'ALB-PENDING';
        return (
            <BookingConfirmationModal
                booking={{
                  guestName: guestName,
                  guests: guestsCount,
                  ref: bookingRef,
                  roomType: listing.title,
                  checkIn: checkIn,
                  checkOut: checkOut,
                  nights: nights,
                  depositPaid: confirmedBooking?.depositAmount || depositAmount,
                  balanceDue: (confirmedBooking?.totalPrice || total) - (confirmedBooking?.depositAmount || depositAmount),
                  whatsappNumber: guestPhone,
                }}
                onClose={() => navigate('/')}
            />
        );
    }

    // ─── MAIN CHECKOUT UI ───
    return (
        <div className="checkout-main-wrapper">
            <Helmet>
                <title>Book a Room – Al Baith Rest House Ernakulam</title>
                <meta
                    name="description"
                    content="Complete your room booking at Al Baith Rest House, Ernakulam. Secure online payment. Instant confirmation. Best rates for stays near Lakeshore Hospital, Kochi."
                />
            </Helmet>
            <div className="checkout-page-container">
                <div className="checkout-header-section">
                    <button 
                        type="button"
                        onClick={() => {
                            if (window.history.length > 1) {
                                navigate(-1);
                            } else {
                                navigate('/');
                            }
                        }} 
                        className="checkout-back-btn" 
                        aria-label="Go back"
                    >
                        <ChevronLeft size={24} color="var(--accent-gold)" />
                    </button>
                    <h1 className="checkout-page-title">Confirm and Pay</h1>
                </div>

                <div className="checkout-content-layout">
                    {/* Left Column */}
                    <div className="checkout-steps-column">

                        {/* STEP 1: DETAILS */}
                        <div className={`checkout-card-pro ${step === 1 ? 'active-step' : 'completed-step'}`}>
                            <div className="step-card-header">
                                <h2 className="step-card-title">1. Your Details</h2>
                                {step > 1 && (
                                    <div className="step-complete-badge">
                                        <CheckCircle2 size={18} /> <span>Verified</span>
                                    </div>
                                )}
                            </div>

                            {step === 1 ? (
                                <div className="step-content-expanded">
                                    <p className="step-description">Enter your information to secure this reservation at Al-Baith.</p>
                                    <div className="checkout-input-grid">
                                        <div className="input-group-pro">
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                value={guestName}
                                                onChange={e => {
                                                    setGuestName(e.target.value);
                                                    if (errors.name) setErrors({ ...errors, name: '' });
                                                }}
                                                onBlur={e => validateField('name', e.target.value)}
                                                className={errors.name ? 'error' : ''}
                                                placeholder="e.g. John Doe"
                                            />
                                            {errors.name && <span className="error-message">{errors.name}</span>}
                                        </div>
                                        <div className="input-group-pro">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                value={guestEmail}
                                                onChange={e => {
                                                    setGuestEmail(e.target.value);
                                                    if (errors.email) setErrors({ ...errors, email: '' });
                                                }}
                                                onBlur={e => validateField('email', e.target.value)}
                                                className={errors.email ? 'error' : ''}
                                                placeholder="example@email.com"
                                            />
                                            {errors.email && <span className="error-message">{errors.email}</span>}
                                        </div>
                                        <div className="input-group-pro full-width">
                                            <label>Phone Number (WhatsApp)</label>
                                            <input
                                                type="tel"
                                                value={guestPhone}
                                                onChange={e => {
                                                    setGuestPhone(e.target.value);
                                                    if (errors.phone) setErrors({ ...errors, phone: '' });
                                                }}
                                                onBlur={e => validateField('phone', e.target.value)}
                                                className={errors.phone ? 'error' : ''}
                                                placeholder="9876543210"
                                            />
                                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                                            <span style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                                                Booking confirmation will be sent via WhatsApp
                                            </span>
                                        </div>
                                    </div>

                                    <button onClick={handleConfirmDetails} className="btn-step-continue">
                                        Continue to Payment
                                    </button>
                                </div>
                            ) : (
                                <div className="step-content-collapsed">
                                    <p className="collapsed-info-text">
                                        <strong>{guestName}</strong> · {guestEmail} · {guestPhone}
                                    </p>
                                    <button
                                        onClick={() => setStep(1)}
                                        style={{
                                            background: 'none', border: 'none', color: '#1a5c3a',
                                            cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline',
                                            padding: 0, marginTop: '4px'
                                        }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* STEP 2: REVIEW & PAY */}
                        <div className={`checkout-card-pro ${step === 2 ? 'active-step' : 'locked-step'}`}>
                            <div className="step-card-header">
                                <h2 className="step-card-title">2. Review & Pay Deposit</h2>
                                {step < 2 && <Lock size={20} className="step-lock-icon" />}
                            </div>

                            {step === 2 && (
                                <div className="step-content-expanded">
                                    <p className="step-description">Review your booking and pay the 30% deposit to confirm.</p>

                                    {/* Booking Summary */}
                                    <div className="review-summary-box">
                                        <div className="review-stat">
                                            <span className="stat-label">Room</span>
                                            <span className="stat-value">{listing.title}</span>
                                        </div>
                                        <div className="review-stat">
                                            <span className="stat-label">Dates</span>
                                            <span className="stat-value">{formatDateRange(checkIn, checkOut)}</span>
                                        </div>
                                        <div className="review-stat">
                                            <span className="stat-label">Guests</span>
                                            <span className="stat-value">{guestsCount} Guest{guestsCount > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="review-stat">
                                            <span className="stat-label">Guest</span>
                                            <span className="stat-value">{guestName}</span>
                                        </div>
                                    </div>

                                    {/* Payment Breakdown */}
                                    <div style={{
                                        background: '#F8FAFC',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        marginBottom: '16px',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: '#713f12', fontSize: '0.9rem' }}>Total Booking Amount</span>
                                            <span style={{ color: '#713f12', fontWeight: 600 }}>₹{total}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: '#166534', fontSize: '0.9rem', fontWeight: 600 }}>
                                                30% Deposit (Pay Now)
                                            </span>
                                            <strong style={{ color: '#166534', fontSize: '1.1rem' }}>₹{depositAmount}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#713f12', fontSize: '0.85rem' }}>Balance at Check-in</span>
                                            <span style={{ color: '#713f12', fontSize: '0.9rem' }}>₹{balanceAmount}</span>
                                        </div>
                                    </div>

                                    {/* Secure Badge */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        marginBottom: '16px', padding: '10px 14px',
                                        background: '#f0fdf4', borderRadius: '8px',
                                        border: '1px solid #bbf7d0'
                                    }}>
                                        <Shield size={16} color="#16a34a" />
                                        <span style={{ fontSize: '0.82rem', color: '#15803d' }}>
                                            Secured by Razorpay — 256-bit encryption
                                        </span>
                                    </div>

                                    {/* Error Display */}
                                    {errors.api && (
                                        <div style={{
                                            background: '#FEF2F2',
                                            border: '1px solid #FECACA',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px'
                                        }}>
                                            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>⚠️</span>
                                            <div>
                                                <p style={{ color: '#991B1B', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 4px' }}>
                                                    Payment Failed
                                                </p>
                                                <p style={{ color: '#B91C1C', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                                                    {errors.api}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handlePayDeposit}
                                        className="btn-final-confirm"
                                        disabled={bookingStatus === 'loading'}
                                    >
                                        {bookingStatus === 'loading' ? (
                                            <><Loader2 size={20} className="spin-icon" /> Processing...</>
                                        ) : (
                                            `Pay ₹${depositAmount} Deposit`
                                        )}
                                    </button>

                                    <p className="checkout-policy-text">
                                        Remaining ₹{balanceAmount} is payable at check-in. By confirming, you agree to our{' '}
                                        <span className="underline" onClick={() => navigate('/cancellation-policy')} style={{ cursor: 'pointer' }}>
                                            Cancellation Policy
                                        </span>.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="checkout-sidebar-column">
                        <div className="sidebar-sticky-card">
                            <div className="sidebar-room-preview">
                                <div className="preview-img-container">
                                    <img src={listing.images[0]} alt={`${listing.title} – Al Baith Rest House, Ernakulam, Kerala`} className="preview-img" />
                                </div>
                                <div className="preview-info">
                                    <span className="preview-location">{listing.location || 'Al Baith Hotel'}</span>
                                    <h3 className="preview-title">{listing.title}</h3>
                                    <div className="preview-rating">
                                        <Star size={14} className="star-filled" />
                                        <span className="rating-score">{listing.rating}</span>
                                        <span className="rating-count">({listing.reviews} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="price-details-section">
                                <h3 className="section-title-sm">Price Details</h3>
                                <div className="price-row">
                                    <span>₹{listing.price} × {nights} nights</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="price-row">
                                    <span>Cleaning fee</span>
                                    <span>₹{listing.cleaningFee}</span>
                                </div>
                                <div className="price-row">
                                    <span>Service fee</span>
                                    <span>₹{listing.serviceFee}</span>
                                </div>
                            </div>

                            <div className="total-price-section">
                                <span className="total-label">Total Amount</span>
                                <span className="total-value">₹{total}</span>
                            </div>

                            <div style={{
                                borderTop: '1px solid #e5e7eb',
                                paddingTop: '16px',
                                marginTop: '8px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontWeight: 600, color: '#166534' }}>Pay Now (30%)</span>
                                    <span style={{ fontWeight: 700, color: '#166534', fontSize: '1.05rem' }}>₹{depositAmount}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Due at Check-in</span>
                                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>₹{balanceAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
