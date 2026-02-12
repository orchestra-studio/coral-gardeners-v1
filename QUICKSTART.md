# Quick Start Guide

Get the project up and running in minutes.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

---

## Backend Setup

### 1. Navigate to backend directory

```bash
cd back-end
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Environment
NODE_ENV=development
PORT=3001

# Database Configuration (SQLite for development)
DB_TYPE=sqlite
SQLITE_DATABASE=./database.sqlite

# JWT Configuration (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Cloudflare R2 Configuration (optional - for file uploads)
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-public-url.r2.dev

# LLM API Keys (at least one required for AI features)
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
GOOGLE_API_KEY=your-google-api-key
# OPENAI_API_KEY=sk-your-openai-api-key
# ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
```

### 4. Seed the database

```bash
npm run seed
# or
yarn seed
```

### 5. Start the development server

```bash
npm run dev
# or
yarn dev
```

Backend runs on `http://localhost:3001`

---

## Frontend Setup

Open a **new terminal**:

### 1. Navigate to frontend directory

```bash
cd front-end
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# API Configuration (NestJS Backend)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# WebSocket URL
NEXT_PUBLIC_WEBSOCKET_BASE_URL=http://localhost:3001

# Weather API Key (optional)
WEATHER_API_KEY=your-weather-api-key
```

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
```

Frontend runs on `http://localhost:3000`

---

## Quick Reference

| Command    | Backend                        | Frontend                       |
| ---------- | ------------------------------ | ------------------------------ |
| Install    | `npm install` / `yarn install` | `npm install` / `yarn install` |
| Dev Server | `npm run dev` / `yarn dev`     | `npm run dev` / `yarn dev`     |
| Build      | `npm run build` / `yarn build` | `npm run build` / `yarn build` |
| Seed DB    | `npm run seed` / `yarn seed`   | N/A                            |
| Reset DB   | `npm run reset` / `yarn reset` | N/A                            |

## Default Ports

- **Backend API:** `http://localhost:3001/api`
- **Frontend:** `http://localhost:3000`

---

## Need More Help?

- Backend documentation: [back-end/docs/README.md](back-end/docs/README.md)
- Frontend documentation: [front-end/docs/README.md](front-end/docs/README.md)

---

## 🚀 Deployment with Railway

We recommend [Railway](https://railway.com?referralCode=ZhS3UI) for deploying this project.

### Why Railway?

| Feature                   | Benefit                                             |
| ------------------------- | --------------------------------------------------- |
| **One-Click Deploy**      | Deploy directly from GitHub with zero configuration |
| **Free $5 Credit**        | Start building without a credit card                |
| **Auto Scaling**          | Handles traffic spikes automatically                |
| **Built-in Databases**    | MySQL, PostgreSQL, Redis with one click             |
| **Environment Variables** | Secure secrets management                           |
| **Custom Domains**        | Free SSL certificates included                      |
| **GitHub Integration**    | Auto-deploy on every push                           |
| **Real-time Logs**        | Easy debugging and monitoring                       |

### Get Started with Railway

1. Sign up using [this referral link](https://railway.com?referralCode=ZhS3UI) and get **$20 in free credits**
2. Connect your GitHub repository
3. Add your environment variables
4. Deploy with one click!

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com?referralCode=ZhS3UI)
