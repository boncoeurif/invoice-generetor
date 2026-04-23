# InvoiceApp

A professional invoice management application built with Vue 3, Vite, and jsPDF.

## Features
- Dashboard with invoice overview
- Create and manage invoices
- Generate professional PDF invoices
- Responsive Sidebar navigation

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your environment variables.

### Development
Start the development server:
```bash
npm run dev
```

### Production Build
Build the project for production:
```bash
npm run build
```
The output will be in the `dist/` directory.

## Deployment

### Vercel / Netlify
This project is ready to be deployed on Vercel or Netlify. 
- Build Command: `npm run build`
- Output Directory: `dist`

### Manual Deployment
You can serve the `dist/` directory using any static web server (e.g., Nginx, Apache).
```bash
npm run preview
```

## Technologies
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [Vue Router](https://router.vuejs.org/)
