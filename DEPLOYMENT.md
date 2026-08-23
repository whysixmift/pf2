# Vercel + Supabase Production Deployment Guide

This application is configured for deployment on **Vercel** (application runtime) and **Supabase** (PostgreSQL database & persistent media storage).

---

## 🚀 Quick Deployment Command

```bash
./deploy.sh
```

---

## 🛠️ Required Environment Variables

Set these credentials in your shell environment or `.env` file before deploying:

```env
# Vercel CLI Authentication Token
VERCEL_TOKEN=your_vercel_token

# Supabase Credentials
SUPABASE_PROJECT_REF=your_supabase_project_ref
SUPABASE_DB_PASSWORD=your_supabase_db_password
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Single-Admin GitHub OAuth
ADMIN_GITHUB_ID=your_github_username_or_id
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Session Secret & Custom Domain
AUTH_SECRET=your_32_plus_char_random_secret
DOMAIN=portfoliojulian.web.id
```

---

## 🌐 Cloudflare DNS Configuration

Configure the following records in your Cloudflare dashboard for `portfoliojulian.web.id`:

| Type | Name | Target / Content | Proxy Status |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | DNS Only (Grey Cloud) during setup |
| **CNAME** | `www` | `cname.vercel-dns.com` | DNS Only / Proxied |

---

## 🔐 GitHub OAuth Callback URL

In your GitHub Developer Settings → OAuth Apps:

- **Homepage URL**: `https://portfoliojulian.web.id`
- **Authorization callback URL**: `https://portfoliojulian.web.id/api/auth/github/callback`

---

## 💾 Architecture Overview

- **Frontend**: React 19 + Vite SPA (compiled to static `dist`).
- **API Server**: Express 4 running as a Vercel Serverless Function (`/api/index.ts`).
- **Database**: PostgreSQL on Supabase managed via Drizzle ORM.
- **Media Storage**: Supabase Storage (`portfolio-media` public bucket).
