import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg shadow-brand-blue/10' : 'bg-brand-blue'
    }`}>
      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with actual Skytec Logo */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center group cursor-pointer"
          >
            {isScrolled ? (
              <div className="bg-brand-blue rounded-xl px-3 py-1.5 group-hover:scale-105 transition-transform flex items-center">
                <img
                  src="/Skytec_Logo_PNG.png"
                  alt="Skytec Industries"
                  className="h-10 w-auto object-contain"
                />
              </div>
            ) : (
              <img
                src="/Skytec_Logo_PNG.png"
                alt="Skytec Industries"
                className="h-14 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            )}
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('hero')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isScrolled ? 'text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5' : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isScrolled ? 'text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5' : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isScrolled ? 'text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5' : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isScrolled ? 'text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5' : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Why Choose Us
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isScrolled ? 'text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5' : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Contact
            </button>

            {/* Get Quote Action */}
            <button
              onClick={() => handleNavClick('contact')}
              className="ml-3 px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide bg-brand-yellow text-slate-900 shadow-lg shadow-brand-yellow/30 hover:shadow-brand-yellow/50 hover:-translate-y-0.5 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Get Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </nav>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isScrolled ? 'text-slate-900' : 'text-white'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pb-4 pt-2 space-y-1 bg-white rounded-2xl shadow-xl mt-2 px-3 mx-4 border border-slate-100">
          <button
            onClick={() => handleNavClick('hero')}
            className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors cursor-pointer"
          >
            About Skytec
          </button>
          <button
            onClick={() => handleNavClick('products')}
            className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors cursor-pointer"
          >
            Our Products
          </button>
          <button
            onClick={() => handleNavClick('features')}
            className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors cursor-pointer"
          >
            Why Choose Us
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors cursor-pointer"
          >
            Contact Us
          </button>
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => handleNavClick('contact')}
              className="block w-full px-4 py-3 rounded-lg text-sm font-bold text-slate-900 bg-brand-yellow text-center shadow-md cursor-pointer"
            >
              Get Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
