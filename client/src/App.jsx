import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ApartmentsPage from './pages/ApartmentsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import CancellationPolicy from './pages/CancellationPolicy';
import './index.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Disable Lenis on Admin routes to prevent scroll/interaction conflicts
    if (window.location.pathname.startsWith('/admin')) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const Lenis = window.Lenis;

    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    let lenis;
    if (Lenis) {
      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      if (lenis) {
        lenis.destroy();
        gsap.ticker.remove(lenis.raf);
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Layout */}
        <Route path="/" element={
          <>
            <Navbar />
            <HomePage />
            <Footer />
          </>
        } />

        <Route path="/apartments" element={
          <>
            <Navbar />
            <ApartmentsPage />
            <Footer />
          </>
        } />

        <Route path="/room/:id" element={
          <>
            <Navbar />
            <ListingDetailPage />
            <Footer />
          </>
        } />

        <Route path="/checkout/:id" element={
          <>
            <Navbar />
            <CheckoutPage />
            <Footer />
          </>
        } />

        <Route path="/contact" element={
          <>
            <Navbar />
            <ContactPage />
            <Footer />
          </>
        } />

        <Route path="/cancellation-policy" element={
          <>
            <Navbar />
            <CancellationPolicy />
            <Footer />
          </>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
}

export default App;
