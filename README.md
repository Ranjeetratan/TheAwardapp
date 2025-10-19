# CofounderBase 🚀

> **A modern platform where founders and cofounders connect authentically**

CofounderBase solves the problem of finding the right cofounder by providing a curated, dedicated space away from the noise of Reddit posts and generic networking events.

![CofounderBase](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## ✨ Features

- **🎨 Beautiful Dark UI** - Modern gradient design with accent color (#f1fb48)
- **🔄 Animated Hero Section** - Rotating text for Technical Cofounders/CTO Candidates/Angel Investors
- **🎯 Modern Logo Design** - Meaningful networking-inspired logo with "cofounderBase" typography
- **🔍 Hero Search Bar** - Integrated search with popular tech stack suggestions
- **📱 Fully Responsive** - Perfect on desktop, tablet, and mobile devices
- **🎛️ Collapsible Advanced Filters** - Hidden by default, expandable with comprehensive filtering options
- **👥 Multi-Role Support** - Separate flows for Founders, Cofounders, and Investors
- **🌟 Enhanced Coming Soon Section** - Prioritized roadmap with status indicators
- **🔒 SEO Optimized** - Comprehensive meta tags targeting cofounder/founder/investor keywords
- **🎭 Smooth Animations** - Framer Motion powered transitions throughout
- **💎 Glassy Header** - Transparent backdrop-blur header design
- **🛠️ Admin Dashboard** - Basic admin panel for profile management and analytics
- **💬 Support Integration** - Direct LinkedIn contact for support queries
- **🎯 Keyword Optimization** - Optimized for "find cofounder", "technical cofounder", "CTO candidates" searches

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ranjeetratan/TheAwardapp.git
   cd TheAwardapp
   npm install
   ```

2. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Copy `.env.example` to `.env`:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_KEY=your_supabase_anon_key
     ```

3. **Initialize Database**
   - **New Setup**: Run the SQL from `supabase-setup.sql` in your Supabase SQL editor
   - **Existing Database**: Use `supabase-migration.sql` to upgrade your existing database
   - See `SUPABASE_SETUP.md` for detailed instructions
   - This creates profiles table, advertisements table, and storage buckets

4. **Start Development**
   ```bash
   npm run dev
   ```

5. **Access Admin Panel**
   - Add `?admin=true` to your URL to access the admin dashboard
   - Example: `http://localhost:5173/?admin=true`

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **UI Components** | shadcn/ui, Lucide React |
| **Animations** | Framer Motion |
| **Backend** | Supabase (Database + Storage) |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS with custom design system |

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── Hero.tsx         # Landing hero section
│   ├── About.tsx        # Problem/solution sections  
│   ├── ProfileForm.tsx  # 4-step form wizard
│   ├── Logo.tsx         # Brand logo component
│   └── Footer.tsx       # Site footer
├── lib/
│   ├── utils.ts         # Utility functions
│   └── supabase.ts      # Supabase client & types
└── App.tsx              # Main application component
```

## 🎨 Design System

- **Primary Background:** `#0a0a0a` → `#1a1a1a` (gradient)
- **Accent Color:** `#f1fb48` (bright yellow-green)
- **Typography:** Inter font family
- **Border Radius:** `rounded-2xl` (1rem)
- **Animations:** 200-300ms smooth transitions

## 🔧 Form Flow

1. **Step 1: Basic Info** - Name, email, headshot, location, bio
2. **Step 2: Role Selection** - Choose Founder or Cofounder
3. **Step 3: Role Details** - Specific information based on role
4. **Step 4: Review** - Preview all information including headshot

## 🗄️ Database Schema

The `profiles` table includes:
- Common fields (name, email, bio, location, etc.)
- Founder-specific fields (startup_name, stage, industry)
- Cofounder-specific fields (skills, experience_level)
- File storage for headshots in Supabase Storage

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Powered by [Supabase](https://supabase.com/) backend
- Animated with [Framer Motion](https://www.framer.com/motion/)

---

**Built with ❤️ for the startup community**