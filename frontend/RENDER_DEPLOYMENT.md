# Render Static Site Configuration

## Important: SPA Routing Setup

This file ensures all routes redirect to index.html for client-side routing.

## Deployment Steps:

1. **In Render Dashboard:**

   - Service Type: **Static Site**
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **The `_redirects` file in the `public` folder will be automatically copied to `dist` during build**

3. **After deployment, Render will use the `_redirects` file to handle routing**

## File: `public/_redirects`

```
/* /index.html 200
```

This tells Render to serve `index.html` for all routes with a 200 status code.

## Troubleshooting:

If you still see 404 errors after deployment:

1. **Check Build Logs**: Verify `_redirects` is copied to `dist/`
2. **Check Publish Directory**: Must be set to `dist` (not `frontend/dist`)
3. **Redeploy**: Sometimes Render needs a manual redeploy to pick up the changes
4. **Clear Cache**: In Render dashboard, go to Settings → Clear Build Cache & Deploy
