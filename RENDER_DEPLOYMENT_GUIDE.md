# Render Deployment - SPA Routing Fix

## ✅ Local Testing Confirmed Working

The production build has been tested locally with `serve -s dist` and **SPA routing works perfectly**:

- ✅ Page refresh on `/login` works
- ✅ Direct navigation to `/register` works
- ✅ `_redirects` file is correctly copied to `dist/`

## 🔧 Render Configuration Options

### Option 1: Static Site (Recommended for Frontend Only)

If you're deploying the frontend as a **separate Static Site** on Render:

#### Dashboard Settings:

1. **Build Command**:

   ```bash
   npm install && npm run build
   ```

2. **Publish Directory**:

   ```
   dist
   ```

3. **Auto-Deploy**: Yes (deploys on git push)

#### Important Notes:

- Render **automatically** reads the `_redirects` file from the publish directory
- The `_redirects` file **must** be in the `dist/` folder (✅ confirmed working)
- No additional configuration needed in dashboard

---

### Option 2: Using render.yaml (Monorepo)

If you're using the `render.yaml` file for infrastructure-as-code:

#### Current Configuration:

```yaml
services:
  - type: web
    name: taskmaster-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

#### Potential Issues:

1. **Path Issue**: `staticPublishPath: ./frontend/dist` might need to be absolute
2. **Routes Not Applied**: The `routes` section might not work for static sites

#### Fix for render.yaml:

**Option A - Use \_redirects file (Simpler)**:
Remove the `routes` section and rely on the `_redirects` file:

```yaml
services:
  - type: web
    name: taskmaster-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    # No routes section - _redirects file will handle it
```

**Option B - Deploy frontend separately**:
Create a separate Render Static Site for the frontend instead of using render.yaml

---

## 🚨 Common Issues & Solutions

### Issue 1: "\_redirects file not found"

**Symptoms**: 404 errors on page refresh

**Solution**:

1. Check build logs for: `Copying _redirects to dist/`
2. Verify in local build:
   ```bash
   npm run build
   ls dist/_redirects  # Should exist
   cat dist/_redirects  # Should show: /* /index.html 200
   ```

### Issue 2: "Routes not working with render.yaml"

**Symptoms**: `routes` section in render.yaml is ignored

**Solution**:

- For static sites, Render prefers `_redirects` file over `routes` in YAML
- Remove `routes` section from render.yaml
- Ensure `_redirects` file is in `dist/`

### Issue 3: "Build succeeds but still 404"

**Symptoms**: Build completes, but pages still 404

**Solutions**:

1. **Clear Build Cache**:

   - Render Dashboard → Settings → "Clear Build Cache & Deploy"

2. **Check Publish Directory**:

   - Must be exactly `dist` (not `frontend/dist` if deploying from frontend folder)
   - If using monorepo, use `./frontend/dist`

3. **Verify \_redirects in deployed site**:
   - After deployment, check if `https://your-site.onrender.com/_redirects` exists
   - Should return: `/* /index.html 200`

---

## 🎯 Recommended Deployment Steps

### Step 1: Verify Local Build

```bash
cd frontend
npm run build
ls dist/_redirects  # Confirm it exists
npm run serve:prod  # Test locally on http://localhost:3000
```

### Step 2: Test SPA Routing Locally

1. Navigate to http://localhost:3000/login
2. Refresh the page
3. Should see login page, not "Not Found"

### Step 3: Deploy to Render

**If using Static Site (Recommended)**:

1. Go to Render Dashboard
2. Create New → Static Site
3. Connect your GitHub repo
4. **Root Directory**: `frontend` (if monorepo)
5. **Build Command**: `npm install && npm run build`
6. **Publish Directory**: `dist`
7. Click "Create Static Site"

**If using render.yaml**:

1. Ensure render.yaml is in repo root
2. Push to GitHub
3. Render will auto-detect and deploy
4. If issues persist, switch to Static Site method above

### Step 4: Verify Deployment

1. Wait for build to complete
2. Visit: `https://your-site.onrender.com/login`
3. Refresh the page
4. Should work! ✅

---

## 📝 Checklist

Before deploying, verify:

- [ ] `_redirects` file exists in `frontend/public/`
- [ ] `_redirects` contains: `/* /index.html 200`
- [ ] `vite.config.js` has `publicDir: "public"`
- [ ] Local build includes `_redirects`: `ls dist/_redirects`
- [ ] Local production server works: `npm run serve:prod`
- [ ] Latest changes pushed to GitHub
- [ ] Render build command is correct
- [ ] Render publish directory is correct

---

## 🆘 If Still Not Working

1. **Check Render Build Logs**:

   - Look for `_redirects` being copied
   - Verify no errors during build

2. **Try Manual Redeploy**:

   - Render Dashboard → Manual Deploy → "Clear cache & deploy"

3. **Verify File in Deployment**:

   - SSH into Render (if available) or check deployment files
   - Confirm `_redirects` is in the publish directory

4. **Contact Render Support**:
   - Provide build logs
   - Mention: "SPA routing not working, \_redirects file not being recognized"

---

## 📚 References

- [Render Static Site Docs](https://render.com/docs/static-sites)
- [Render Redirects & Rewrites](https://render.com/docs/redirects-rewrites)
- [Vite Production Deployment](https://vitejs.dev/guide/static-deploy.html)
