"use client";
import { useState } from 'react';
import { createClient } from '@insforge/sdk';

// Initialize InsForge client
const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://hve9xz4u.us-east.insforge.app';
const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';
const insforge = createClient({ baseUrl: INSFORGE_URL, anonKey: INSFORGE_ANON_KEY });

function AnimatedCheckmark() {
    return (
        <div className="flex justify-center mb-6">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#C9A96E" strokeWidth="2" fill="rgba(201,169,110,0.1)" />
                <path
                    className="stroke-[#C9A96E] drop-shadow-[0_0_8px_rgba(201,169,110,0.5)] animate-[dash_0.8s_ease-out_forwards]"
                    d="M20 32 L28 40 L44 24"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                />
            </svg>
            <style>{`
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
        </div>
    );
}

export default function BookingForm() {
    const [form, setForm] = useState({
        guest_name: '', email: '', phone: '', room_type: '',
        checkin_date: '', checkout_date: '', num_guests: 1, special_requests: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        setSubmitError('');
    };

    const validate = () => {
        const errs = {};
        if (!form.guest_name.trim()) errs.guest_name = 'Required';
        if (!form.email.trim()) errs.email = 'Required';
        else if (!/^\\S+@\\S+\\.\\S+$/.test(form.email)) errs.email = 'Invalid email';
        if (!form.phone.trim()) errs.phone = 'Required';
        if (!form.room_type) errs.room_type = 'Required';
        if (!form.checkin_date) errs.checkin_date = 'Required';
        if (!form.checkout_date) errs.checkout_date = 'Required';
        if (form.checkin_date && form.checkout_date && form.checkout_date <= form.checkin_date) {
            errs.checkout_date = 'Must be after check-in';
        }
        if (!form.num_guests || form.num_guests < 1 || form.num_guests > 8) {
            errs.num_guests = '1-8 guests';
        }
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setSubmitting(true);
        setSubmitError('');

        try {
            const { data, error } = await insforge.database
                .from('bookings')
                .insert([{
                    guest_name: form.guest_name.trim(),
                    guest_email: form.email.trim(),
                    guest_phone: form.phone.trim(),
                    room_id: form.room_type,
                    check_in_date: form.checkin_date,
                    check_out_date: form.checkout_date,
                    listing_title: form.room_type,
                    guests_count: parseInt(form.num_guests),
                    special_requests: form.special_requests.trim(),
                    status: 'pending',
                    total_price: 0
                }])
                .select()
                .single();

            if (error) throw error;
            if (data) setSuccess(true);
        } catch (err) {
            console.error('Booking error:', err);
            setSubmitError(err.message || 'Booking failed.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-sm rounded-[24px] bg-[#162118]/80 backdrop-blur-xl border border-[#C9A96E]/20 p-8 text-center shadow-2xl shrink-0">
                <AnimatedCheckmark />
                <h3 className="font-serif text-2xl text-[#C9A96E] mb-2 font-light">Booking Confirmed!</h3>
                <p className="text-[#F5F0E8]/70 text-sm mb-6">We will contact you shortly.</p>
                <span className="block font-arabic text-[#C9A96E] text-2xl mb-8">شكراً لحجزك</span>
                <button
                    onClick={() => {
                        setSuccess(false);
                        setForm({ guest_name: '', email: '', phone: '', room_type: '', checkin_date: '', checkout_date: '', num_guests: 1, special_requests: '' });
                    }}
                    className="w-full py-3 border border-[#C9A96E] rounded-full text-[#C9A96E] text-xs font-bold tracking-widest uppercase hover:bg-[#C9A96E] hover:text-[#162118] transition-colors"
                >
                    Book Another Room
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[440px] rounded-[24px] bg-[#162118]/80 backdrop-blur-md border border-[#F5F0E8]/10 p-8 shadow-2xl shrink-0">
            <div className="flex justify-between items-end mb-8 border-b border-[#F5F0E8]/10 pb-4">
                <div>
                    <h3 className="font-serif text-[1.7rem] text-[#F5F0E8] leading-none mb-1">Reserve</h3>
                    <p className="text-[#C9A96E] text-sm tracking-wider uppercase font-semibold">Your Stay</p>
                </div>
                <span className="font-arabic text-2xl text-[#C9A96E]/60 leading-none">احجز إقامتك</span>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {submitError && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg mb-4">{submitError}</div>}

                <div className="space-y-1">
                    <input type="text" name="guest_name" value={form.guest_name} onChange={handleChange} placeholder="Full Name" className={`w-full bg-[#FAF9F6]/5 border ${errors.guest_name ? 'border-red-400' : 'border-[#F5F0E8]/10'} text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors placeholder:text-[#F5F0E8]/30`} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className={`w-full bg-[#FAF9F6]/5 border ${errors.email ? 'border-red-400' : 'border-[#F5F0E8]/10'} text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors placeholder:text-[#F5F0E8]/30`} />
                    </div>
                    <div className="space-y-1">
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className={`w-full bg-[#FAF9F6]/5 border ${errors.phone ? 'border-red-400' : 'border-[#F5F0E8]/10'} text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors placeholder:text-[#F5F0E8]/30`} />
                    </div>
                </div>

                <div className="space-y-1">
                    <select name="room_type" value={form.room_type} onChange={handleChange} className={`w-full bg-[#162118] border ${errors.room_type ? 'border-red-400' : 'border-[#F5F0E8]/10'} text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors appearance-none`}>
                        <option value="" disabled>Select Room Type</option>
                        <option value="Standard Room">Standard Room — ₹1,500/night</option>
                        <option value="Deluxe Room">Deluxe Room — ₹1,800/night</option>
                        <option value="Suite Room">Suite Room</option>
                        <option value="Apartments">Apartments</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <input type="date" name="checkin_date" value={form.checkin_date} onChange={handleChange} className={`w-full bg-[#162118] border ${errors.checkin_date ? 'border-red-400' : 'border-[#F5F0E8]/10'} text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors [color-scheme:dark]`} />
                    </div>
                    <div className="space-y-1">
                        <input type="date" name="checkout_date" value={form.checkout_date} onChange={handleChange} className={`w-full bg-[#162118] border ${errors.checkout_date ? 'border-red-400' : 'border-[#F5F0E8]/10'} text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors [color-scheme:dark]`} />
                    </div>
                </div>

                <div className="space-y-1">
                    <textarea name="special_requests" value={form.special_requests} onChange={handleChange} placeholder="Special requests (optional)" className="w-full bg-[#FAF9F6]/5 border border-[#F5F0E8]/10 text-[#F5F0E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors placeholder:text-[#F5F0E8]/30 min-h-[80px] resize-none"></textarea>
                </div>

                <button type="submit" disabled={submitting} className={`w-full bg-[#C9A96E] text-[#162118] font-bold uppercase tracking-widest text-xs py-4 rounded-xl mt-4 transition-all ${submitting ? 'opacity-70 cursor-wait' : 'hover:bg-[#D8BD8A] hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]'}`}>
                    {submitting ? 'Processing...' : 'Complete Booking'}
                </button>
            </form>
        </div>
    );
}
