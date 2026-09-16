import React from 'react';
import { CheckCircle2, Clock, Users, FileCheck, IndianRupee } from 'lucide-react';

export const About: React.FC = () => {
  const highlights = [
    'Proprietorship firm led by P Rao',
    'Factory, wholesale, and retail operations',
    'Banker: Bank of Baroda',
    'GST Registration: June 2019',
  ];

  const stats = [
    { icon: Clock, value: '8+', label: 'Years of Experience' },
    { icon: Users, value: '11-25', label: 'Skilled Employees' },
    { icon: FileCheck, value: 'GST', label: 'Registered Firm' },
    { icon: IndianRupee, value: '40L-1.5Cr', label: 'Annual Turnover' },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-bold tracking-widest uppercase text-brand-blue">
              About Us
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight font-heading">
              Crafting Air Comfort with Precision
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed font-normal">
              Skytec Industries is a Hyderabad-based manufacturer of premium electric fans, serving customers across India for over 8 years. We specialize in ceiling, wall mount, table, and pedestal fans — combining robust engineering with elegant design.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed font-normal">
              As a factory, wholesale, and retail business, we control every stage of production to ensure consistent quality. Our commitment to durability and performance has made us a trusted name in the industry.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {stats.map((item) => (
              <div
                key={item.label}
                className="group p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center shadow-lg shadow-brand-blue/20 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="mt-5 text-2xl lg:text-3xl font-extrabold text-slate-900 font-heading">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-slate-500 font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
