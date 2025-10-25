# Loop Email Integration for CofounderBase

## Overview
When a profile is approved in the admin panel, an automated email is sent to the user via Loop email service.

## Email Template Details
- **Template Message**: "Hi {{first_name}}, Great news—your cofounderBase profile is now live! Profile: {{profile_url}} Thanks, Ranjeet"
- **Loop Transaction ID**: `cmh5zg5h5gboc1c0iu7yqm1gk`
- **Loop API Key**: `e1f1c8562ba140b5d6fe1a0a1fb9a651`

## Data Variables Sent to Loop
The following variables are sent to Loop and can be used in your email template:

1. **`first_name`** - First name extracted from full name (e.g., "John" from "John Doe")
2. **`profile_url`** - Direct link to the user's profile (e.g., "https://cofounderbase.com/profile/123")
3. **`full_name`** - Complete name of the user
4. **`role`** - User's role (founder, cofounder, or investor)

## Environment Variables for Vercel

You need to add these environment variables in your Vercel dashboard:

### Required Variables:
```
VITE_SUPABASE_URL=https://wwkoqrqzxlhqvbvpiwpr.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3a29xcnF6eGxocXZidnBpd3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjE1MjAsImV4cCI6MjA3NjE5NzUyMH0.bqxKTAU62M2KD0gec9HC_kJfJMZN_BZpn2PAbDLwbKg
VITE_LOOP_API_KEY=e1f1c8562ba140b5d6fe1a0a1fb9a651
VITE_LOOP_TRANSACTION_ID=cmh5zg5h5gboc1c0iu7yqm1gk
VITE_BASE_URL=https://cofounderbase.com
```

## How to Add Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your CofounderBase project
3. Go to Settings → Environment Variables
4. Add each variable with its value
5. Make sure to select "Production", "Preview", and "Development" for each variable
6. Redeploy your application

## Loop Email Template Setup:

In your Loop dashboard, make sure your email template includes:

```html
Hi {{first_name}},

Great news—your cofounderBase profile is now live!

Profile: {{profile_url}}

Thanks,
Ranjeet
```

## Testing:

1. Submit a test profile through the form
2. Go to admin panel and approve the profile
3. Check if the email is sent successfully
4. Verify the profile URL works correctly

## Troubleshooting:

- If emails aren't sending, check the browser console for error messages
- Verify all environment variables are set correctly in Vercel
- Ensure the Loop API key and transaction ID are correct
- Check that the base URL matches your domain

## Email Flow:

1. User submits profile → Profile created with `approved: false`
2. Admin approves profile → `approved: true` + Email sent via Loop
3. User receives email with direct link to their live profile