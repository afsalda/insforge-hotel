/**
 * admin/dashboard.controller.js — Admin dashboard statistics and charts.
 */
import { insforge } from '../../config/index.js';
import { ApiResponse, asyncHandler } from '../../utils/index.js';

export const getStats = asyncHandler(async (req, res) => {
    const [users, listings, bookings, revenue] = await Promise.all([
        insforge.database.from('users').select('*', { count: 'exact' }),
        insforge.database.from('listings').select('*', { count: 'exact' }),
        insforge.database.from('bookings').select('*', { count: 'exact' }),
        insforge.database.from('bookings').select('pricing_total').eq('payment_status', 'paid'),
    ]);

    const totalRevenue = (revenue.data || []).reduce((sum, b) => sum + (b.pricing_total || 0), 0);

    ApiResponse.ok({
        totalUsers: users.count || 0,
        totalListings: listings.count || 0,
        totalBookings: bookings.count || 0,
        totalRevenue,
    }).send(res);
});

export const getCharts = asyncHandler(async (req, res) => {
    // Get bookings grouped by month (last 12 months)
    const { data: bookings } = await insforge.database
        .from('bookings')
        .select('created_at, pricing_total, status')
        .order('created_at', { ascending: true });

    // Build monthly data
    const monthlyData = {};
    (bookings || []).forEach((b) => {
        const month = new Date(b.created_at).toISOString().slice(0, 7);
        if (!monthlyData[month]) monthlyData[month] = { bookings: 0, revenue: 0 };
        monthlyData[month].bookings++;
        if (b.status === 'completed' || b.status === 'confirmed') {
            monthlyData[month].revenue += b.pricing_total || 0;
        }
    });

    ApiResponse.ok(monthlyData).send(res);
});

export const getRecentActivity = asyncHandler(async (req, res) => {
    const { data: recentBookings } = await insforge.database
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    const { data: recentUsers } = await insforge.database
        .from('users')
        .select('id, first_name, last_name, email, role, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    ApiResponse.ok({
        recentBookings: recentBookings || [],
        recentUsers: recentUsers || [],
    }).send(res);
});
