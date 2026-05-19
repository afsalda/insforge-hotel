import AdminLoginClient from './AdminLoginClient';

export const metadata = {
  title: 'Admin Login',
  description: 'Admin login portal for Al Baith Rest House management.',
  robots: 'noindex, nofollow',
};

export default function LoginPage() {
  return <AdminLoginClient />;
}
