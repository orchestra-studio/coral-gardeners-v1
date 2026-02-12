# Coral Gardeners Dashboard - Deployment Guide

## Prerequisites Completed ✅

- ✅ Code committed to Git
- ✅ GitHub repository created: https://github.com/LG15601/coral-gardeners-dashboard
- ✅ Code pushed to GitHub
- ✅ Production environment files configured
- ✅ render.yaml Blueprint ready

## Step 1: Deploy Backend to Render

### Option A: Blueprint Deployment (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Blueprint**
3. Connect your GitHub account if not already connected
4. Select repository: `LG15601/coral-gardeners-dashboard`
5. Render will detect `render.yaml` and show:
   - **Web Service**: `cg-dashboard-backend`
   - **Database**: `cg-dashboard-db` (PostgreSQL)
6. Click **Apply** to create both services

This will automatically:
- Create the PostgreSQL database
- Create the web service
- Configure environment variables from render.yaml
- Set health check endpoint to `/api/health`
- Start the deployment

### Configure Missing Environment Variables

After Blueprint deployment, go to your web service settings:

1. **Render Dashboard** → **cg-dashboard-backend** → **Environment**
2. Add these environment variables:

   ```
   FRONTEND_URL=https://placeholder.vercel.app
   CORS_ORIGIN=https://placeholder.vercel.app
   DEEPSEEK_API_KEY=your-deepseek-api-key
   ```

   **Note:** We'll update FRONTEND_URL and CORS_ORIGIN after Vercel deployment.

3. Click **Save Changes** (this triggers a redeploy)

### Enable PgBouncer Connection Pooling

1. **Render Dashboard** → **cg-dashboard-db** (database)
2. Click **Info** tab
3. Scroll to **Connection Pooling** section
4. Click **Enable** next to PgBouncer
5. Copy the **Pooled Connection String** (port 6543, not 5432)
6. Go back to **cg-dashboard-backend** → **Environment**
7. Update `DATABASE_URL` with the pooled connection string
8. Click **Save Changes**

### Note the Backend URL

After deployment completes:
- Your backend will be available at: `https://cg-dashboard-backend.onrender.com`
- Health check: `https://cg-dashboard-backend.onrender.com/api/health`

**Keep this URL handy** - you'll need it for Vercel deployment.

---

## Step 2: Deploy Frontend to Vercel

You can deploy using Vercel CLI (I can run this for you) or via Dashboard.

### Environment Variables Required

Before deploying, you'll need to set these in Vercel:

```
NEXT_PUBLIC_API_BASE_URL=https://cg-dashboard-backend.onrender.com/api
NEXT_PUBLIC_WEBSOCKET_BASE_URL=https://cg-dashboard-backend.onrender.com
```

### Option A: Vercel CLI (Automated)

I can run this command for you once you provide the Render backend URL:

```bash
cd front-end && vercel --yes --prod \
  -e NEXT_PUBLIC_API_BASE_URL=https://YOUR-RENDER-URL.onrender.com/api \
  -e NEXT_PUBLIC_WEBSOCKET_BASE_URL=https://YOUR-RENDER-URL.onrender.com
```

### Option B: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **Add New** → **Project**
3. Import `LG15601/coral-gardeners-dashboard`
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `front-end`
   - **Build Command**: (leave default)
   - **Output Directory**: (leave default)
5. Add **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL` = `https://cg-dashboard-backend.onrender.com/api`
   - `NEXT_PUBLIC_WEBSOCKET_BASE_URL` = `https://cg-dashboard-backend.onrender.com`
6. Click **Deploy**

---

## Step 3: Update Backend with Frontend URL

After Vercel deployment:

1. Note your Vercel URL: `https://coral-gardeners-dashboard.vercel.app` (or similar)
2. Go back to **Render Dashboard** → **cg-dashboard-backend** → **Environment**
3. Update:
   - `FRONTEND_URL` = Your Vercel URL
   - `CORS_ORIGIN` = Your Vercel URL
4. Click **Save Changes** (triggers redeploy)

---

## Step 4: Verification

### Backend Health Check
```bash
curl https://cg-dashboard-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "info": {
    "database": {"status": "up"},
    "memory_heap": {"status": "up"}
  }
}
```

### Frontend
1. Visit your Vercel URL
2. Dashboard should load (login page or main page)
3. Open DevTools (F12) → Console
4. Check for errors:
   - ❌ No CORS errors
   - ❌ No "Failed to fetch" errors
   - ✅ API requests succeed

---

## Deployment URLs

Once deployed, your URLs will be:
- **Backend**: `https://cg-dashboard-backend.onrender.com`
- **Frontend**: `https://[your-project].vercel.app`
- **Database**: Managed PostgreSQL on Render with PgBouncer

---

## Next Steps

After deployment is verified:
1. Test login functionality
2. Verify WebSocket connection
3. Check AI chat features
4. Proceed with Phase 2 development

---

## Troubleshooting

### Backend won't start
- Check Render logs for database connection errors
- Verify DATABASE_URL is using the pooled connection string (port 6543)
- Ensure JWT_SECRET was auto-generated

### Frontend shows CORS errors
- Verify CORS_ORIGIN on backend matches your Vercel URL exactly
- Check for trailing slashes (should not have them)
- Ensure both services have redeployed after environment variable changes

### Database connection timeout
- PgBouncer should be enabled
- Use the pooled connection string, not the direct connection string
- Check connection limits in Render dashboard
