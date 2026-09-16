import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../../types';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'createdAt'>, productId?: string) => Promise<void>;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Ceiling');
  const [price, setPrice] = useState<string>('950');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['100% Copper Winding Motor', 'High Air Delivery']);
  const [featureInput, setFeatureInput] = useState('');
  const [image, setImage] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Sample quick images presets for convenience (authentic Skytec factory catalog)
  const samplePresets: Array<{ label: string; url: string }> = [
    { label: 'Dark Brown Ceiling', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/EY/JH/JA/63800549/dark-brown-electric-ceiling-fan-500x500.PNG' },
    { label: 'White Ceiling', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/VM/ME/WY/63800549/white-ceiling-fan-500x500.jpg' },
    { label: 'Metal Ceiling', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/XP/AO/UZ/63800549/metal-electric-ceiling-fan-500x500.jpg' },
    { label: 'Satin Gold Ceiling', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/MZ/YN/GU/63800549/satin-gold-ceiling-fan-500x500.jpg' },
    { label: '4-Blade Ceiling', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/CL/LE/KC/63800549/4-blade-ceiling-fan-500x500.jpg' },
    { label: 'Wall Mount', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/YU/UQ/VM/63800549/havells-swing-400mm-wall-fan-500x500.jpg' },
    { label: 'Table Fan', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/DM/YA/MH/63800549/45w-plastic-table-fan-500x500.jpg' },
    { label: 'Pedestal Fan', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/NU/KA/GX/63800549/white-pedestal-fan-500x500.jpg' },
  ];

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(String(productToEdit.price));
      setDescription(productToEdit.description);
      setFeatures(productToEdit.features && productToEdit.features.length ? productToEdit.features : []);
      setImage(productToEdit.image);
      setInStock(productToEdit.inStock);
    } else {
      setName('');
      setCategory('Ceiling');
      setPrice('1100');
      setDescription('');
      setFeatures(['100% Copper Winding Motor', 'High Air Delivery', 'Double Ball Bearings']);
      setImage('https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&w=800&q=80');
      setInStock(true);
    }
    setError('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // Compress image file to compact data URL
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => resolve(event.target?.result as string);
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImage(file);
      setImage(compressedDataUrl);
      setError('');
    } catch {
      setError('Could not process selected image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Please provide a valid positive price in ₹');
      return;
    }
    if (!image.trim()) {
      setError('Please provide or upload a product image');
      return;
    }

    // Include any pending text in featureInput if user didn't press "Add"
    const finalFeatures = [...features];
    if (featureInput.trim() && !finalFeatures.includes(featureInput.trim())) {
      finalFeatures.push(featureInput.trim());
    }

    setIsSaving(true);
    setError('');

    try {
      await onSave(
        {
          name: name.trim(),
          category,
          price: numPrice,
          description: description.trim(),
          features: finalFeatures,
          image,
          inStock,
        },
        productToEdit ? productToEdit.id : undefined
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {productToEdit ? 'Edit Electric Fan Model' : 'Add New Electric Fan Model'}
            </h3>
            <p className="text-xs text-slate-500">
              Changes reflect immediately on the live Skytec Industries catalog
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
              {error}
            </div>
          )}

          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Model Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AeroStorm High Velocity Ceiling Fan"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden bg-white cursor-pointer"
              >
                <option value="Ceiling">Ceiling</option>
                <option value="Wall Mount">Wall Mount</option>
                <option value="Table">Table</option>
                <option value="Pedestal">Pedestal</option>
              </select>
            </div>
          </div>

          {/* Price & In Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Price (in ₹ INR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="850"
                  className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Production Status
              </label>
              <div className="flex items-center h-10">
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <span>In Stock & Ready for Dispatch</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed specifications, motor capabilities, blade design, and ideal application..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden resize-none"
            />
          </div>

          {/* Features list */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Key Features / Highlights
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="e.g. 1200mm Sweep, Double Ball Bearings..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Feature tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Selection / Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Product Image <span className="text-rose-500">*</span>
            </label>

            {/* Image Preview */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-24 h-24 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-300 flex items-center justify-center">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Paste image URL (https://...)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:border-amber-500 outline-hidden"
                />

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-amber-600" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">PNG, JPG, WebP up to 5MB</span>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-500 block mb-1">Quick curated fan photos:</span>
              <div className="flex flex-wrap gap-1.5">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 text-[11px] font-medium text-slate-600 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <span>{productToEdit ? 'Update Product' : 'Save New Product'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
