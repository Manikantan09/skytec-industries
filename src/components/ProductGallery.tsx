import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { Search, SlidersHorizontal, ArrowUpRight, Check, Tag, Shield, Sparkles } from 'lucide-react';

interface ProductGalleryProps {
  products: Product[];
  isLoading: boolean;
  onEnquire: (product: Product) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  products,
  isLoading,
  onEnquire,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories: Array<{ label: string; value: string }> = [
    { label: 'All Fans', value: 'All' },
    { label: 'Ceiling Fans', value: 'Ceiling' },
    { label: 'Wall Mount Fans', value: 'Wall Mount' },
    { label: 'Table Fans', value: 'Table' },
    { label: 'Pedestal Fans', value: 'Pedestal' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="products" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <span className="text-sm font-bold tracking-widest uppercase text-brand-blue">
              Our Products
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
              Fans for Every Need
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              From ceiling fans to pedestal fans, we manufacture a complete range of electric fans designed for performance and durability.
            </p>
          </div>

          <div className="text-sm text-slate-500 font-medium">
            Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> model{filteredProducts.length === 1 ? '' : 's'} available
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-gradient-to-r from-slate-50 to-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 mb-10 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  id={`cat-filter-${cat.value.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 ring-2 ring-brand-blue/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-brand-blue/30'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Bar */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 transition-colors peer-focus:text-brand-blue" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all duration-200"
              />
            </div>

            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs sm:text-sm font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all duration-200 cursor-pointer hover:border-brand-blue/30"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <p className="text-lg font-bold text-slate-700">No fans found</p>
            <p className="text-sm text-slate-500 mt-1">Try resetting your category or search query.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-brand-blue/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image Container with Category Badge */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-brand-blue/90 backdrop-blur-xs text-xs font-semibold text-white shadow-sm">
                    {product.category}
                  </span>
                </div>
                {product.inStock ? (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white backdrop-blur-xs shadow-sm">
                      In Stock
                    </span>
                  </div>
                ) : (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/90 text-white backdrop-blur-xs shadow-sm">
                      Backorder
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-brand-blue transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Bullet features */}
                  {product.features && product.features.length > 0 && (
                    <ul className="mt-4 space-y-1.5 pt-1">
                      {product.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Pricing & CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400 font-medium">Wholesale / Unit</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => onEnquire(product)}
                    id={`enquire-btn-${product.id}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-brand-yellow hover:text-slate-900 hover:shadow-lg hover:shadow-brand-yellow/20 transition-all duration-200 cursor-pointer"
                  >
                    <span>Enquire Now</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Wholesale Banner */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold">
              Looking for bulk contractor or master carton wholesale rates?
            </h4>
            <p className="text-xs text-slate-400">
              Direct GST input credit invoicing and customized air-delivery options for builders and dealers.
            </p>
          </div>
          <a
            href="tel:+917942552885"
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs whitespace-nowrap transition-colors cursor-pointer"
          >
            Call Wholesale Desk (+91 7942552885)
          </a>
        </div>
      </div>
    </section>
  );
};
