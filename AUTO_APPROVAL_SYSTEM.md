# Auto-Approval System Guide

## Overview
The auto-approval system allows you to control whether new profile submissions are automatically approved and visible on the homepage, or if they require manual approval through the admin panel.

## Features

### ✅ **Auto-Approval Toggle**
- **Location**: Admin Panel header
- **Visual Indicator**: Green (ON) / Red (OFF) button
- **Real-time**: Changes take effect immediately for new submissions

### ✅ **Smart Profile Handling**
- **Auto-Approve ON**: New profiles are immediately visible and users get welcome emails
- **Auto-Approve OFF**: New profiles are pending and require admin approval

### ✅ **Dynamic Success Messages**
- **Auto-approved**: "Your profile is now live and visible in the directory!"
- **Pending approval**: "Your profile has been submitted and is pending approval. You'll receive an email once it's approved and live!"

## How to Use

### 1. **Access Admin Panel**
```
Go to: your-website.com/#admin
Password: W9@cZt7!mQ#4rTf%X2^vBp8&
```

### 2. **Toggle Auto-Approval**
- Look for the "Auto-Approve" button in the header
- **Green = ON**: All new submissions are automatically approved
- **Red = OFF**: All new submissions require manual approval
- Click to toggle between states

### 3. **Manual Approval (when Auto-Approve is OFF)**
- Pending profiles show in admin stats
- Use "Approve All" button to approve multiple profiles at once
- Individual profiles can be approved through the admin interface

## Database Setup

### **Run the Setup Script**
Execute `setup-auto-approval.sql` in your Supabase SQL editor to:
- Create the `admin_settings` table
- Set auto-approval to ON by default
- Approve all existing profiles
- Set up proper permissions

### **Verify Setup**
After running the script, you should see:
- Auto-approval toggle in admin panel
- All existing profiles approved and visible
- New submissions handled according to the toggle setting

## Technical Details

### **Database Schema**
```sql
CREATE TABLE admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Settings Management**
- `getAutoApprovalSetting()`: Fetches current setting
- `updateAutoApprovalSetting(enabled)`: Updates the setting
- Default: Auto-approval enabled (true)

### **Profile Visibility Logic**
- **Auto-approval ON**: All profiles visible (approved and pending)
- **Auto-approval OFF**: Only approved profiles visible
- **Admin panel**: Always shows all profiles regardless of setting

## Benefits

### **For Admins**
- **Quality Control**: Review profiles before they go live
- **Spam Prevention**: Prevent unwanted submissions from appearing
- **Flexibility**: Toggle between automatic and manual approval as needed

### **For Users**
- **Immediate Visibility**: When auto-approval is on, profiles are live instantly
- **Clear Communication**: Users know whether their profile is live or pending
- **Professional Experience**: Proper email notifications based on approval status

## Migration Notes

### **Existing Profiles**
- All existing profiles are automatically approved when you run the setup script
- This ensures no profiles are hidden after implementing the system

### **Backward Compatibility**
- The system gracefully handles missing settings (defaults to auto-approve)
- Existing functionality remains unchanged when auto-approval is enabled

## Troubleshooting

### **Profiles Not Showing**
1. Check auto-approval setting in admin panel
2. Verify profiles are approved in admin interface
3. Clear browser cache and refresh

### **Toggle Not Working**
1. Ensure `setup-auto-approval.sql` was executed
2. Check browser console for errors
3. Verify Supabase permissions

### **Email Issues**
- Auto-approved profiles get immediate welcome emails
- Pending profiles get emails only after manual approval
- Check email service configuration if emails aren't sending

## Quick Commands

### **Enable Auto-Approval via SQL**
```sql
UPDATE admin_settings 
SET setting_value = true 
WHERE setting_key = 'auto_approve_profiles';
```

### **Disable Auto-Approval via SQL**
```sql
UPDATE admin_settings 
SET setting_value = false 
WHERE setting_key = 'auto_approve_profiles';
```

### **Approve All Pending Profiles**
```sql
UPDATE profiles 
SET approved = true 
WHERE approved = false;
```

## Summary

The auto-approval system provides flexible control over profile visibility while maintaining a smooth user experience. Enable it for immediate visibility or disable it for quality control - the choice is yours!