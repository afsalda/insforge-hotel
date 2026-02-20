import { useState, useEffect } from 'react';
import {
    CreditCard, Users, Calendar, LayoutDashboard, Hotel,
    Settings, Bell, CheckCircle, Clock, ArrowLeft, Trash2,
    RefreshCw, DollarSign, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../lib/api.js';

export default function AdminDashboardPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [refreshing, setRefreshing] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
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
        if (!confirm('Are you sure you want to delete this booking?')) return;
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
            setBookings(prev => prev.map(b => b.id === id ? updated : b));
        } catch (err) {
            alert('Update failed: ' + err.message);
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
            case 'pending': return { bg: '#FEF3C7', color: '#92400E' };
            case 'cancelled': return { bg: '#FEE2E2', color: '#991B1B' };
            case 'completed': return { bg: '#DBEAFE', color: '#1E40AF' };
            default: return { bg: '#F3F4F6', color: '#374151' };
        }
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <Link to="/" className="admin-brand">
                    <Hotel size={28} />
                    <span>Al Baith</span>
                </Link>
                <nav>
                    <div className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </div>
                    <div className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                        <Calendar size={20} />
                        <span>Bookings</span>
                    </div>
                    <div className={`nav-link ${activeTab === 'guests' ? 'active' : ''}`} onClick={() => setActiveTab('guests')}>
                        <Users size={20} />
                        <span>Guests</span>
                    </div>
                    <div className="nav-link">
                        <Settings size={20} />
                        <span>Settings</span>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                        <Link to="/" className="nav-link" style={{ marginTop: '20px' }}>
                            <ArrowLeft size={18} />
                            <span>Back to Home</span>
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
                    <div>
                        <h1 className="page-title">
                            {activeTab === 'dashboard' && 'Dashboard Overview'}
                            {activeTab === 'bookings' && 'All Bookings'}
                            {activeTab === 'guests' && 'Guest Directory'}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Admin</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button
                            onClick={fetchBookings}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)',
                                background: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
                            }}
                        >
                            <RefreshCw size={14} className={refreshing ? 'spin-icon' : ''} /> Refresh
                        </button>
                        <div style={{ position: 'relative' }}>
                            <Bell size={20} color="var(--text-secondary)" />
                            {totalBookings > 0 && <span style={{
                                position: 'absolute', top: -2, right: -2,
                                width: 8, height: 8, background: 'var(--primary)',
                                borderRadius: '50%'
                            }} />}
                        </div>
                        <div style={{
                            width: 40, height: 40, background: '#e0e7ff',
                            borderRadius: '50%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: '#4F46E5', fontWeight: 'bold', fontSize: '0.9rem'
                        }}>AD</div>
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
                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                                        {activeTab === 'dashboard' ? 'Recent Bookings' : `All Bookings (${totalBookings})`}
                                    </h3>
                                    {activeTab === 'dashboard' && totalBookings > 5 && (
                                        <button
                                            onClick={() => setActiveTab('bookings')}
                                            style={{
                                                padding: '6px 14px', background: 'var(--primary)',
                                                color: 'white', border: 'none', borderRadius: '8px',
                                                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
                                            }}
                                        >View All</button>
                                    )}
                                </div>
                                {bookings.length === 0 ? (
                                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        <Calendar size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                        <p>No bookings yet. They will appear here when guests book listings.</p>
                                    </div>
                                ) : (
                                    <div style={{ overflowY: 'auto', overflowX: 'auto', flex: 1, position: 'relative' }}>
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
                                                            <td>{booking.check_in_date || '—'}</td>
                                                            <td>{booking.check_out_date || '—'}</td>
                                                            <td style={{ fontSize: '0.82rem', color: 'var(--text-charcoal)' }}>
                                                                <div style={{ fontWeight: 500 }}>
                                                                    {booking.created_at ? new Date(booking.created_at).toLocaleDateString('en-IN', { dateStyle: 'short' }) : '—'}
                                                                </div>
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                                    {booking.created_at ? new Date(booking.created_at).toLocaleTimeString('en-IN', { timeStyle: 'short' }) : ''}
                                                                </div>
                                                            </td>
                                                            <td>{booking.guests_count || 1}</td>
                                                            <td style={{ fontWeight: 600 }}>
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
                                                                    {booking.status === 'pending' && (
                                                                        <button
                                                                            onClick={() => updateStatus(booking.id, 'confirmed')}
                                                                            title="Confirm Booking"
                                                                            style={{ padding: '4px 8px', border: '1px solid #10b981', background: '#d1fae5', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#047857', whiteSpace: 'nowrap', fontWeight: 600 }}
                                                                        >✓ Confirm</button>
                                                                    )}
                                                                    {(booking.status === 'confirmed' || booking.status === 'pending') && (
                                                                        <button
                                                                            onClick={() => updateStatus(booking.id, 'cancelled')}
                                                                            title="Cancel Booking"
                                                                            style={{ padding: '4px 8px', border: '1px solid #FCA5A5', background: '#FEF2F2', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#991B1B', whiteSpace: 'nowrap', fontWeight: 600 }}
                                                                        >Cancel</button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleDeleteBooking(booking.id)}
                                                                        title="Delete Booking"
                                                                        style={{ padding: '4px 6px', border: '1px solid var(--border)', background: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                                )}
                            </div>
                        )}

                        {/* Guest Directory Tab */}
                        {activeTab === 'guests' && (
                            <div className="table-container">
                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Guest Directory ({uniqueGuests} guests)</h3>
                                </div>
                                <div style={{ overflowY: 'auto', overflowX: 'auto', flex: 1, position: 'relative' }}>
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
                                                        <td>{guest.guest_phone || '—'}</td>
                                                        <td>{guestBookings.length}</td>
                                                        <td style={{ fontWeight: 600 }}>₹{spent.toLocaleString()}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
