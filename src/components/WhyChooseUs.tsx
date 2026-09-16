import React from 'react';
import { Zap, ShieldCheck, Wind, Factory, Tag, Headphones } from 'lucide-react';

interface WhyChooseUsProps {
  onQuoteClick: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onQuoteClick: _onQuoteClick }) => {
  const features = [
    {
      icon: Zap,
      title: 'Powerful Motors',
      description: 'High-speed motors engineered for maximum air delivery with minimal power consumption.',
    },
    {
      icon: ShieldCheck,
      title: 'Built to Last',
      description: 'Rust-resistant coatings and durable materials ensure years of reliable performance.',
    },
    {
      icon: Wind,
      title: 'Aerodynamic Design',
      description: 'Precision-crafted blades for wider air spread and whisper-quiet operation.',
    },
    {
      icon: Factory,
      title: 'In-house Manufacturing',
      description: 'Complete quality control from factory floor to finished product — no outsourcing.',
    },
    {
      icon: Tag,
      title: 'Competitive Pricing',
      description: 'Direct-from-manufacturer pricing for wholesale and retail customers alike.',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Dedicated service team ready to assist with product selection and after-sales support.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-bold tracking-widest uppercase text-brand-blue">
            Why Choose Us
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-heading">
            The Skytec Advantage
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Every fan we build reflects our commitment to quality, performance, and customer satisfaction.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => (
            <div
              key={item.title}
              className="group p-7 rounded-2xl bg-white border border-slate-100 hover:border-brand-blue/20 hover:shadow-2xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-yellow/10 border border-brand-blue/10 flex items-center justify-center group-hover:from-brand-blue group-hover:to-brand-blue-dark transition-all duration-300">
                <item.icon className="w-7 h-7 text-brand-blue group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 font-heading">
                {item.title}
              </h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
