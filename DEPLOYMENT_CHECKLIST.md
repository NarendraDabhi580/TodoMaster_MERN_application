# 🚀 Deployment Checklist - SPA Routing Fix

## ✅ Pre-Deployment Verification

Run these checks before deploying:

### 1. Local Build Test

```bash
cd frontend
./test-spa-routing.sh
```

This script will:

- ✅ Verify `_redirects` exists in `public/`
- ✅ Build the project
- ✅ Verify `_redirects` was copied to `dist/`
- ✅ Check `index.html` exists

### 2. Local Server Test

```bash
npm run serve:prod
```

Then test these URLs:

- [ ] http://localhost:3000/ - Homepage loads
- [ ] http://localhost:3000/login - Login page loads
- [ ] **Refresh on /login** - Should NOT show 404
- [ ] http://localhost:3000/register - Register page loads
- [ ] **Refresh on /register** - Should NOT show 404
- [ ] http://localhost:3000/tasks - Should redirect to login
- [ ] **Refresh on /tasks** - Should NOT show 404

### 3. Files Changed

Verify these files were updated:

- [ ] `frontend/public/_redirects` - Updated with comment
- [ ] `render.yaml` - Updated with better comments
- [ ] `backend/server.js` - Enhanced SPA fallback routing

---

## 🚀 Deployment Steps

### Option 1: Deploy with Current Setup (Two Services)

**Step 1: Commit Changes**

```bash
git add .
git commit -m "Fix: SPA routing with _redirects file for Render deployment"
git push origin main
```

**Step 2: Wait for Render Auto-Deploy**

- Render will automatically detect the push
- Frontend service will rebuild
- Backend service will rebuild

**Step 3: Verify Deployment**
After build completes:

- [ ] Visit: `https://your-frontend.onrender.com/`
- [ ] Visit: `https://your-frontend.onrender.com/login`
- [ ] **Refresh the page** - Should work!
- [ ] Visit: `https://your-frontend.onrender.com/register`
- [ ] **Refresh the page** - Should work!

**Step 4: Check \_redirects File**

- [ ] Visit: `https://your-frontend.onrender.com/_redirects`
- Should show: `# Redirect all routes to index.html for SPA routing`
- And: `/*    /index.html   200`

---

### Option 2: Deploy as Single Service (Alternative)

If Option 1 doesn't work, try this:

**Step 1: Backup Current Config**

```bash
mv render.yaml render-two-services.yaml.backup
mv render-single-service.yaml render.yaml
```

**Step 2: Update Render Dashboard**

1. Go to Render Dashboard
2. Delete the frontend static site service (keep backend)
3. Update backend service build command:
   ```
   cd backend && npm install && cd ../frontend && npm install && npm run build
   ```

**Step 3: Commit and Deploy**

```bash
git add .
git commit -m "Switch to single service deployment"
git push origin main
```

**Step 4: Verify**

- [ ] Visit: `https://your-backend.onrender.com/`
- [ ] Visit: `https://your-backend.onrender.com/login`
- [ ] **Refresh** - Should work!

---

## 🔍 Post-Deployment Verification

### Test All Routes

- [ ] `/` - Homepage
- [ ] `/login` - Login page (refresh works)
- [ ] `/register` - Register page (refresh works)
- [ ] `/forgot-password` - Forgot password page (refresh works)
- [ ] `/tasks` - Tasks page (should redirect if not logged in)
- [ ] `/priorities` - Priorities page (should redirect if not logged in)
- [ ] `/analytics` - Analytics page (should redirect if not logged in)
- [ ] `/profile` - Profile page (should redirect if not logged in)
- [ ] `/about` - About page (refresh works)

### Test Authentication Flow

- [ ] Register new user
- [ ] Login with user
- [ ] Navigate to `/tasks`
- [ ] **Refresh on /tasks** - Should stay on tasks page
- [ ] Logout
- [ ] Try to access `/tasks` - Should redirect to login

### Test Direct URLs

Type these directly in browser address bar:

- [ ] `https://your-site.onrender.com/login`
- [ ] `https://your-site.onrender.com/register`
- [ ] `https://your-site.onrender.com/about`

All should load correctly without 404!

---

## 🐛 Troubleshooting

### Issue: Still getting 404 on refresh

**Solution 1: Clear Render Cache**

1. Render Dashboard → Your Frontend Service
2. Settings → "Clear Build Cache & Deploy"
3. Wait for rebuild
4. Test again

**Solution 2: Check Build Logs**

1. Render Dashboard → Your Service → Logs
2. Look for: "Copying \_redirects to dist/"
3. If not found, check `vite.config.js` has `publicDir: "public"`

**Solution 3: Verify Publish Directory**

1. Render Dashboard → Settings
2. Publish Directory should be: `dist`
3. NOT `frontend/dist` (if deploying from frontend folder)

**Solution 4: Manual Verification**

```bash
# On your local machine
cd frontend
npm run build
ls dist/_redirects  # Should exist
cat dist/_redirects  # Should show redirect rule
```

### Issue: API calls failing

**Check CORS settings:**

- Backend should allow frontend URL in CORS
- Check `backend/server.js` CORS configuration
- Verify `FRONTEND_URL` environment variable in Render

### Issue: Environment variables not set

**Verify in Render Dashboard:**

- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` (your MongoDB connection string)
- [ ] `JWT_SECRET` (your JWT secret)
- [ ] `EMAIL_USER` (for password reset)
- [ ] `EMAIL_PASS` (for password reset)
- [ ] `CLIENT_URL` (your frontend URL)
- [ ] `FRONTEND_URL` (your frontend URL)

---

## 📊 Success Criteria

Your deployment is successful when:

- ✅ All routes load without 404
- ✅ Refreshing any page works correctly
- ✅ Direct URLs work (typing in address bar)
- ✅ Authentication flow works
- ✅ API calls succeed
- ✅ No console errors in browser

---

## 📝 Notes

- The `_redirects` file is the key to fixing SPA routing on Render
- It must be in the `dist/` folder after build
- Vite automatically copies files from `public/` to `dist/`
- The regex in backend `server.js` excludes `/api` routes
- This ensures API calls go to backend, everything else to frontend

---

## 🆘 Need Help?

If you're still having issues:

1. **Check this guide:** `FIX_RENDER_ROUTING.md`
2. **Run test script:** `./test-spa-routing.sh`
3. **Check Render logs:** Look for errors in build/runtime logs
4. **Verify files:** Ensure `_redirects` is in `dist/` after build

---

## 🎉 Success!

Once everything works:

- ✅ Mark this checklist as complete
- ✅ Delete backup files if not needed
- ✅ Update documentation if you made custom changes
- ✅ Celebrate! 🎊
