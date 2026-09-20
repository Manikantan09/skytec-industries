import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const MAIN_ADMIN_EMAIL = 'hrskytecindustries@gmail.com';
const INITIAL_ADMIN_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || 'Manukumar@2005';

// Interface for database schema
interface DbSchema {
  admins: Array<{
    id: string;
    email: string;
    name: string;
    salt: string;
    hash: string;
    role: 'owner' | 'admin';
    createdAt: string;
  }>;
  products: Array<{
    id: string;
    name: string;
    category: 'Ceiling' | 'Wall Mount' | 'Table' | 'Pedestal';
    price: number;
    description: string;
    features: string[];
    image: string;
    inStock: boolean;
    createdAt: string;
  }>;
  inquiries: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    productInterest: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }>;
  sessions: Record<string, { userId: string; email?: string; expiresAt: number }>;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Initial seed data with high-res curated product imagery
function getInitialDb(): DbSchema {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(INITIAL_ADMIN_PASSWORD, salt);

  return {
    admins: [
      {
        id: 'skytec-owner-01',
        email: MAIN_ADMIN_EMAIL,
        name: 'Prasada Rao (Proprietor)',
        salt,
        hash,
        role: 'owner',
        createdAt: new Date().toISOString(),
      },
    ],
    products: [
      {
        id: 'prod-01',
        name: 'Dark Brown Electric Ceiling Fan',
        category: 'Ceiling',
        price: 1200,
        description: 'Rich dark walnut finish with high-torque copper motor and aerodynamic wide-sweep aluminium blades for powerful air circulation.',
        features: ['1200mm Sweep', 'High Air Delivery: 225 CMM', '100% Copper Winding Motor', 'Double Ball Bearings'],
        image: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      },
      {
        id: 'prod-02',
        name: 'White Electric Ceiling Fan',
        category: 'Ceiling',
        price: 850,
        description: 'Classic glossy white ceiling fan designed for energy efficiency, silent operation, and long-lasting durability in residential & commercial spaces.',
        features: ['1200mm Sweep', 'Energy Efficient 50W', 'Rust-proof Powder Coating', 'Silent Airfoil Technology'],
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
      },
      {
        id: 'prod-03',
        name: 'Metal Electric Ceiling Fan',
        category: 'Ceiling',
        price: 825,
        description: 'Heavy-gauge all-metal body built for industrial workshops, warehouses, and demanding spaces requiring maximum durability and high velocity airflow.',
        features: ['Heavy Gauge Steel Blades', 'High RPM 380', 'Industrial Grade Stator', 'Vibration Free Mount'],
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      },
      {
        id: 'prod-04',
        name: 'Satin Gold Ceiling Fan',
        category: 'Ceiling',
        price: 1175,
        description: 'Luxurious satin gold decorative ceiling fan with gold ring embellishments on the canopy and motor body, crafted for premium living rooms and offices.',
        features: ['Decorative Metallic Ring Trims', 'Low Power Consumption', 'Precision Dynamic Balanced Blades', 'Whisper-quiet Operation'],
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
      },
      {
        id: 'prod-05',
        name: '4 Blade Electric Ceiling Fan',
        category: 'Ceiling',
        price: 850,
        description: 'Engineered 4-blade configuration designed for uniform low-draft air distribution in medium sized bedrooms, cabins, and clinics.',
        features: ['4 Aerodynamic Blades', 'Wider Air Cone Coverage', 'Thermal Overload Protection', 'Gloss Baked Enamel Finish'],
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
      {
        id: 'prod-06',
        name: 'Oscillating Wall Mount Fan',
        category: 'Wall Mount',
        price: 2489,
        description: 'Heavy-duty wall mounting fan with smooth 90-degree oscillation, pull-cord speed regulation, and tilt-adjustable aerodynamic guard.',
        features: ['400mm Sweep', '90° Wide Oscillation', 'Dual Pull Cord Controls', 'Aerodynamic Polypropylene Blades'],
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: 'prod-07',
        name: 'Oscillating Electric Table Fan',
        category: 'Table',
        price: 1050,
        description: 'Compact personal table fan with synchronous jerk-free oscillation, 3 speed rotary knob, and stable weighted base for desks and retail counters.',
        features: ['300mm Sweep', '3-Speed Piano Switch', 'Jerk-free Smooth Gear Oscillation', 'Close Mesh Finger-safe Guard'],
        image: 'https://images.unsplash.com/photo-1618944847828-82e943c3ebd7?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      },
      {
        id: 'prod-08',
        name: 'Oscillating Pedestal Fan',
        category: 'Pedestal',
        price: 1450,
        description: 'Telescopic height-adjustable pedestal fan with powerful air throw up to 25 feet. Ideal for halls, banquet venues, restaurants, and retail shops.',
        features: ['Height Adjustable Telescopic Pole', 'Heavy Round Cast-iron Base', 'Thermal Fuse Protection', 'High Velocity Air Jet'],
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ],
    inquiries: [
      {
        id: 'inq-01',
        name: 'K. Venkatesh (SR Electricals)',
        email: 'srelectricals.hyd@gmail.com',
        phone: '+91 98480 23456',
        productInterest: 'Oscillating Wall Mount Fan',
        message: 'Looking for bulk wholesale supply of 35 units of wall mount fans for a commercial gym fit-out in Gachibowli, Hyderabad. Please share your wholesale rate sheet.',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'inq-02',
        name: 'M. Anand Rao',
        email: 'anandrao.infra@rediffmail.com',
        phone: '+91 94401 87654',
        productInterest: 'Dark Brown Electric Ceiling Fan',
        message: 'Need 60 units of ceiling fans for our residential apartment project in Kukatpally. Can we arrange dispatch this week?',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    sessions: {
      'skytec-owner-session-token': {
        userId: 'skytec-owner-01',
        expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
      },
    },
  };
}

// Ensure database file exists
function readDb(): DbSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDb();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Migrate old schema to new schema if needed
    if (parsed.admin && !parsed.admins) {
      parsed.admins = [parsed.admin];
      delete parsed.admin;
    }
    
    if (!parsed.sessions) {
      parsed.sessions = {};
    }
    if (!parsed.admins) {
      parsed.admins = [];
    }

    const owner = parsed.admins.find((admin: DbSchema['admins'][number]) => admin.id === 'skytec-owner-01');
    if (owner && owner.email !== MAIN_ADMIN_EMAIL) {
      owner.email = MAIN_ADMIN_EMAIL;
      writeDb(parsed);
    }

    if (owner && owner.hash === hashPassword('Skytec@2019', owner.salt)) {
      owner.salt = crypto.randomBytes(16).toString('hex');
      owner.hash = hashPassword(INITIAL_ADMIN_PASSWORD, owner.salt);
      writeDb(parsed);
    }
    
    // Ensure active master session token exists for the proprietor
    if (!parsed.sessions['skytec-owner-session-token']) {
      parsed.sessions['skytec-owner-session-token'] = {
        userId: 'skytec-owner-01',
        expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
      };
    }
    return parsed;
  } catch (err) {
    console.error('Error reading db, resetting to default:', err);
    const initial = getInitialDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function writeDb(data: DbSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// Authentication middleware to secure private admin endpoints
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  
  // Require valid Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  // Validate token format
  if (!token || token === 'null' || token === 'undefined' || token.length < 10) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return;
  }

  const db = readDb();
  const session = db.sessions[token];

  // Check if session exists
  if (!session) {
    res.status(401).json({ error: 'Unauthorized: Invalid session' });
    return;
  }

  // Check if session is expired
  if (Date.now() > session.expiresAt) {
    delete db.sessions[token];
    writeDb(db);
    res.status(401).json({ error: 'Unauthorized: Session has expired. Please log in again.' });
    return;
  }

  // Validate user exists
  const admin = db.admins.find(a => a.id === session.userId);
  if (!admin) {
    res.status(401).json({ error: 'Unauthorized: Invalid user' });
    return;
  }

  next();
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // Allow larger payload for product image uploads (base64)
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Initialize DB
  readDb();

  // -------------------------------------------------------------
  // API Routes
  // -------------------------------------------------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      company: 'Skytec Industries',
      proprietor: 'Prasada Rao',
      location: 'Hyderabad, Telangana',
      gst: '36BUTPN3559D1Z6',
    });
  });

  // Admin Login (validates credentials and creates a session)
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const db = readDb();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();
    const admin = db.admins.find(a => a.email === cleanEmail);
    if (!admin) {
      res.status(401).json({ error: 'Invalid admin credentials' });
      return;
    }

    const computedHash = hashPassword(cleanPassword, admin.salt);
    const validPassword = computedHash === admin.hash;
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid admin credentials' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    db.sessions[token] = {
      userId: admin.id,
      email: cleanEmail,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    writeDb(db);

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  });

  // Change password for the authenticated admin
  app.post('/api/admin/change-password', requireAdminAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      res.status(400).json({ error: 'Current and new passwords are required' });
      return;
    }

    if (newPassword.trim().length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters' });
      return;
    }

    const token = req.headers.authorization?.split(' ')[1];
    const db = readDb();
    const session = db.sessions[token || ''];
    const admin = db.admins.find(a => a.id === session?.userId);
    if (!admin) {
      res.status(401).json({ error: 'Admin account not found' });
      return;
    }

    const currentHash = hashPassword(currentPassword.trim(), admin.salt);
    if (currentHash !== admin.hash) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }

    admin.salt = crypto.randomBytes(16).toString('hex');
    admin.hash = hashPassword(newPassword.trim(), admin.salt);
    writeDb(db);
    res.json({ success: true, message: 'Password changed successfully' });
  });

  // Get current admin profile
  app.get('/api/admin/me', requireAdminAuth, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const db = readDb();
    const session = db.sessions[token];
    const admin = db.admins.find(a => a.id === session?.userId);
    
    if (!admin) {
      res.status(401).json({ error: 'Admin not found' });
      return;
    }
    
    res.json({
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  });

  // Admin Logout
  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const db = readDb();
      if (db.sessions[token]) {
        delete db.sessions[token];
        writeDb(db);
      }
    }
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // Admin Management APIs (Owner only)
  // -------------------------------------------------------------
  
  // Get all admins (owner only)
  app.get('/api/admin/admins', requireAdminAuth, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const db = readDb();
    const session = db.sessions[token];
    const currentAdmin = db.admins.find(a => a.id === session?.userId);
    
    // Only owner can view all admins
    if (currentAdmin?.role !== 'owner') {
      res.status(403).json({ error: 'Only owner can view admins' });
      return;
    }
    
    // Return admins without sensitive data
    const safeAdmins = db.admins.map(({ salt, hash, ...admin }) => admin);
    res.json(safeAdmins);
  });

  // Create new admin (owner only)
  app.post('/api/admin/admins', requireAdminAuth, (req, res) => {
    const { email, name, password, role } = req.body;
    
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const db = readDb();
    const session = db.sessions[token];
    const currentAdmin = db.admins.find(a => a.id === session?.userId);
    
    // Only owner can create admins
    if (currentAdmin?.role !== 'owner') {
      res.status(403).json({ error: 'Only owner can create admins' });
      return;
    }
    
    if (!email || !name || !password) {
      res.status(400).json({ error: 'Email, name, and password are required' });
      return;
    }
    
    const cleanEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      res.status(400).json({ error: 'Please enter a valid email address' });
      return;
    }
    
    // Check if email already exists
    if (db.admins.find(a => a.email === cleanEmail)) {
      res.status(400).json({ error: 'This email is already registered as an admin' });
      return;
    }
    
    const newRole: 'admin' = role === 'admin' ? 'admin' : 'admin'; // Default to admin role
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(password, salt);
    
    const newAdmin = {
      id: `admin-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: cleanEmail,
      name: String(name).trim(),
      salt,
      hash,
      role: newRole,
      createdAt: new Date().toISOString(),
    };
    
    db.admins.push(newAdmin);
    writeDb(db);
    
    // Return admin without sensitive data
    const { salt: _, hash: __, ...safeAdmin } = newAdmin;
    res.status(201).json(safeAdmin);
  });

  // Delete admin (owner only)
  app.delete('/api/admin/admins/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const db = readDb();
    const session = db.sessions[token];
    const currentAdmin = db.admins.find(a => a.id === session?.userId);
    
    // Only owner can delete admins
    if (currentAdmin?.role !== 'owner') {
      res.status(403).json({ error: 'Only owner can delete admins' });
      return;
    }
    
    // Prevent deleting the owner account
    if (id === 'skytec-owner-01') {
      res.status(400).json({ error: 'Cannot delete the owner account' });
      return;
    }
    
    const index = db.admins.findIndex(a => a.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }
    
    db.admins.splice(index, 1);
    writeDb(db);
    
    res.json({ success: true });
  });

  // Helper to normalize product categories
  function normalizeCategory(catRaw: any): 'Ceiling' | 'Wall Mount' | 'Table' | 'Pedestal' {
    const s = String(catRaw || '').toLowerCase();
    if (s.includes('wall')) return 'Wall Mount';
    if (s.includes('table')) return 'Table';
    if (s.includes('pedestal')) return 'Pedestal';
    return 'Ceiling';
  }

  // -------------------------------------------------------------
  // Public Products API (Read-only for public)
  // -------------------------------------------------------------
  app.get('/api/products', (req, res) => {
    const db = readDb();
    res.json(db.products);
  });

  // -------------------------------------------------------------
  // Protected Products API (Admin Write access only)
  // -------------------------------------------------------------
  app.post('/api/products', requireAdminAuth, (req, res) => {
    const { name, title, category, price, description, features, image, image_url, inStock } = req.body;

    const resolvedName = String(name || title || '').trim();
    if (!resolvedName) {
      res.status(400).json({ error: 'Product name/title is required' });
      return;
    }

    const resolvedCategory = normalizeCategory(category);
    const resolvedPrice = Number(price) > 0 ? Number(price) : (
      resolvedCategory === 'Wall Mount' ? 2489 :
      resolvedCategory === 'Pedestal' ? 1450 :
      resolvedCategory === 'Table' ? 1050 : 1200
    );

    let resolvedFeatures: string[] = [];
    if (Array.isArray(features)) {
      resolvedFeatures = features.map((f: any) => String(f).trim()).filter(Boolean);
    } else if (typeof features === 'string') {
      resolvedFeatures = features.split('\n').map((f: string) => f.trim()).filter(Boolean);
    }
    if (resolvedFeatures.length === 0) {
      resolvedFeatures = ['100% Pure Copper Winding', 'High Air Delivery', 'Double Ball Bearings'];
    }

    const resolvedImage = String(image || image_url || '').trim() ||
      'https://5.imimg.com/data5/SELLER/Default/2021/8/EY/JH/JA/63800549/dark-brown-electric-ceiling-fan-500x500.PNG';

    const db = readDb();
    const newProduct = {
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: resolvedName,
      category: resolvedCategory,
      price: resolvedPrice,
      description: String(description || '').trim() || `${resolvedName} designed for superior airflow and long-lasting durability.`,
      features: resolvedFeatures,
      image: resolvedImage,
      inStock: inStock !== false,
      createdAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    writeDb(db);

    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const { name, title, category, price, description, features, image, image_url, inStock } = req.body;

    const db = readDb();
    const index = db.products.findIndex((p) => p.id === id || String(p.id) === String(id));

    if (index === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const existing = db.products[index];
    const resolvedName = name || title;
    const resolvedCategory = category ? normalizeCategory(category) : existing.category;
    const resolvedImage = image || image_url || existing.image;

    let resolvedFeatures = existing.features;
    if (Array.isArray(features)) {
      resolvedFeatures = features.map((f: any) => String(f).trim()).filter(Boolean);
    } else if (typeof features === 'string') {
      resolvedFeatures = features.split('\n').map((f: string) => f.trim()).filter(Boolean);
    }

    const updated = {
      ...existing,
      name: resolvedName !== undefined ? String(resolvedName).trim() : existing.name,
      category: resolvedCategory,
      price: price !== undefined && Number(price) > 0 ? Number(price) : existing.price,
      description: description !== undefined ? String(description).trim() : existing.description,
      features: resolvedFeatures,
      image: resolvedImage,
      inStock: inStock !== undefined ? Boolean(inStock) : existing.inStock,
    };

    db.products[index] = updated;
    writeDb(db);

    res.json(updated);
  });

  app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const index = db.products.findIndex((p) => p.id === id || String(p.id) === String(id));

    if (index === -1) {
      res.json({ success: true, deletedId: id });
      return;
    }

    const deleted = db.products.splice(index, 1)[0];
    writeDb(db);

    res.json({ success: true, deletedId: deleted.id });
  });

  // -------------------------------------------------------------
  // Public Contact / Inquiry Form (Submit only)
  // -------------------------------------------------------------
  app.post('/api/inquiries', (req, res) => {
    const { name, email, phone, productInterest, message } = req.body;

    if (!name || !phone || !message) {
      res.status(400).json({ error: 'Name, phone number, and message are required' });
      return;
    }

    const db = readDb();
    const newInquiry = {
      id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: String(name).trim(),
      email: String(email || '').trim(),
      phone: String(phone).trim(),
      productInterest: String(productInterest || 'General Inquiry').trim(),
      message: String(message).trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    db.inquiries.unshift(newInquiry);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. Skytec Industries team will contact you shortly.',
      id: newInquiry.id,
    });
  });

  // -------------------------------------------------------------
  // Protected Inquiries API (Admin Read, Update, Delete only)
  // -------------------------------------------------------------
  app.get('/api/inquiries', requireAdminAuth, (req, res) => {
    const db = readDb();
    res.json(db.inquiries);
  });

  app.patch('/api/inquiries/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const { isRead } = req.body;

    const db = readDb();
    const inquiry = db.inquiries.find((i) => i.id === id);

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    if (typeof isRead === 'boolean') {
      inquiry.isRead = isRead;
      writeDb(db);
    }

    res.json(inquiry);
  });

  app.delete('/api/inquiries/:id', requireAdminAuth, (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const index = db.inquiries.findIndex((i) => i.id === id || String(i.id) === String(id));

    if (index === -1) {
      res.json({ success: true, deletedId: id });
      return;
    }

    const deleted = db.inquiries.splice(index, 1)[0];
    writeDb(db);

    res.json({ success: true, deletedId: deleted.id });
  });

  // -------------------------------------------------------------
  // Vite Integration & Static Serving
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Skytec Industries server running on http://localhost:${PORT}`);
  });
}

startServer();
