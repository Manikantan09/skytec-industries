import React, { useState } from 'react';
import { ArrowRight, Factory, ShieldCheck, Globe, Fan, Wind, Gauge } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onRequestQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onRequestQuote }) => {
  const [fanSpeed, setFanSpeed] = useState<number>(2);

  const speedConfigs = [
    { label: 'Breeze', duration: '3s', rpm: 180 },
    { label: 'Standard', duration: '1.5s', rpm: 320 },
    { label: 'Turbo', duration: '0.6s', rpm: 420 },
  ];

  const currentSpeed = speedConfigs[fanSpeed];

  return (
    <section id="hero" className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-28 pb-20">
      {/* Background with reference gradient: brand-blue-deeper via brand-blue to brand-blue-dark */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-deeper via-brand-blue to-brand-blue-dark" />

      {/* Pulsing ambient glow orbs */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-yellow rounded-full blur-[140px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue-light rounded-full blur-[140px] animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Subtle geometric dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm-5-5h2v-2h-2v2zm0 12h2v-2h-2v2zm10-10h2v-2h-2v2zm0 10h2v-2h-2v2zm-15-5h2v-2h-2v2zm10-10h2v-2h-2v2zm0 12h2v-2h-2v2zm-10-10h2v-2h-2v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
              <span className="text-sm font-medium text-white">Manufacturer & Supplier since 2019</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight font-heading">
              Premium Electric Fans
              <br />
              <span className="text-brand-yellow">Unleash the Power</span>
            </h1>

            <p className="mt-6 text-lg text-white/85 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Skytec Industries manufactures high-quality ceiling, wall mount, table, and pedestal fans — delivering powerful airflow and lasting durability for homes and businesses.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onExplore}
                id="hero-explore-products-button"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-yellow text-slate-900 font-bold shadow-xl shadow-brand-yellow/30 hover:shadow-2xl hover:shadow-brand-yellow/50 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onRequestQuote}
                id="hero-request-quote-button"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/15 transition-colors cursor-pointer"
              >
                <span>Request a Quote</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start">
              {[
                { icon: Factory, label: 'In-house Manufacturing' },
                { icon: ShieldCheck, label: 'Quality Assured' },
                { icon: Globe, label: 'Pan-India Supply' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/80 text-sm">
                  <item.icon className="w-4 h-4 text-brand-yellow" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Orbital Rotating Fan Presentation */}
          <div className="flex justify-center items-center">
            <div className="relative">
              {/* Golden Glow Backdrop */}
              <div className="absolute inset-0 bg-brand-yellow/20 rounded-full blur-3xl pointer-events-none" />

              {/* Main Circular Glass Frame */}
              <div className="relative w-80 h-80 xl:w-96 xl:h-96 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                {/* Outer Orbit (20s spin) */}
                <div
                  className="absolute inset-8 rounded-full border-2 border-brand-yellow/30 animate-spin"
                  style={{ animationDuration: '20s' }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4 rounded-full bg-brand-yellow shadow-lg shadow-brand-yellow/50" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-4 h-4 rounded-full bg-white shadow-lg" />
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-yellow shadow-lg shadow-brand-yellow/50" />
                  <div className="absolute right-0 top-1/2 translate-x-1 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg" />
                </div>

                {/* Inner Counter-Orbit (15s reverse spin) */}
                <div
                  className="absolute inset-16 rounded-full border border-white/10 animate-spin"
                  style={{ animationDuration: '15s', animationDirection: 'reverse' }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 rounded-full bg-brand-yellow" />
                </div>

                {/* Interactive Center Fan Blade Spinner */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div
                    style={{
                      animation: `spin ${currentSpeed.duration} linear infinite`,
                      transformOrigin: 'center center',
                    }}
                  >
                    <Fan className="w-28 h-28 xl:w-36 xl:h-36 text-brand-yellow" strokeWidth={1.5} />
                  </div>

                  {/* Interactive Speed Switcher */}
                  <div className="absolute -bottom-8 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-lg">
                    {speedConfigs.map((cfg, idx) => (
                      <button
                        key={cfg.label}
                        onClick={() => setFanSpeed(idx)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                          fanSpeed === idx
                            ? 'bg-brand-yellow text-slate-900 shadow-xs'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      {/* CSS Spin Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
