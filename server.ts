import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index';
import * as schema from './src/db/schema';
import { eq, desc } from 'drizzle-orm';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

async function startServer() {
  const app = express();
  
  app.use(express.json());
  app.use(cookieParser());

  // Check if DB is connected (simple test)
  let dbConnected = false;
  try {
    if (process.env.DATABASE_URL) {
      await db.select().from(schema.settings).limit(1);
      dbConnected = true;
      console.log('PostgreSQL connected via DATABASE_URL');
    }
  } catch (err) {
    console.warn('Database not connected or schema not initialized. Using mock data mode.');
  }

  // --- MOCK DATA ---
  // In case user hasn't provided DATABASE_URL yet
  const mockData = {
    projects: [
      { id: 1, title: 'Portfolio Template', slug: 'portfolio', description: 'A headless CMS portfolio.', technologies: 'React, Express', published: true }
    ],
    skills: [
      { id: 1, name: 'TypeScript', category: 'Language', proficiency: 90 },
      { id: 2, name: 'React', category: 'Frontend', proficiency: 85 }
    ],
    experience: [
      { id: 1, company: 'Tech Inc', role: 'Senior Developer', current: true }
    ],
    blogPosts: [
      { id: 1, title: 'Hello World', slug: 'hello-world', excerpt: 'My first post', published: true, createdAt: new Date() }
    ],
    settings: {
      siteName: 'My Portfolio',
      siteDescription: 'Welcome to my portfolio'
    }
  };

  // --- AUTH MIDDLEWARE ---
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // --- API ROUTES ---
  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
      res.cookie('admin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true });
  });

  app.get('/api/auth/status', (req, res) => {
    const token = req.cookies.admin_token;
    try {
      if (token && jwt.verify(token, JWT_SECRET)) {
        res.json({ authenticated: true });
      } else {
        res.json({ authenticated: false });
      }
    } catch {
      res.json({ authenticated: false });
    }
  });

  // Data endpoints
  app.get('/api/public/projects', async (req, res) => {
    if (dbConnected) {
      const p = await db.select().from(schema.projects).where(eq(schema.projects.published, true));
      res.json(p);
    } else {
      res.json(mockData.projects);
    }
  });

  app.get('/api/public/skills', async (req, res) => {
    if (dbConnected) {
      const s = await db.select().from(schema.skills);
      res.json(s);
    } else {
      res.json(mockData.skills);
    }
  });
  
  app.get('/api/public/experience', async (req, res) => {
    if (dbConnected) {
      const e = await db.select().from(schema.experience);
      res.json(e);
    } else {
      res.json(mockData.experience);
    }
  });

  app.get('/api/public/blog', async (req, res) => {
    if (dbConnected) {
      const b = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.published, true)).orderBy(desc(schema.blogPosts.createdAt));
      res.json(b);
    } else {
      res.json(mockData.blogPosts);
    }
  });

  app.get('/api/public/settings', async (req, res) => {
    if (dbConnected) {
      const s = await db.select().from(schema.settings);
      const obj = s.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
      res.json(obj);
    } else {
      res.json(mockData.settings);
    }
  });

  
  // --- ADMIN API ROUTES ---
  
  // Projects
  app.post('/api/admin/projects', requireAdmin, async (req, res) => {
    if (dbConnected) {
      await db.insert(schema.projects).values(req.body);
      res.json({ success: true });
    } else {
      mockData.projects.push({ id: Date.now(), ...req.body });
      res.json({ success: true });
    }
  });

  app.put('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (dbConnected) {
      await db.update(schema.projects).set(req.body).where(eq(schema.projects.id, id));
      res.json({ success: true });
    } else {
      const idx = mockData.projects.findIndex(p => p.id === id);
      if (idx !== -1) mockData.projects[idx] = { ...mockData.projects[idx], ...req.body };
      res.json({ success: true });
    }
  });

  app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (dbConnected) {
      await db.delete(schema.projects).where(eq(schema.projects.id, id));
      res.json({ success: true });
    } else {
      mockData.projects = mockData.projects.filter(p => p.id !== id);
      res.json({ success: true });
    }
  });

  app.get('/api/admin/projects', requireAdmin, async (req, res) => {
    if (dbConnected) {
      const p = await db.select().from(schema.projects);
      res.json(p);
    } else {
      res.json(mockData.projects);
    }
  });

  // Blog
  app.get('/api/admin/blog', requireAdmin, async (req, res) => {
    if (dbConnected) {
      const b = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt));
      res.json(b);
    } else {
      res.json(mockData.blogPosts);
    }
  });

  app.post('/api/admin/blog', requireAdmin, async (req, res) => {
    if (dbConnected) {
      await db.insert(schema.blogPosts).values({ ...req.body, createdAt: new Date() });
      res.json({ success: true });
    } else {
      mockData.blogPosts.push({ id: Date.now(), createdAt: new Date(), ...req.body });
      res.json({ success: true });
    }
  });

  app.put('/api/admin/blog/:id', requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (dbConnected) {
      await db.update(schema.blogPosts).set({ ...req.body, updatedAt: new Date() }).where(eq(schema.blogPosts.id, id));
      res.json({ success: true });
    } else {
      const idx = mockData.blogPosts.findIndex(p => p.id === id);
      if (idx !== -1) mockData.blogPosts[idx] = { ...mockData.blogPosts[idx], ...req.body, updatedAt: new Date() };
      res.json({ success: true });
    }
  });

  app.delete('/api/admin/blog/:id', requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (dbConnected) {
      await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
      res.json({ success: true });
    } else {
      mockData.blogPosts = mockData.blogPosts.filter(p => p.id !== id);
      res.json({ success: true });
    }
  });

  // Settings
  app.post('/api/admin/settings', requireAdmin, async (req, res) => {
    const { key, value } = req.body;
    if (dbConnected) {
      // Upsert
      await db.insert(schema.settings)
        .values({ key, value })
        .onConflictDoUpdate({ target: schema.settings.key, set: { value } });
      res.json({ success: true });
    } else {
      mockData.settings[key] = value;
      res.json({ success: true });
    }
  });

  // --- VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
