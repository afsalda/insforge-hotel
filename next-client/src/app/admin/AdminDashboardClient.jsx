'use client';

import { useState, useEffect } from 'react';
import {
    CreditCard, Users, Calendar, LayoutDashboard, Hotel,
    Settings, Bell, CheckCircle, Clock, ChevronLeft, Trash2,
    RefreshCw, DollarSign, LogOut, Menu, X, Plus, Edit,
    Mail, Phone, Briefcase, Calendar as CalendarIcon, Loader2, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as api from '@/lib/api';

export default function AdminDashboardPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [refreshing, setRefreshing] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('isAdminLoggedIn');
            localStorage.removeItem('adminUser');
        }
        router.push('/login');
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setRefreshing(true);
            const data = await api.getAllBookings();
            setBookings(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleDeleteBooking = async (id) => {
        if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to delete this booking?')) return;
        try {
            await api.deleteBooking(id);
            setBookings(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            alert('Delete failed: ' + err.message);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const updated = await api.updateBooking(id, { status: newStatus });
            setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
        } catch (err) {
            alert('Update failed: ' + err.message);
        }
    };

    const handleOpenModal = (booking = null) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleSaveBooking = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Match API expectations
        const payload = {
            guestName: data.guest_name,
            guestEmail: data.guest_email,
            guestPhone: data.guest_phone,
            roomId: data.room_id,
            listingTitle: data.room_id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            checkInDate: data.check_in_date,
            checkOutDate: data.check_out_date,
            guestsCount: Number(data.guests_count),
            totalPrice: Number(data.total_price),
            status: data.status || 'confirmed'
        };

        try {
            if (selectedBooking) {
                const updated = await api.updateBooking(selectedBooking.id, payload);
                setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, ...updated } : b));
            } else {
                const created = await api.createBooking(payload);
                setBookings(prev => [created, ...prev]);
            }
            setIsModalOpen(false);
        } catch (err) {
            alert('Save failed: ' + err.message);
        } finally {
            setFormLoading(false);
        }
    };

    // Stats
    const totalBookings = bookings.length;
    const uniqueGuests = new Set(bookings.map(b => b.guest_email)).size;
    const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return { bg: '#DCFCE7', color: '#166534' };
            case 'confirmed_offline_sync': return { bg: '#ECFDF5', color: '#065F46' };
            case 'pending': return { bg: '#FEF3C7', color: '#92400E' };
            case 'cancelled': return { bg: '#FEE2E2', color: '#991B1B' };
            case 'completed': return { bg: '#DBEAFE', color: '#1E40AF' };
            default: return { bg: '#F3F4F6', color: '#374151' };
        }
    };

    return (
        <div className="dashboard-container">
            <button 
                onClick={() => router.push('/')}
                className="checkout-back-btn"
                style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100 }}
            >
                <ChevronLeft size={24} color="var(--accent-gold)" />
            </button>
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <Link href="/" className="admin-brand">
                        <Hotel size={28} />
                        <span>Al Baith</span>
                    </Link>
                    <button
                        className="mobile-close-btn"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>
                <div style={{ padding: '0 1rem', marginBottom: '1.5rem' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
                        <ArrowLeft size={16} />
                    </Link>
                </div>
                <nav>
                    <div className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </div>
                    <div className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => { setActiveTab('bookings'); setMobileMenuOpen(false); }}>
                        <Calendar size={20} />
                        <span>Bookings</span>
                    </div>
                    <div className={`nav-link ${activeTab === 'guests' ? 'active' : ''}`} onClick={() => { setActiveTab('guests'); setMobileMenuOpen(false); }}>
                        <Users size={20} />
                        <span>Guests</span>
                    </div>
                    <div className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                        <Link href="/" className="nav-link" style={{ marginTop: '20px', padding: '12px', justifyContent: 'center' }}>
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="nav-link nav-link-danger" onClick={handleLogout} style={{ marginTop: '4px' }}>
                            <LogOut size={18} />
                            <span>Log Out</span>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <main className="dashboard-content">
                <div className="dashboard-header">
                    <div className="header-left">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="page-title-group">
                            <h1 className="page-title">
                                {activeTab === 'dashboard' && 'Dashboard Overview'}
                                {activeTab === 'bookings' && 'All Bookings'}
                                {activeTab === 'guests' && 'Guest Directory'}
                                {activeTab === 'settings' && 'System Settings'}
                            </h1>
                            <p className="page-subtitle">Welcome back, Admin</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button
                            onClick={() => handleOpenModal()}
                            className="btn-add-booking"
                        >
                            <Plus size={18} /> <span>Add Booking</span>
                        </button>
                        <button
                            onClick={fetchBookings}
                            className="btn-refresh"
                        >
                            <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
                        </button>
                        <div className="notification-pill">
                            <Bell size={20} color="var(--text-secondary)" />
                            {totalBookings > 0 && <span className="notification-dot" />}
                        </div>
                        <div className="admin-avatar-pro">AD</div>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">
                        <Clock className="spin-icon" style={{ marginRight: '0.5rem' }} /> Loading dashboard data...
                    </div>
                ) : error ? (
                    <div style={{ color: '#991B1B', padding: '2rem', background: '#fee2e2', borderRadius: '12px' }}>
                        Error: {error}. Is the backend server running on port 5000?
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        {activeTab === 'dashboard' && (
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-label">Total Bookings</div>
                                    <div className="stat-value">{totalBookings}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#10b981' }}>
                                        <CheckCircle size={14} />
                                        <span>{confirmedCount} confirmed</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">Total Guests</div>
                                    <div className="stat-value">{uniqueGuests}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <Users size={14} />
                                        <span>Unique guests</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">Total Revenue</div>
                                    <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#10b981' }}>
                                        <DollarSign size={14} />
                                        <span>From all bookings</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bookings Table */}
                        {(activeTab === 'dashboard' || activeTab === 'bookings') && (
                            <div className="table-container">
                                <div className="table-header-pro">
                                    <h3 className="table-title">
                                        {activeTab === 'dashboard' ? 'Recent Bookings' : `All Bookings (${totalBookings})`}
                                    </h3>
                                    {activeTab === 'dashboard' && totalBookings > 5 && (
                                        <button
                                            onClick={() => setActiveTab('bookings')}
                                            className="btn-view-all"
                                        >View All</button>
                                    )}
                                </div>
                                {bookings.length === 0 ? (
                                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        <Calendar size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                        <p>No bookings yet. They will appear here when guests book listings.</p>
                                    </div>
                                ) : (
                                    <div className="table-wrapper-pro">
                                        {/* Desktop View Table */}
                                        <div className="desktop-only-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Guest</th>
                                                        <th>Listing</th>
                                                        <th>Check-in</th>
                                                        <th>Check-out</th>
                                                        <th>Booking Time</th>
                                                        <th>Guests</th>
                                                        <th>Total</th>
                                                        <th>Status</th>
                                                        <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(activeTab === 'dashboard' ? bookings.slice(0, 5) : bookings).map((booking) => {
                                                        const sc = getStatusColor(booking.status);
                                                        return (
                                                            <tr key={booking.id}>
                                                                <td>
                                                                    <div style={{ fontWeight: 600, color: 'var(--text-charcoal)' }}>{booking.guest_name}</div>
                                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{booking.guest_email}</div>
                                                                </td>
                                                                <td style={{ maxWidth: '180px' }}>
                                                                    <div style={{
                                                                        fontWeight: 500,
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis'
                                                                    }}>
                                                                        {booking.listing_title || booking.room_id || '—'}
                                                                    </div>
                                                                </td>
                                                                <td className="num-font">{booking.check_in_date || '—'}</td>
                                                                <td className="num-font">{booking.check_out_date || '—'}</td>
                                                                <td style={{ fontSize: '0.82rem', color: 'var(--text-charcoal)' }}>
                                                                    <div style={{ fontWeight: 500 }} className="num-font">
                                                                        {booking.created_at ? new Date(booking.created_at).toLocaleDateString('en-IN', { dateStyle: 'short' }) : '—'}
                                                                    </div>
                                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }} className="num-font">
                                                                        {booking.created_at ? new Date(booking.created_at).toLocaleTimeString('en-IN', { timeStyle: 'short' }) : ''}
                                                                    </div>
                                                                </td>
                                                                <td className="num-font">{booking.guests_count || 1}</td>
                                                                <td style={{ fontWeight: 600 }} className="num-font">
                                                                    {booking.total_price ? `₹${Number(booking.total_price).toLocaleString()}` : '—'}
                                                                </td>
                                                                <td>
                                                                    <span style={{
                                                                        padding: '4px 10px', borderRadius: '20px',
                                                                        fontSize: '0.75rem', fontWeight: 600,
                                                                        background: sc.bg, color: sc.color,
                                                                        textTransform: 'capitalize'
                                                                    }}>
                                                                        {booking.status || 'unknown'}
                                                                    </span>
                                                                </td>
                                                                <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                        {booking.status === 'confirmed' && (
                                                                            <button
                                                                                onClick={() => updateStatus(booking.id, 'completed')}
                                                                                title="Mark Completed"
                                                                                style={{ padding: '4px 8px', border: '1px solid var(--border)', background: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                                                                            >✓ Done</button>
                                                                        )}
                                                                        {(booking.status === 'pending' || booking.status === 'confirmed_offline_sync') && (
                                                                            <button
                                                                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                                                                title="Confirm Booking"
                                                                                style={{ padding: '4px 8px', border: '1px solid #10b981', background: '#d1fae5', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#047857', whiteSpace: 'nowrap', fontWeight: 600 }}
                                                                            >✓ Confirm</button>
                                                                        )}
                                                                        {(booking.status === 'confirmed' || booking.status === 'pending' || booking.status === 'confirmed_offline_sync') && (
                                                                            <button
                                                                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                                                                title="Cancel Booking"
                                                                                style={{ padding: '4px 8px', border: '1px solid #FCA5A5', background: '#FEF2F2', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#991B1B', whiteSpace: 'nowrap', fontWeight: 600 }}
                                                                            >Cancel</button>
                                                                        )}
                                                                        <button
                                                                            onClick={() => handleOpenModal(booking)}
                                                                            title="Edit Booking"
                                                                            className="btn-action-edit"
                                                                            style={{ padding: '6px', border: '1px solid var(--border)', background: 'white', borderRadius: '8px', cursor: 'pointer' }}
                                                                        >
                                                                            <Edit size={14} color="var(--text-charcoal)" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteBooking(booking.id)}
                                                                            title="Delete Booking"
                                                                            className="btn-action-delete"
                                                                            style={{ padding: '6px', border: '1px solid #fee2e2', background: '#fef2f2', borderRadius: '8px', cursor: 'pointer' }}
                                                                        >
                                                                            <Trash2 size={14} color="#991B1B" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="mobile-only-cards">
                                            {(activeTab === 'dashboard' ? bookings.slice(0, 5) : bookings).map((booking) => {
                                                const sc = getStatusColor(booking.status);
                                                return (
                                                    <div key={booking.id} className="mobile-booking-card">
                                                        <div className="card-top">
                                                            <div className="guest-info">
                                                                <div className="guest-name">{booking.guest_name}</div>
                                                                <div className="guest-contact">{booking.guest_email}</div>
                                                            </div>
                                                            <span className="status-badge" style={{ background: sc.bg, color: sc.color }}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                        <div className="card-middle">
                                                            <div className="info-row">
                                                                <Hotel size={14} />
                                                                <span>{booking.listing_title || booking.room_id || '—'}</span>
                                                            </div>
                                                            <div className="info-row">
                                                                <CalendarIcon size={14} />
                                                                <span className="num-font">{booking.check_in_date} — {booking.check_out_date}</span>
                                                            </div>
                                                            <div className="price-row">
                                                                <div className="price-label">Total Amount</div>
                                                                <div className="price-value num-font">
                                                                    {booking.total_price ? `₹${Number(booking.total_price).toLocaleString()}` : '—'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-actions-row">
                                                            {booking.status === 'confirmed' && (
                                                                <button
                                                                    onClick={() => updateStatus(booking.id, 'completed')}
                                                                    className="mobile-action-btn done"
                                                                >Done</button>
                                                            )}
                                                            {(booking.status === 'pending' || booking.status === 'confirmed_offline_sync') && (
                                                                <button
                                                                    onClick={() => updateStatus(booking.id, 'confirmed')}
                                                                    className="mobile-action-btn confirm"
                                                                >Confirm</button>
                                                            )}
                                                            {(booking.status === 'confirmed' || booking.status === 'pending' || booking.status === 'confirmed_offline_sync') && (
                                                                <button
                                                                    onClick={() => updateStatus(booking.id, 'cancelled')}
                                                                    className="mobile-action-btn cancel"
                                                                >Cancel</button>
                                                            )}
                                                            <div style={{ flex: 1 }}></div>
                                                            <button
                                                                onClick={() => handleOpenModal(booking)}
                                                                className="mobile-icon-btn edit"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteBooking(booking.id)}
                                                                className="mobile-icon-btn delete"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Guest Directory Tab */}
                        {activeTab === 'guests' && (
                            <div className="table-container">
                                <div className="table-header-pro">
                                    <h3 className="table-title">Guest Directory ({uniqueGuests} guests)</h3>
                                </div>
                                <div className="table-wrapper-pro">
                                    <div className="desktop-only-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Bookings</th>
                                                    <th>Total Spent</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...new Map(bookings.map(b => [b.guest_email, b])).values()].map((guest) => {
                                                    const guestBookings = bookings.filter(b => b.guest_email === guest.guest_email);
                                                    const spent = guestBookings.reduce((s, b) => s + (Number(b.total_price) || 0), 0);
                                                    return (
                                                        <tr key={guest.guest_email}>
                                                            <td style={{ fontWeight: 600 }}>{guest.guest_name}</td>
                                                            <td>{guest.guest_email}</td>
                                                            <td className="num-font">{guest.guest_phone || '—'}</td>
                                                            <td className="num-font">{guestBookings.length}</td>
                                                            <td style={{ fontWeight: 600 }} className="num-font">₹{spent.toLocaleString()}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="table-container" style={{ padding: '2rem' }}>
                                <div style={{ maxWidth: '600px' }}>
                                    <h3 style={{ marginBottom: '1.5rem' }}>General Settings</h3>

                                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                                        <div className="form-group">
                                            <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Hotel Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Al Baith Hotel & Resort"
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#f9fafb' }}
                                                readOnly
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Admin Contact Email</label>
                                            <input
                                                type="email"
                                                defaultValue="albaith.booking@gmail.com"
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: '#f9fafb' }}
                                                readOnly
                                            />
                                        </div>

                                        <div style={{ borderTop: '1px solid var(--border-light)', pt: '1.5rem', marginTop: '1rem' }}>
                                            <button
                                                style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, opacity: 0.7, cursor: 'not-allowed' }}
                                            >
                                                Save Changes (Coming Soon)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
            {/* Booking Modal (CRUD) */}
            {isModalOpen && (
                <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
                    <div className="admin-modal-container">
                        <div className="admin-modal-header">
                            <div>
                                <h2>{selectedBooking ? 'Edit Booking' : 'New Manual Booking'}</h2>
                                <p>Fill in the details for the guest stay.</p>
                            </div>
                            <button className="modal-close-icon" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form className="admin-modal-form" onSubmit={handleSaveBooking}>
                            <div className="form-row">
                                <div className="form-group-pro">
                                    <label><Users size={14} /> Guest Name</label>
                                    <input type="text" name="guest_name" defaultValue={selectedBooking?.guest_name} required placeholder="Full Name" />
                                </div>
                                <div className="form-group-pro">
                                    <label><Mail size={14} /> Email Address</label>
                                    <input type="email" name="guest_email" defaultValue={selectedBooking?.guest_email} required placeholder="email@example.com" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group-pro">
                                    <label><Phone size={14} /> Phone Number</label>
                                    <input type="text" name="guest_phone" defaultValue={selectedBooking?.guest_phone} placeholder="+91 ..." />
                                </div>
                                <div className="form-group-pro">
                                    <label><Hotel size={14} /> Room Type</label>
                                    <select name="room_id" defaultValue={selectedBooking?.room_id || 'standard_room'}>
                                        <option value="standard_room">Standard Room</option>
                                        <option value="deluxe_room">Deluxe Room</option>
                                        <option value="suite_room">Suite Room</option>
                                        <option value="executive_room">Executive Room</option>
                                        <option value="apartments_1bhk">1BHK Apartment</option>
                                        <option value="apartments_2bhk">2BHK Apartment</option>
                                        <option value="apartments_3bhk">3BHK Apartment</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group-pro">
                                    <label><CalendarIcon size={14} /> Check-in</label>
                                    <input type="date" name="check_in_date" defaultValue={selectedBooking?.check_in_date} required />
                                </div>
                                <div className="form-group-pro">
                                    <label><CalendarIcon size={14} /> Check-out</label>
                                    <input type="date" name="check_out_date" defaultValue={selectedBooking?.check_out_date} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group-pro">
                                    <label><Users size={14} /> Guests</label>
                                    <input type="number" name="guests_count" defaultValue={selectedBooking?.guests_count || 1} min="1" max="10" />
                                </div>
                                <div className="form-group-pro">
                                    <label><DollarSign size={14} /> Total Price</label>
                                    <input type="number" name="total_price" defaultValue={selectedBooking?.total_price || 0} required />
                                </div>
                            </div>

                            <div className="form-group-pro">
                                <label><Clock size={14} /> Booking Status</label>
                                <select name="status" defaultValue={selectedBooking?.status || 'confirmed'}>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-save" disabled={formLoading}>
                                    {formLoading ? <Loader2 className="spin-icon" size={18} /> : (selectedBooking ? 'Update Booking' : 'Create Booking')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
