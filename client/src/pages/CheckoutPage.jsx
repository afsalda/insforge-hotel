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

    const formatDateRange = (start, end) => {
        if (!start || !end) return '';
        try {
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            const startDate = new Date(start);
            const endDate = new Date(end);

            // If same month and year, we can optionally simplify it, 
            // but standard "MMM D, YYYY – MMM D, YYYY" is what's requested
            return `${startDate.toLocaleDateString('en-US', options)} – ${endDate.toLocaleDateString('en-US', options)}`;
        } catch (e) {
            return `${start} – ${end}`;
        }
    };

    // Step 1 Form
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [bookingStatus, setBookingStatus] = useState('idle');
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    // Play premium success sound effect when booking is confirmed
    useEffect(() => {
        if (step === 4 && bookingStatus === 'success') {
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-win-confirmation-2033.mp3');
            audio.volume = 0.5;
            audio.play().catch(err => console.log('Audio playback prevented by browser:', err));
        }
    }, [step, bookingStatus]);

    const validateField = (name, value) => {
        let error = '';
        if (!value.trim()) {
            error = 'This field is required.';
        } else if (name === 'email' && !value.toLowerCase().endsWith('@gmail.com')) {
            error = 'Please enter a valid Gmail address (example@gmail.com).';
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

        if (nameError || emailError || phoneError) {
            return;
        }

        setStep(2);
    };

    const handleConfirmPayment = () => {
        setStep(3);
    };

    const handleAddPaymentAndBook = async () => {
        setBookingStatus('loading');
        setErrors(prev => ({ ...prev, api: '' }));

        try {
            const result = await createBooking({
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

            setConfirmedBooking(result);
            setBookingStatus('success');
            setStep(4);
        } catch (err) {
            setBookingStatus('error');
            // ── Meaningful Error Messages (Troubleshooting Skill Best Practice #3) ──
            let userMessage = 'Something went wrong. Please try again.';
            const raw = (err.message || '').toLowerCase();
            if (raw.includes('failed to fetch') || raw.includes('networkerror') || raw.includes('fetch')) {
                userMessage = 'Unable to connect to our servers. Please check your internet connection and try again.';
            } else if (raw.includes('no backend services') || raw.includes('503') || raw.includes('unavailable')) {
                userMessage = 'Our booking service is temporarily unavailable. Please try again in a few moments.';
            } else if (raw.includes('400') || raw.includes('bad request')) {
                userMessage = 'There was an issue with your booking details. Please review and try again.';
            } else if (err.message) {
                userMessage = err.message;
            }
            setErrors(prev => ({ ...prev, api: userMessage }));
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
                        <div className="success-booking-id">
                            Ref: {confirmedBooking?.booking_number || confirmedBooking?.id?.split('-')[0].toUpperCase()}
                        </div>

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
        <div className="checkout-main-wrapper">
            <div className="checkout-page-container">
                <div className="checkout-header-section">
                    <button onClick={() => navigate(-1)} className="checkout-back-btn" aria-label="Go back">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="checkout-page-title">Confirm and Pay</h1>
                </div>

                <div className="checkout-content-layout">
                    {/* Left Column (Process Steps) */}
                    <div className="checkout-steps-column">

                        {/* STEP 1: LOGIN/DETAILS */}
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
                                                placeholder="e.g. Muhammed Afsal"
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
                                            <label>Phone Number</label>
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
                                        </div>
                                    </div>

                                    {errors.api && <p className="error-message">{errors.api}</p>}

                                    <button onClick={handleConfirmDetails} className="btn-step-continue">
                                        Continue to Payment
                                    </button>
                                </div>
                            ) : (
                                <div className="step-content-collapsed">
                                    <p className="collapsed-info-text">Confirmed as <strong>{guestEmail}</strong></p>
                                </div>
                            )}
                        </div>

                        {/* STEP 2: PAYMENT */}
                        <div className={`checkout-card-pro ${step === 2 ? 'active-step' : step > 2 ? 'completed-step' : 'locked-step'}`}>
                            <div className="step-card-header">
                                <h2 className="step-card-title">2. Payment Method</h2>
                                {step === 2 && (
                                    <button onClick={handleConfirmPayment} className="btn-step-action-sm">
                                        Confirm
                                    </button>
                                )}
                                {step > 2 && (
                                    <div className="step-complete-badge">
                                        <CheckCircle2 size={18} /> <span>Paid</span>
                                    </div>
                                )}
                            </div>

                            {step === 2 && (
                                <div className="step-content-expanded">
                                    <div className="payment-gateway-info">
                                        <div className="secure-badge">
                                            <div className="pulse-dot"></div>
                                            Secure Al-Baith Encrypted Gateway
                                        </div>
                                        <p className="payment-subtext">Click the button above to authorize payment for this reservation.</p>
                                    </div>
                                </div>
                            )}

                            {step > 2 && (
                                <div className="step-content-collapsed">
                                    <p className="collapsed-info-text">Securely processed via <strong>Encrypted Gateway</strong></p>
                                </div>
                            )}
                        </div>

                        {/* STEP 3: REVIEW */}
                        <div className={`checkout-card-pro ${step === 3 ? 'active-step' : 'locked-step'}`}>
                            <div className="step-card-header">
                                <h2 className="step-card-title">3. Final Review</h2>
                                {step < 3 && <Lock size={20} className="step-lock-icon" />}
                            </div>

                            {step === 3 && (
                                <div className="step-content-expanded">
                                    <p className="step-description">Please double-check your arrival dates and guest information.</p>

                                    <div className="review-summary-box">
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
                                        <div className="review-stat">
                                            <span className="stat-label">Total Amount</span>
                                            <span className="stat-value highlight">₹{total}</span>
                                        </div>
                                    </div>

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
                                                    Booking Failed
                                                </p>
                                                <p style={{ color: '#B91C1C', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                                                    {errors.api}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleAddPaymentAndBook}
                                        className="btn-final-confirm"
                                        disabled={bookingStatus === 'loading'}
                                    >
                                        {bookingStatus === 'loading' ? (
                                            <><Loader2 size={20} className="spin-icon" /> Reserving...</>
                                        ) : (
                                            'Confirm and Reserve Now'
                                        )}
                                    </button>
                                    <p className="checkout-policy-text">
                                        By confirming, you agree to our <span className="underline">Terms of Service</span>.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column (Sidebar Summary) */}
                    <div className="checkout-sidebar-column">
                        <div className="sidebar-sticky-card">
                            <div className="sidebar-room-preview">
                                <div className="preview-img-container">
                                    <img src={listing.images[0]} alt={listing.title} className="preview-img" />
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
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
