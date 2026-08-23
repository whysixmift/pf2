const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

// Replace the simplified mock edits with full mock edits
const adminRoutesReplacement = `
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
`;

// Basic string replacement for the admin routes section
const parts = serverCode.split('// Admin routes (simplified mock edits for demonstration if not DB connected)');
if (parts.length === 2) {
  const parts2 = parts[1].split('// --- VITE MIDDLEWARE ---');
  if (parts2.length === 2) {
    const newCode = parts[0] + adminRoutesReplacement + parts2[1];
    fs.writeFileSync('server.ts', newCode);
    console.log("Successfully updated server.ts routes");
  } else {
    console.log("Could not find VITE MIDDLEWARE section");
  }
} else {
  console.log("Could not find Admin routes section");
}
