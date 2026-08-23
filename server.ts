import express from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { db } from './src/db/index';
import * as schema from './src/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { uploadMedia, deleteMedia, listMedia } from './src/lib/storage';

const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET;
const ADMIN_GITHUB_ID = process.env.ADMIN_GITHUB_ID || process.env.ADMIN_GITHUB_USERNAME || 'whysixmift';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const DOMAIN = process.env.DOMAIN || 'portfoliojulian.web.id';

const app = express();
app.use(express.json());
app.use(cookieParser());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
});

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
if (fs.existsSync(UPLOAD_DIR)) {
  app.use('/uploads', express.static(UPLOAD_DIR));
}

app.get('/health', async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ status: 'error', db: 'disconnected', reason: 'DATABASE_URL missing' });
    }
    await db.select().from(schema.settings).limit(1);
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message || 'Database error' });
  }
});

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!JWT_SECRET) return res.status(500).json({ error: 'AUTH_SECRET is not configured.' });
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized: No session token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded && decoded.role === 'admin') {
      (req as any).user = decoded;
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid role' });
  } catch {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

app.get('/api/auth/github', (req, res) => {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !ADMIN_GITHUB_ID || !JWT_SECRET) {
    return res.status(503).json({ error: 'GitHub admin authentication is not configured.' });
  }
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || DOMAIN;
  const redirectUri = `${protocol}://${host}/api/auth/github/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`;
  res.redirect(githubAuthUrl);
});

app.get('/api/auth/github/callback', async (req, res) => {
  const { code } = req.query;
  if (!code || typeof code !== 'string') return res.status(400).send('Authorization code missing');
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !ADMIN_GITHUB_ID || !JWT_SECRET) {
    return res.status(503).send('GitHub admin authentication is not configured.');
  }

  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || DOMAIN;
    const redirectUri = `${protocol}://${host}/api/auth/github/callback`;

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code, redirect_uri: redirectUri })
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.status(401).send('Failed to obtain GitHub access token');

    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'Portfolio-App' }
    });
    const ghUser = await userRes.json();

    const isWhitelisted = String(ghUser.id) === String(ADMIN_GITHUB_ID) ||
      ghUser.login?.toLowerCase() === String(ADMIN_GITHUB_ID).toLowerCase();
    if (!isWhitelisted) return res.status(403).send('Forbidden: GitHub account is not authorized as admin.');

    const token = jwt.sign({ role: 'admin', githubId: ghUser.id, username: ghUser.login }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });
    res.redirect('/admin');
  } catch (err: any) {
    console.error('GitHub OAuth error:', err);
    res.status(500).send('Authentication failed');
  }
});

app.post('/api/auth/login', (req, res) => {
  res.status(404).json({ error: 'Password authentication is disabled. Use GitHub OAuth.' });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('admin_token', { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  res.json({ success: true });
});

app.get('/api/auth/status', (req, res) => {
  const token = req.cookies.admin_token;
  const oauthReady = Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET && ADMIN_GITHUB_ID && JWT_SECRET);
  if (!token) return res.json({ authenticated: false, githubOauthAvailable: oauthReady });
  if (!JWT_SECRET) return res.json({ authenticated: false, githubOauthAvailable: oauthReady });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded && decoded.role === 'admin') return res.json({ authenticated: true, user: decoded, githubOauthAvailable: oauthReady });
    return res.json({ authenticated: false, githubOauthAvailable: oauthReady });
  } catch {
    return res.json({ authenticated: false, githubOauthAvailable: oauthReady });
  }
});

app.get('/api/public/projects', async (req, res) => {
  try {
    const p = await db.select().from(schema.projects).where(eq(schema.projects.published, true)).orderBy(asc(schema.projects.order), desc(schema.projects.id));
    res.json(p);
  } catch (err: any) { res.status(500).json({ error: 'Failed to fetch public projects', detail: err.message }); }
});

app.get('/api/public/skills', async (req, res) => {
  try { res.json(await db.select().from(schema.skills)); }
  catch (err: any) { res.status(500).json({ error: 'Failed to fetch public skills', detail: err.message }); }
});

app.get('/api/public/experience', async (req, res) => {
  try { res.json(await db.select().from(schema.experience).orderBy(desc(schema.experience.startDate))); }
  catch (err: any) { res.status(500).json({ error: 'Failed to fetch public experience', detail: err.message }); }
});

app.get('/api/public/blog', async (req, res) => {
  try { res.json(await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.published, true)).orderBy(desc(schema.blogPosts.createdAt))); }
  catch (err: any) { res.status(500).json({ error: 'Failed to fetch blog posts', detail: err.message }); }
});

app.get('/api/public/settings', async (req, res) => {
  try {
    const s = await db.select().from(schema.settings);
    res.json(s.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}));
  } catch (err: any) { res.status(500).json({ error: 'Failed to fetch settings', detail: err.message }); }
});

app.post('/api/admin/media/upload', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const publicUrl = await uploadMedia(req.file.buffer, req.file.originalname, req.file.mimetype);
    res.json({ success: true, url: publicUrl, size: req.file.size });
  } catch (err: any) { res.status(500).json({ error: err.message || 'Media upload failed' }); }
});

app.get('/api/admin/media', requireAdmin, async (req, res) => {
  try { res.json(await listMedia()); }
  catch (err: any) { res.status(500).json({ error: err.message || 'Failed to list media' }); }
});

app.delete('/api/admin/media/:filename', requireAdmin, async (req, res) => {
  try {
    const deleted = await deleteMedia(req.params.filename);
    if (!deleted) return res.status(404).json({ error: 'File not found or delete failed' });
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/projects', requireAdmin, async (req, res) => {
  try { res.json(await db.select().from(schema.projects).orderBy(asc(schema.projects.order), desc(schema.projects.id))); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/projects', requireAdmin, async (req, res) => {
  try { const inserted = await db.insert(schema.projects).values(req.body).returning(); res.json({ success: true, project: inserted[0] }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  try { const id = parseInt(req.params.id, 10); const updated = await db.update(schema.projects).set(req.body).where(eq(schema.projects.id, id)).returning(); res.json({ success: true, project: updated[0] }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  try { const id = parseInt(req.params.id, 10); await db.delete(schema.projects).where(eq(schema.projects.id, id)); res.json({ success: true }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/projects/reorder', requireAdmin, async (req, res) => {
  try { const items: { id: number; order: number }[] = req.body; for (const item of items) await db.update(schema.projects).set({ order: item.order }).where(eq(schema.projects.id, item.id)); res.json({ success: true }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/blog', requireAdmin, async (req, res) => {
  try { res.json(await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt))); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/blog', requireAdmin, async (req, res) => {
  try { const inserted = await db.insert(schema.blogPosts).values({ ...req.body, createdAt: new Date(), updatedAt: new Date() }).returning(); res.json({ success: true, post: inserted[0] }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/blog/:id', requireAdmin, async (req, res) => {
  try { const id = parseInt(req.params.id, 10); const updated = await db.update(schema.blogPosts).set({ ...req.body, updatedAt: new Date() }).where(eq(schema.blogPosts.id, id)).returning(); res.json({ success: true, post: updated[0] }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/blog/:id', requireAdmin, async (req, res) => {
  try { const id = parseInt(req.params.id, 10); await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id)); res.json({ success: true }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    const settingsPayload = req.body;
    if (typeof settingsPayload === 'object' && settingsPayload && !('key' in settingsPayload)) {
      for (const [key, value] of Object.entries(settingsPayload)) {
        await db.insert(schema.settings).values({ key, value: String(value) }).onConflictDoUpdate({ target: schema.settings.key, set: { value: String(value) } });
      }
    } else if (settingsPayload && 'key' in settingsPayload && 'value' in settingsPayload) {
      await db.insert(schema.settings).values({ key: settingsPayload.key, value: String(settingsPayload.value) }).onConflictDoUpdate({ target: schema.settings.key, set: { value: String(settingsPayload.value) } });
    }
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/skills', requireAdmin, async (req, res) => {
  try { res.json(await db.select().from(schema.skills)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/skills', requireAdmin, async (req, res) => {
  try { const inserted = await db.insert(schema.skills).values(req.body).returning(); res.json({ success: true, skill: inserted[0] }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/skills/:id', requireAdmin, async (req, res) => {
  try { const id = parseInt(req.params.id, 10); await db.delete(schema.skills).where(eq(schema.skills.id, id)); res.json({ success: true }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Standalone server running on http://0.0.0.0:${PORT}`));
}

export default app;
