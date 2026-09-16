import { Product, Inquiry, AdminUser, AdminUserWithTimestamp, AuthResponse } from '../types';

const TOKEN_KEY = 'skytec_admin_token';
let inMemoryToken: string | null = null;

export function getStoredToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  try {
    const val = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (val) {
      inMemoryToken = val;
      return val;
    }
  } catch {
    // Storage may be restricted in sandbox iframe
  }
  return null;
}

export function setStoredToken(token: string): void {
  inMemoryToken = token;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function clearStoredToken(): void {
  inMemoryToken = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

// -------------------------------------------------------------
// Public APIs
// -------------------------------------------------------------

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export async function submitInquiry(data: {
  name: string;
  email?: string;
  phone: string;
  productInterest: string;
  message: string;
}): Promise<{ success: boolean; message: string; id: string }> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Submission failed' }));
    throw new Error(err.error || 'Failed to submit inquiry');
  }

  return res.json();
}

// -------------------------------------------------------------
// Admin Auth APIs
// -------------------------------------------------------------

export async function sendAdminOtp(email: string): Promise<{ success: boolean; message: string; expiresIn: number }> {
  const res = await fetch('/api/admin/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to send verification code');
  }

  return data;
}

export async function verifyAdminOtp(email: string, otp: string): Promise<AuthResponse> {
  const res = await fetch('/api/admin/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Invalid verification code');
  }

  if (data.token) {
    setStoredToken(data.token);
  }

  return data;
}

export async function adminLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Invalid credentials');
  }

  if (data.token) {
    setStoredToken(data.token);
  }

  return data;
}

export async function fetchCurrentAdmin(): Promise<AdminUser | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/admin/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      clearStoredToken();
      return null;
    }

    const data = await res.json();
    return data.user;
  } catch {
    clearStoredToken();
    return null;
  }
}

export async function adminLogout(): Promise<void> {
  const token = getStoredToken();
  if (token) {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {});
  }
  clearStoredToken();
}

// -------------------------------------------------------------
// Protected Admin APIs (Products Management)
// -------------------------------------------------------------

export async function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const token = getStoredToken();
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create product' }));
    throw new Error(err.error || 'Failed to create product');
  }

  return res.json();
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const token = getStoredToken();
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update product' }));
    throw new Error(err.error || 'Failed to update product');
  }

  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const token = getStoredToken();
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to delete product' }));
    throw new Error(err.error || 'Failed to delete product');
  }
}

// -------------------------------------------------------------
// Protected Admin APIs (Inquiries Management)
// -------------------------------------------------------------

export async function fetchInquiries(): Promise<Inquiry[]> {
  const token = getStoredToken();
  const res = await fetch('/api/inquiries', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to fetch inquiries' }));
    throw new Error(err.error || 'Failed to fetch inquiries');
  }

  return res.json();
}

export async function toggleInquiryRead(id: string, isRead: boolean): Promise<Inquiry> {
  const token = getStoredToken();
  const res = await fetch(`/api/inquiries/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isRead }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update inquiry status' }));
    throw new Error(err.error || 'Failed to update inquiry status');
  }

  return res.json();
}

export async function deleteInquiry(id: string): Promise<void> {
  const token = getStoredToken();
  const res = await fetch(`/api/inquiries/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to delete inquiry' }));
    throw new Error(err.error || 'Failed to delete inquiry');
  }
}

// -------------------------------------------------------------
// Admin Management APIs (Owner only)
// -------------------------------------------------------------

export async function fetchAdmins(): Promise<AdminUserWithTimestamp[]> {
  const token = getStoredToken();
  const res = await fetch('/api/admin/admins', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to fetch admins' }));
    throw new Error(err.error || 'Failed to fetch admins');
  }

  return res.json();
}

export async function createAdmin(data: {
  email: string;
  name: string;
  password: string;
  role?: 'owner' | 'admin';
}): Promise<AdminUserWithTimestamp> {
  const token = getStoredToken();
  const res = await fetch('/api/admin/admins', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create admin' }));
    throw new Error(err.error || 'Failed to create admin');
  }

  return res.json();
}

export async function deleteAdmin(id: string): Promise<void> {
  const token = getStoredToken();
  const res = await fetch(`/api/admin/admins/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to delete admin' }));
    throw new Error(err.error || 'Failed to delete admin');
  }
}
