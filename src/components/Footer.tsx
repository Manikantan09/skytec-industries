import React from 'react';
import { MapPin, Phone, Mail, FileText, UserCheck, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin, isAdminLoggedIn }) => {
  const quickLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About Us', href: '#about' },
    { label: 'Products', href: '#products' },
    { label: 'Why Us', href: '#features' },
    { label: 'Contact', href: '#contact' },
  ];

  const productLinks = [
    { label: 'Ceiling Fans', href: '#products' },
    { label: 'Wall Mount Fans', href: '#products' },
    { label: 'Table Fans', href: '#products' },
    { label: 'Pedestal Fans', href: '#products' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="bg-brand-blue rounded-xl px-3 py-2 inline-block mb-5">
              <img
                src="/Skytec_Logo_PNG.png"
                alt="Skytec Industries"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  // Fallback if image fails to render
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-sm leading-relaxed">
              Manufacturer of premium electric fans — ceiling, wall mount, table, and pedestal — based in Hyderabad, Telangana.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.href.replace('#', ''));
                    }}
                    className="text-sm hover:text-brand-yellow transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Products
            </h3>
            <ul className="space-y-3">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('products');
                    }}
                    className="text-sm hover:text-brand-yellow transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Reach Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                <span>Hyderabad, Telangana, India</span>
              </li>
              <li className="flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                <span>Prasada Rao (Proprietor)</span>
              </li>
              <li>
                <a
                  href="tel:+917942552885"
                  className="flex items-start gap-2.5 hover:text-brand-yellow transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                  <span>+91 7942552885 / 8309884573</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hrskytecindustries@gmail.com"
                  className="flex items-start gap-2.5 hover:text-brand-yellow transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                  <span className="break-all">hrskytecindustries@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                <span>GST: 36BUTPN3559D1Z6</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Skytec Industries. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <p className="text-xs text-slate-500">
              HSN Code: 8414 — Air or vacuum pumps, compressors and fans
            </p>

            <button
              onClick={onOpenAdmin}
              id="footer-admin-link"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-yellow transition-colors cursor-pointer"
              title="Admin Panel"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Admin Panel (Active)' : 'Admin Access'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
