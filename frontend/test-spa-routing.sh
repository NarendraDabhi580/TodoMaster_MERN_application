#!/bin/bash

# Test Script for SPA Routing Fix
# This script verifies that the build is correct before deploying

echo "🔍 Testing SPA Routing Fix..."
echo ""

# Step 1: Check if _redirects exists in public
echo "1️⃣ Checking _redirects in public folder..."
if [ -f "public/_redirects" ]; then
    echo "✅ _redirects exists in public/"
    cat public/_redirects
else
    echo "❌ _redirects NOT found in public/"
    exit 1
fi
echo ""

# Step 2: Build the project
echo "2️⃣ Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Step 3: Check if _redirects was copied to dist
echo "3️⃣ Checking _redirects in dist folder..."
if [ -f "dist/_redirects" ]; then
    echo "✅ _redirects exists in dist/"
    cat dist/_redirects
else
    echo "❌ _redirects NOT found in dist/"
    exit 1
fi
echo ""

# Step 4: Check if index.html exists
echo "4️⃣ Checking index.html in dist..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html exists in dist/"
else
    echo "❌ index.html NOT found in dist/"
    exit 1
fi
echo ""

# Step 5: List dist contents
echo "5️⃣ Dist folder contents:"
ls -lh dist/
echo ""

echo "✅ All checks passed!"
echo ""
echo "📝 Next steps:"
echo "1. Test locally: npm run serve:prod"
echo "2. Visit http://localhost:3000/login and refresh"
echo "3. If it works, commit and push to deploy"
echo ""
echo "🚀 To deploy:"
echo "   git add ."
echo "   git commit -m 'Fix: SPA routing with _redirects file'"
echo "   git push origin main"
