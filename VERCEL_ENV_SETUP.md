# Vercel Environment Variable Setup

## Quick Setup Guide

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select your project: **cofounderbase**

### Step 2: Add Environment Variable
1. Click on **Settings** tab
2. Click on **Environment Variables** in the left sidebar
3. Add the following:

```
Name: VITE_ADMIN_PASSWORD
Value: W9@cZt7!mQ#4rTf%X2^vBp8&
Environment: Production, Preview, Development (select all)
```

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button
4. Select "Use existing Build Cache" (optional)
5. Click **Redeploy**

### Step 4: Test
1. Visit your production URL
2. Go to `/admin` or `#admin`
3. Enter the password
4. Verify admin panel access works

## Alternative: Using Vercel CLI

```bash
# Set environment variable
vercel env add VITE_ADMIN_PASSWORD

# When prompted:
# - Enter value: W9@cZt7!mQ#4rTf%X2^vBp8&
# - Select environments: Production, Preview, Development

# Redeploy
vercel --prod
```

## Security Best Practices

1. **Change the default password** to something unique
2. Use a password manager to generate a strong password
3. Never commit `.env` file to Git
4. Rotate passwords regularly
5. Consider implementing OAuth for production

## Troubleshooting

**Issue**: Admin login not working after deployment
**Solution**: Make sure the environment variable is set in Vercel and redeploy

**Issue**: Getting "default_password_change_me" error
**Solution**: Environment variable not set. Follow steps above.

**Issue**: Password works locally but not on Vercel
**Solution**: Environment variables are different for local and production. Set in Vercel dashboard.
