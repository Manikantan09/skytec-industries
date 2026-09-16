import React, { useState, useEffect, useCallback } from 'react';
import { Product, AdminUser } from './types';
import { fetchProducts, fetchCurrentAdmin } from './lib/api';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ProductGallery } from './components/ProductGallery';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'public' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin'
        ? 'admin'
        : 'public';
    }
    return 'public';
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Selected product for inquiry prefill
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState<Product | null>(null);

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      const isAdmin = window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
      setCurrentRoute(isAdmin ? 'admin' : 'public');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: 'public' | 'admin') => {
    setCurrentRoute(route);
    const newPath = route === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    if (route === 'public') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Check current admin auth status on startup
  const checkAuth = useCallback(async () => {
    setIsCheckingAuth(true);
    try {
      const user = await fetchCurrentAdmin();
      setAdminUser(user);
    } catch {
      setAdminUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  // Fetch products from server database
  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products from server:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    loadProducts();
  }, [checkAuth, loadProducts]);

  // Smooth scroll handler for anchor links
  const handleScrollToSection = (sectionId: string) => {
    if (currentRoute !== 'public') {
      navigateTo('public');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When user clicks "Enquire Now" on any product card
  const handleEnquireProduct = (product: Product) => {
    setSelectedProductForInquiry(product);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // -------------------------------------------------------------
  // Admin Portal View (/admin)
  // -------------------------------------------------------------
  if (currentRoute === 'admin') {
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-slate-700 border-t-amber-500 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Verifying Skytec proprietor credentials...</p>
          </div>
        </div>
      );
    }

    // Protected Route: If not authenticated, show AdminLogin
    if (!adminUser) {
      return (
        <AdminLogin
          onSuccess={(user) => {
            setAdminUser(user);
          }}
          onBackToSite={() => navigateTo('public')}
        />
      );
    }

    // Authenticated Owner Admin Dashboard
    return (
      <AdminDashboard
        user={adminUser}
        products={products}
        onProductsUpdated={loadProducts}
        onLogout={() => {
          setAdminUser(null);
          navigateTo('public');
        }}
        onViewPublicSite={() => navigateTo('public')}
      />
    );
  }

  // -------------------------------------------------------------
  // Public Website View
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-amber-500 selection:text-white">
      {/* Header */}
      <Header
        onNavigate={handleScrollToSection}
        onOpenAdmin={() => navigateTo('admin')}
        isAdminLoggedIn={!!adminUser}
      />

      {/* Hero with animated rotating fan visualizer */}
      <Hero
        onExplore={() => handleScrollToSection('products')}
        onRequestQuote={() => handleScrollToSection('contact')}
      />

      {/* About Section */}
      <About />

      {/* Filterable Products Gallery */}
      <ProductGallery
        products={products}
        isLoading={isLoadingProducts}
        onEnquire={handleEnquireProduct}
      />

      {/* Features: "Why Choose Us" */}
      <WhyChooseUs onQuoteClick={() => handleScrollToSection('contact')} />

      {/* Contact & Inquiry Section */}
      <ContactSection
        products={products}
        selectedProduct={selectedProductForInquiry}
        onClearSelectedProduct={() => setSelectedProductForInquiry(null)}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleScrollToSection}
        onOpenAdmin={() => navigateTo('admin')}
        isAdminLoggedIn={!!adminUser}
      />
    </div>
  );
}
