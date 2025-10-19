# Supabase Setup Guide for CofounderBase

## 🚀 Quick Setup (New Database)

If you're setting up a fresh Supabase project, simply run the complete setup:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire content from `supabase-setup.sql`
4. Click "Run" to execute all commands

**✨ Includes Sample Data**: The setup script automatically creates 10 sample profiles (founders, cofounders, and investors) so your website is immediately live with realistic data!

## 🔄 Migration (Existing Database)

If you already have a CofounderBase database and need to add new features:

1. **Backup your data first!**
2. **Run pre-migration check**: Copy and run `pre-migration-check.sql` to see potential issues
3. **Fix any data issues** identified in the check
4. Go to SQL Editor in Supabase
5. Run the migration script from `supabase-migration.sql`

**⚠️ Important**: Always run the pre-migration check first to avoid constraint violations!

## 📋 What's Included

### Tables Created:
- **profiles** - Main user profiles with all role types
- **advertisements** - Admin-managed promotional content

### Storage Buckets:
- **headshots** - User profile images
- **advertisements** - Ad images

### New Features Added:
- ✅ Investor role support
- ✅ Enhanced availability options (Equity Only, Sweat Equity, etc.)
- ✅ Extended startup stages (Series A, B+, Product-Market Fit)
- ✅ Detailed experience levels with years
- ✅ Company size tracking
- ✅ Funding stage information
- ✅ Comprehensive investment ranges and types
- ✅ Featured profiles system
- ✅ Auto-updating timestamps
- ✅ Performance indexes

### Security:
- Row Level Security (RLS) enabled
- Public read access for approved profiles only
- Public insert for new profile submissions
- Secure file upload policies

## 🔧 Environment Variables

Make sure your `.env` file contains:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## 📊 Admin Access

To access the admin panel:
- Add `?admin=true` to your URL
- Example: `http://localhost:5173/?admin=true`
- Or: `https://yoursite.com/?admin=true`

## 🎯 Filter Options Available

### For Founders:
- Location, Industry, Availability
- Startup Stage, Company Size, Funding Stage
- Looking For (what type of cofounder)

### For Cofounders:
- Location, Industry, Availability
- Skills & Tech Stack, Experience Level
- Looking For (what type of opportunity)

### For Investors:
- Location, Industry, Availability
- Investment Range, Investment Type
- Startup Stage (what they invest in)

## 🔍 Search Capabilities

The platform now supports searching by:
- Name and bio content
- Skills and expertise
- Location (including "Remote")
- Industry and startup focus
- Company/startup names

## 📈 Performance Optimizations

Indexes are created for:
- Role-based filtering
- Approval status
- Featured profiles
- Location searches
- Industry filtering
- All new filter fields

## 🚨 Important Notes

1. **Backup First**: Always backup your data before running migrations
2. **Test Locally**: Test the migration on a development database first
3. **Check Constraints**: The new check constraints are more restrictive
4. **Existing Data**: Migration script handles existing data gracefully
5. **Admin Features**: Admin panel requires the new `featured` column

## 🆘 Troubleshooting

### Migration Issues:
- **Constraint Violations**: See `MIGRATION_TROUBLESHOOTING.md` for detailed solutions
- **Data Conflicts**: Update existing data to match new constraint formats
- **Backup First**: Always create a backup before running migrations

### Common Issues:

**Constraint Violations:**
- If you have existing data that doesn't match new constraints, update it first
- Example: Change "Beginner" to "Beginner (0-2 years)"
- See troubleshooting guide for complete solutions

**Missing Columns:**
- Run the migration script to add new columns
- Check that all ALTER TABLE commands executed successfully

**Permission Errors:**
- Ensure RLS policies are properly set
- Check that storage policies allow public access

**Performance Issues:**
- Verify all indexes were created
- Check query performance in Supabase dashboard

## 📞 Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify all SQL commands executed without errors
3. Test with a small dataset first
4. Contact support via the in-app support button

---

**Built for the startup community** 🚀