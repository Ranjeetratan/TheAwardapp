# CofounderBase

A modern, dark-themed, single-page React website for connecting founders and cofounders. Built with React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, and Supabase.

## Features

- 🎨 Modern dark theme with accent color (#f1fb48)
- ✨ Smooth animations with Framer Motion
- 📱 Responsive design
- 🗃️ Supabase integration for data storage
- 🎯 Role-based forms (Founder/Cofounder)
- 🔧 Built with shadcn/ui components

## Setup

1. **Clone and install dependencies:**
   ```bash
   cd cofounderbase
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy `.env.example` to `.env` and add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_KEY=your_supabase_anon_key
     ```

3. **Set up the database:**
   Run the SQL code from `supabase-setup.sql` in your Supabase SQL editor to create:
   - The `profiles` table with all required fields
   - The `headshots` storage bucket for profile images
   - Necessary policies for public access

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Supabase** - Backend and database
- **Vite** - Build tool

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── Hero.tsx      # Hero section
│   ├── About.tsx     # About sections
│   ├── ProfileForm.tsx # Main form component
│   ├── Logo.tsx      # Logo component
│   └── Footer.tsx    # Footer component
├── lib/
│   ├── utils.ts      # Utility functions
│   └── supabase.ts   # Supabase configuration
└── App.tsx           # Main app component
```

## Design System

- **Background:** #0a0a0a (dark)
- **Accent:** #f1fb48 (bright yellow-green)
- **Typography:** Inter font family
- **Components:** Rounded corners (rounded-2xl), soft shadows
- **Animations:** Fade-ins, hover effects, smooth transitions