import AdminDashboardClient from './AdminDashboardClient';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Manage bookings at Al Baith Rest House.',
  robots: 'noindex, nofollow',
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
