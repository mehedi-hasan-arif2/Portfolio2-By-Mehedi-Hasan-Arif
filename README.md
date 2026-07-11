# 🚀 Mehedi Hasan Arif — Portfolio

A modern, full-stack personal portfolio website built with **Next.js App Router**, featuring a database-backed admin panel for full content management, dynamic SEO, and a polished, responsive UI.

## 🔗 Live Link

- **Live URL:** https://portfolio-mehedi-hasan-arif.vercel.app/

## 🎯 Project Purpose

Most portfolio sites are static and require editing code every time you want to update a project, write a blog post, or tweak your bio. This project solves that by pairing a public-facing portfolio with a **secure, private admin dashboard** — so all content (projects, blogs, skills, experience, profile info) can be managed live, from any device, without touching the codebase.

## 🚀 Key Features

- **Full Admin Dashboard:** A protected `/admin` panel to manage Projects, Blogs, Skills, Experience, Profile, and Contact Messages — all backed by MongoDB.
- **JWT-Based Authentication:** Custom auth system using signed JWT cookies, verified on every protected request via Next.js Middleware — no third-party auth service.
- **Rich Blog Engine:** Full CRUD blog system with a Tiptap-powered rich text editor (images, links, formatting), PDF upload support, and published/draft status control.
- **Dynamic SEO (Server-Rendered):** Page title and meta description are pulled live from the database (`generateMetadata`), so SEO can be updated from the admin panel without a redeploy.
- **Auto-Generated Sitemap:** `sitemap.xml` is dynamically built from published blog posts and static routes, with built-in error handling so a database hiccup never breaks the route.
- **Structured Data (JSON-LD):** Person schema injected site-wide to help Google understand and richly display the site in search results.
- **Google Search Console Verified:** Full indexing pipeline set up — verification tag, sitemap submission, and social preview tags (Open Graph + Twitter Cards).
- **Cloud Image & File Uploads:** Cloudinary integration for optimized image hosting across projects and blog content.
- **Contact Form with Email Delivery:** Real transactional emails via Resend, plus messages are stored and viewable in the admin dashboard.
- **Toast Notifications:** Real-time success/error feedback across all admin actions (create, update, delete).
- **Fully Responsive & Animated:** Mobile-first responsive layout with smooth Framer Motion animations and a Lenis-powered smooth scroll experience.
- **Dark/Light Theme Support:** Theme switching via `next-themes`.

## 🔐 Authentication Architecture

- **Method:** Custom email/password login issuing a signed JWT (`jose`), stored in an HTTP-only cookie
- **Route Protection:** `middleware.ts` intercepts every `/admin/*` request, verifies the JWT, and redirects to login on failure or missing token
- **Password Hashing:** `bcryptjs`

## 🛠️ Tech Stack

**Framework & Language**
- Next.js (App Router, Turbopack) · React 19 · TypeScript

**Database & Backend**
- MongoDB · Mongoose · Next.js API Routes

**Styling & UI**
- Tailwind CSS · Radix UI primitives · Lucide Icons · Framer Motion · Lenis (smooth scroll)

**Content & Forms**
- Tiptap (rich text editor) · React Hook Form · Zod (validation)

**Third-Party Services**
- Cloudinary (image/file hosting) · Resend (transactional email) · jose (JWT)

**Deployment**
- Vercel

## ⚙️ Environment Variables

Create a `.env.local` file in the project root with the following keys:

```
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
CONTACT_EMAIL=
NEXT_PUBLIC_SITE_URL=
```

## 📌 Pages Overview

| Route | Description |
|---|---|
| `/` | Home page with dynamic profile data, hero section, and highlights |
| `/projects` | Full projects showcase |
| `/blog` | Blog listing (published posts only) |
| `/blog/[slug]` | Individual blog post page |
| `/contact` | Contact form with email delivery via Resend |
| `/admin` | Admin login |
| `/admin/dashboard` | 🔒 Overview stats (projects, blogs, messages, skills) |
| `/admin/projects` | 🔒 Manage projects (CRUD) |
| `/admin/blogs` | 🔒 Manage blog posts with rich text editor (CRUD) |
| `/admin/skills` | 🔒 Manage skills list |
| `/admin/experience` | 🔒 Manage work experience |
| `/admin/profile` | 🔒 Manage profile info & SEO title/description |
| `/admin/messages` | 🔒 View contact form submissions |

## 🔍 SEO Setup

- Server-rendered `generateMetadata()` pulling title/description from the database
- Auto-generated `sitemap.xml` (`app/sitemap.ts`) with static + dynamic blog routes
- `robots.txt` configured to allow crawling while blocking `/admin`
- Open Graph & Twitter Card metadata for rich social sharing previews
- JSON-LD `Person` schema for structured data
- Verified with Google Search Console

## 🏃 Getting Started (Local Development)

```bash
# install dependencies
npm install

# run the development server
npm run dev

# build for production
npm run build
```
