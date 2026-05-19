// ROUTES:
// /                  → HomePage
// /rooms             → RoomsPage
// /rooms/:id         → ListingDetailPage
// /apartments        → ApartmentsPage
// /checkout/:id      → CheckoutPage
// /contact           → ContactPage
// /cancellation-policy → CancellationPolicy
// /login             → AdminLoginPage
// /admin             → AdminDashboardPage
// *                  → NotFoundPage

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
import RoomsPage from './pages/RoomsPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import NotFoundPage from './pages/NotFoundPage';
import PropertyCardStack from './components/PropertyCardStack';
import './index.css';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: 'easeIn' } }
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes with Layout */}
        <Route path="/" element={
          <AnimatedPage>
            <Navbar />
            <HomePage />
            <Footer />
          </AnimatedPage>
        } />

        <Route path="/apartments" element={
          <AnimatedPage>
            <Navbar />
            <ApartmentsPage />
            <Footer />
          </AnimatedPage>
        } />

        <Route path="/rooms/:id" element={
          <AnimatedPage>
            <Navbar />
            <ListingDetailPage />
            <Footer />
          </AnimatedPage>
        } />

        <Route path="/checkout/:id" element={
          <AnimatedPage>
            <Navbar />
            <CheckoutPage />
            <Footer />
          </AnimatedPage>
        } />

        <Route path="/contact" element={
          <AnimatedPage>
            <Navbar />
            <ContactPage />
            <Footer />
          </AnimatedPage>
        } />

        <Route path="/cancellation-policy" element={
          <AnimatedPage>
            <Navbar />
            <CancellationPolicy />
            <Footer />
          </AnimatedPage>
        } />

        <Route path="/privacy-policy" element={
          <AnimatedPage>
            <Navbar />
            <PrivacyPolicy />
            <Footer />
          </AnimatedPage>
        } />

        <Route path="/terms" element={
          <AnimatedPage>
            <Navbar />
            <TermsConditions />
            <Footer />
          </AnimatedPage>
        } />

        <Route path="/rooms" element={
          <AnimatedPage>
            <Navbar />
            <RoomsPage />
            <Footer />
          </AnimatedPage>
        } />

        {/* Admin Routes */}
        <Route path="/login" element={
          <AnimatedPage>
            <AdminLoginPage />
          </AnimatedPage>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AnimatedPage>
              <AdminDashboardPage />
            </AnimatedPage>
          </ProtectedRoute>
        } />

        {/* 404 catch-all */}
        <Route path="*" element={
          <AnimatedPage>
            <NotFoundPage />
          </AnimatedPage>
        } />
      </Routes>
    </AnimatePresence>
  );
}

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
      <Toaster position="top-center" reverseOrder={false} />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default App;

