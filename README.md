# Portfolio Application (Production Ready)

A full-stack headless portfolio & CMS built with React 19, TypeScript, Tailwind CSS, Express, Drizzle ORM, and PostgreSQL.

## Features
- **Database-Backed**: PostgreSQL persistence using Drizzle ORM (No mock data in production).
- **Single-Admin CMS**: Protected CMS with GitHub OAuth and single-admin authorization.
- **Media Upload Manager**: Local & persistent object storage for portfolio images.
- **Health Verification**: `/health` endpoint for monitoring container and DB state.
- **Docker Compose**: Containerized production deployment with multi-stage build.

## Quick Start Deployment

```bash
./deploy.sh
```

See [DEPLOYMENT.md](file:///root/pf2/DEPLOYMENT.md) for full deployment, backup, restore, and administration details.
