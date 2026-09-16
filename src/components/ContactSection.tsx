import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { submitInquiry } from '../lib/api';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  UserCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ContactSectionProps {
  products: Product[];
  selectedProduct?: Product | null;
  onClearSelectedProduct?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  products,
  selectedProduct,
  onClearSelectedProduct,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productInterest: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        productInterest: selectedProduct.name,
        message: prev.message
          ? prev.message
          : `Hello, I would like to inquire about ${selectedProduct.name} (${selectedProduct.category}). Please share pricing and bulk availability.`,
      }));
    }
  }, [selectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      setStatusMessage('Please provide your name, phone number, and message.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');

    try {
      const res = await submitInquiry(formData);
      setSubmitStatus('success');
      setStatusMessage(res.message || 'Thank you! Your inquiry has been sent to our team.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        productInterest: 'General Inquiry',
        message: '',
      });
      if (onClearSelectedProduct) {
        onClearSelectedProduct();
      }
      setTimeout(() => setSubmitStatus('idle'), 6000);
    } catch (err: any) {
      setSubmitStatus('error');
      setStatusMessage(err.message || 'Failed to submit inquiry. Please call us directly.');
      setTimeout(() => setSubmitStatus('idle'), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryCounts = {
    'Ceiling Fans': products.filter((p) => p.category.toLowerCase().includes('ceiling')).length,
    'Wall Mount Fans': products.filter((p) => p.category.toLowerCase().includes('wall')).length,
    'Table Fans': products.filter((p) => p.category.toLowerCase().includes('table')).length,
    'Pedestal Fans': products.filter((p) => p.category.toLowerCase().includes('pedestal')).length,
  };

  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-br from-brand-blue-deeper via-brand-blue to-brand-blue-dark relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue-light rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Direct info */}
          <div>
            <span className="text-sm font-bold tracking-widest uppercase text-brand-yellow">
              Get in Touch
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight font-heading">
              Let's Talk About Your Requirements
            </h2>
            <p className="mt-4 text-lg text-white/80 leading-relaxed font-normal">
              Whether you need a single fan or a bulk order, our team is ready to help. Send us your inquiry and we'll get back to you promptly.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-yellow" />
                </div>
                <div>
                  <p className="text-sm text-white/60 font-medium">Location</p>
                  <p className="text-white font-semibold">Hyderabad, Telangana, India</p>
                </div>
              </div>

              <a href="tel:+917942552885" className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-yellow/20 transition-colors">
                  <Phone className="w-5 h-5 text-brand-yellow" />
                </div>
                <div>
                  <p className="text-sm text-white/60 font-medium">Phone</p>
                  <p className="text-white font-semibold group-hover:text-brand-yellow transition-colors">
                    +91 7942552885 / 8309884573
                  </p>
                </div>
              </a>

              <a href="mailto:hrskytecindustries@gmail.com" className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-yellow/20 transition-colors">
                  <Mail className="w-5 h-5 text-brand-yellow" />
                </div>
                <div>
                  <p className="text-sm text-white/60 font-medium">Email</p>
                  <p className="text-white font-semibold group-hover:text-brand-yellow transition-colors break-all">
                    hrskytecindustries@gmail.com
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-brand-yellow" />
                </div>
                <div>
                  <p className="text-sm text-white/60 font-medium">Proprietor</p>
                  <p className="text-white font-semibold">Prasada Rao</p>
                </div>
              </div>
            </div>

            {/* Product Category Count Tags */}
            <div className="mt-8 flex flex-wrap gap-3">
              {Object.entries(categoryCounts).map(([label, count]) => (
                <span
                  key={label}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70"
                >
                  {label} ({count})
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Glassmorphic Inquiry Form */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl hover:shadow-brand-blue/20 transition-shadow duration-300">
            {selectedProduct && (
              <div className="mb-6 p-3 rounded-xl bg-white/10 border border-brand-yellow/30 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <span className="text-brand-yellow font-bold">Selected Model:</span>
                  <span className="font-semibold">{selectedProduct.name}</span>
                </div>
                {onClearSelectedProduct && (
                  <button
                    onClick={onClearSelectedProduct}
                    className="text-brand-yellow hover:underline cursor-pointer font-medium transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-white/80 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="contact-name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name or business name"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-hidden focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 transition-all duration-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-white/80 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-hidden focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 transition-all duration-200 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-white/80 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98490 XXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-hidden focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-product" className="block text-sm font-medium text-white/80 mb-2">
                  Product of Interest
                </label>
                <select
                  id="contact-product"
                  value={formData.productInterest}
                  onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/20 text-white focus:outline-hidden focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 transition-all duration-200 text-sm cursor-pointer"
                >
                  <option value="General Inquiry">General Wholesale / Dealership Inquiry</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-white/80 mb-2">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your requirements, required quantity, or delivery city..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-hidden focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 transition-all duration-200 text-sm resize-none"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                id="contact-form-submit-button"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-yellow text-slate-900 font-bold hover:shadow-lg hover:shadow-brand-yellow/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
