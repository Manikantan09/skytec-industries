import React, { useState, useEffect } from 'react';
import { Product, Inquiry, AdminUser, AdminUserWithTimestamp } from '../../types';
import {
  fetchInquiries,
  deleteInquiry,
  createProduct,
  deleteProduct,
  adminLogout,
  changeAdminPassword,
  fetchAdmins,
  createAdmin,
  deleteAdmin,
} from '../../lib/api';
import {
  Package,
  Mail,
  LogOut,
  ExternalLink,
  PlusCircle,
  Trash2,
  Phone,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users,
  Shield,
  UserPlus,
  KeyRound,
} from 'lucide-react';

interface AdminDashboardProps {
  user: AdminUser;
  products: Product[];
  onProductsUpdated: () => Promise<void> | void;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  Ceiling: 'Ceiling Fans',
  'Wall Mount': 'Wall Mount Fans',
  Table: 'Table Fans',
  Pedestal: 'Pedestal Fans',
  general: 'General',
};

const SAMPLE_FAN_IMAGES = [
  { label: 'Dark Brown Ceiling Fan', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/EY/JH/JA/63800549/dark-brown-electric-ceiling-fan-500x500.PNG' },
  { label: 'White Ceiling Fan', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/VM/ME/WY/63800549/white-ceiling-fan-500x500.jpg' },
  { label: 'Metal Electric Fan', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/XP/AO/UZ/63800549/metal-electric-ceiling-fan-500x500.jpg' },
  { label: 'Heavy Duty Wall Fan', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/SI/TH/VC/63800549/high-speed-wall-mounted-fan-500x500.jpg' },
  { label: 'Oscillating Pedestal Fan', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/TC/XB/YB/63800549/industrial-pedestal-fan-500x500.jpg' },
  { label: 'Compact Table Fan', url: 'https://5.imimg.com/data5/SELLER/Default/2021/8/WD/TG/YJ/63800549/electric-table-fan-500x500.jpg' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  products: initialProducts,
  onProductsUpdated,
  onLogout,
  onViewPublicSite,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'inquiries' | 'admins'>('products');
  const [localProducts, setLocalProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    setLocalProducts(initialProducts);
  }, [initialProducts]);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(true);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  // Admin management state
  const [admins, setAdmins] = useState<AdminUserWithTimestamp[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // Form states for adding product
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Ceiling' | 'Wall Mount' | 'Table' | 'Pedestal'>('Ceiling');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('High-speed motor\nAerodynamic blades\nRust-resistant coating');
  const [imageUrl, setImageUrl] = useState(SAMPLE_FAN_IMAGES[0].url);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'product' | 'inquiry' | 'admin';
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadInquiries = async () => {
    setIsLoadingInquiries(true);
    setInquiryError(null);
    try {
      const data = await fetchInquiries();
      setInquiries(data);
    } catch (err: any) {
      setInquiryError(err.message || 'Failed to load inquiries');
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  // Load admins
  const loadAdmins = async () => {
    setIsLoadingAdmins(true);
    setAdminError(null);
    try {
      const data = await fetchAdmins();
      setAdmins(data);
    } catch (err: any) {
      setAdminError(err.message || 'Failed to load admins');
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  // Handle creating a new admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminName.trim() || !newAdminPassword.trim()) {
      setAdminError('All fields are required');
      return;
    }

    setIsCreatingAdmin(true);
    setAdminError(null);

    try {
      await createAdmin({
        email: newAdminEmail.trim(),
        name: newAdminName.trim(),
        password: newAdminPassword.trim(),
      });

      // Reset form
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminPassword('');

      // Reload admins
      await loadAdmins();
      showToast('Admin added successfully!');
    } catch (err: any) {
      setAdminError(err.message || 'Failed to add admin');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  // Handle local image file upload (converts to data URL)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormError('Image size should be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          setFormError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle submitting a new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Product title is required');
      return;
    }
    if (!imageUrl) {
      setFormError('Please select or upload an image');
      return;
    }

    setFormError(null);
    setIsUploading(true);

    try {
      const features = featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const newProductData = {
        name: title.trim(),
        category,
        price: category === 'Wall Mount' ? 2489 : category === 'Pedestal' ? 1450 : category === 'Table' ? 1050 : 1200,
        description: description.trim() || `${title} engineered for exceptional durability and optimal airflow.`,
        features: features.length > 0 ? features : ['100% Copper Winding Motor', 'High Air Delivery'],
        image: imageUrl,
        inStock: true,
      };

      const created = await createProduct(newProductData);

      // Instantly update local list
      setLocalProducts((prev) => [created, ...prev]);
      if (onProductsUpdated) {
        await onProductsUpdated();
      }

      // Reset form
      setTitle('');
      setDescription('');
      setFeaturesText('High-speed motor\nAerodynamic blades\nRust-resistant coating');
      setImageUrl(SAMPLE_FAN_IMAGES[0].url);
      showToast(`Product "${created.name}" added successfully!`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to add product');
    } finally {
      setIsUploading(false);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      if (deleteTarget.type === 'product') {
        // Optimistic update
        setLocalProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        await deleteProduct(deleteTarget.id);
        if (onProductsUpdated) {
          await onProductsUpdated();
        }
        showToast(`Product "${deleteTarget.title}" deleted.`);
      } else if (deleteTarget.type === 'inquiry') {
        // Optimistic update for inquiries
        setInquiries((prev) => prev.filter((i) => i.id !== deleteTarget.id));
        await deleteInquiry(deleteTarget.id);
        showToast('Inquiry deleted successfully.');
      } else if (deleteTarget.type === 'admin') {
        // Optimistic update for admins
        setAdmins((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        await deleteAdmin(deleteTarget.id);
        showToast('Admin deleted successfully.');
      }
    } catch (err: any) {
      showToast(err.message || 'Deletion failed', 'error');
      // Reload on failure to restore truth
      if (deleteTarget.type === 'inquiry') loadInquiries();
      if (deleteTarget.type === 'admin') loadAdmins();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await adminLogout();
    } finally {
      onLogout();
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordModalOpen(false);
      showToast('Password changed successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to change password.', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border bg-white text-slate-900 animate-in fade-in slide-in-from-bottom-5">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-sm text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (8+ characters)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-dark disabled:opacity-60 cursor-pointer"
              >
                {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isChangingPassword ? 'Saving...' : 'Save New Password'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-blue rounded-lg px-2 py-1 flex items-center justify-center">
              <img src="/Skytec_Logo_PNG.png" alt="Skytec" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg">Admin Panel</span>
              <span className="text-xs text-slate-500 ml-2">{user.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-blue transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change password</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={onViewPublicSite}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-blue transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Back to site</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-blue/40'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-blue/40'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inquiries</span>
            {inquiries.length > 0 && (
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'inquiries' ? 'bg-white/20 text-white' : 'bg-brand-blue/10 text-brand-blue'
                }`}
              >
                {inquiries.length}
              </span>
            )}
          </button>

          {user.role === 'owner' && (
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'admins'
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-blue/40'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Admins</span>
            </button>
          )}
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <>
            {/* Add New Product Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                <PlusCircle className="w-5 h-5 text-brand-blue" />
                <span>Add New Product</span>
              </h2>

              <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Dark Brown Ceiling Fan"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 text-sm cursor-pointer"
                    >
                      <option value="Ceiling">Ceiling Fans</option>
                      <option value="Wall Mount">Wall Mount Fans</option>
                      <option value="Table">Table Fans</option>
                      <option value="Pedestal">Pedestal Fans</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Image File *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-blue file:text-white file:font-medium hover:file:bg-brand-blue-dark transition-colors cursor-pointer"
                    />

                    {/* Quick fan photo presets */}
                    <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                      <span className="text-xs text-slate-400">Or sample fan:</span>
                      {SAMPLE_FAN_IMAGES.map((sample) => (
                        <button
                          key={sample.label}
                          type="button"
                          onClick={() => setImageUrl(sample.url)}
                          className={`text-xs px-2 py-0.5 rounded-md border transition-all duration-200 cursor-pointer hover:scale-105 ${
                            imageUrl === sample.url
                              ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {sample.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="e.g. High-speed ceiling fan with aerodynamic blades..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Features (one per line)</label>
                    <textarea
                      value={featuresText}
                      onChange={(e) => setFeaturesText(e.target.value)}
                      rows={3}
                      placeholder="High-speed motor&#10;Aerodynamic blades&#10;Rust-resistant coating"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 resize-none text-sm font-mono"
                    />
                  </div>

                  {formError && <p className="text-sm text-red-500 font-medium">{formError}</p>}

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-yellow text-slate-900 font-bold hover:shadow-lg hover:shadow-brand-yellow/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 cursor-pointer text-sm"
                  >
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                </div>

                {/* Right: Live Image Preview Box */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-200 border-dashed min-h-[220px] p-4">
                  {imageUrl ? (
                    <div className="w-full flex flex-col items-center">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-h-56 object-contain rounded-lg p-2"
                      />
                      <span className="text-xs text-slate-400 mt-2">Ready to publish</span>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400">
                      <Package className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-xs">Image preview will appear here</p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Manage Products Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Manage Products ({localProducts.length})
              </h2>

              {localProducts.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  No products yet. Upload your first product above.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {localProducts.map((p) => (
                    <div
                      key={p.id}
                      className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 transition-all hover:shadow-md"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-40 object-contain p-2 bg-white"
                      />
                      <div className="p-3 border-t border-slate-200 bg-white">
                        <p className="font-medium text-sm text-slate-900 truncate" title={p.name}>
                          {p.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {CATEGORY_NAMES[p.category] || p.category}
                        </p>
                        {p.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {p.description}
                          </p>
                        )}
                      </div>

                      {/* Delete button (hover on desktop, visible on mobile) */}
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            type: 'product',
                            id: p.id,
                            title: p.name,
                          })
                        }
                        className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm cursor-pointer"
                        aria-label={`Delete ${p.name}`}
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab 2: Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Customer Inquiries ({inquiries.length})
            </h2>

            {inquiryError && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-sm">
                Failed to load inquiries: {inquiryError}
              </div>
            )}

            {isLoadingInquiries ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
              </div>
            ) : inquiries.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No inquiries yet.</p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="group relative rounded-xl border border-slate-200 p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          type: 'inquiry',
                          id: inq.id,
                          title: `Inquiry from ${inq.name}`,
                        })
                      }
                      className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm cursor-pointer"
                      aria-label="Delete inquiry"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-start gap-3 pr-10">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-brand-blue">
                          {inq.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="font-semibold text-slate-900 truncate">{inq.name}</p>
                          {inq.productInterest && (
                            <span className="px-2 py-0.5 rounded-full bg-brand-yellow/20 text-slate-900 text-xs font-medium">
                              {inq.productInterest}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(inq.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <a
                        href={`mailto:${inq.email}`}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-brand-blue transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{inq.email}</span>
                      </a>
                      <a
                        href={`tel:${inq.phone}`}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-brand-blue transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{inq.phone}</span>
                      </a>
                    </div>

                    <p className="mt-3 text-sm text-slate-700 bg-white rounded-lg p-3 border border-slate-100">
                      {inq.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Admins (Owner only) */}
        {activeTab === 'admins' && user.role === 'owner' && (
          <>
            {/* Add New Admin Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-brand-blue" />
                <span>Add New Admin</span>
              </h2>

              <form onSubmit={handleCreateAdmin} className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="Admin Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password *</label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 text-sm"
                  />
                </div>

                {adminError && <p className="text-sm text-red-500 font-medium md:col-span-3">{adminError}</p>}

                <div className="md:col-span-3">
                  <button
                    type="submit"
                    disabled={isCreatingAdmin}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue text-white font-bold hover:shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 cursor-pointer text-sm"
                  >
                    {isCreatingAdmin ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    <span>{isCreatingAdmin ? 'Adding Admin...' : 'Add Admin'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Manage Admins Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Manage Admins ({admins.length})
              </h2>

              {isLoadingAdmins ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
                </div>
              ) : admins.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No admins yet. Add your first admin above.</p>
              ) : (
                <div className="space-y-3">
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="group relative rounded-xl border border-slate-200 p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-brand-blue" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{admin.name}</p>
                          <p className="text-xs text-slate-500">{admin.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          admin.role === 'owner' 
                            ? 'bg-brand-yellow text-slate-900' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {admin.role === 'owner' ? (
                            <span className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Owner
                            </span>
                          ) : 'Admin'}
                        </span>

                        {admin.id !== 'skytec-owner-01' && (
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({
                                type: 'admin',
                                id: admin.id,
                                title: admin.name,
                              })
                            }
                            className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm cursor-pointer"
                            aria-label={`Delete ${admin.name}`}
                            title="Delete admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Confirmation Modal for Deletion */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              Delete {deleteTarget.type === 'product' ? 'Product' : deleteTarget.type === 'inquiry' ? 'Inquiry' : 'Admin'}?
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to delete &ldquo;{deleteTarget.title}&rdquo;? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
