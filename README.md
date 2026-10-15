# Chip Zorro - Auto Glass Repair & Mobile Windshield Replacement

Chip Zorro is a modern, responsive web application and dispatch booking portal for mobile windshield repair and auto glass replacement services.

## Key Features

- **Direct Booking Flow**: Interactive multi-step appointment scheduler with damage inspection, vehicle info, real-time insurance & self-pay estimates.
- **Official Brand Visuals**: Full high-resolution brand assets and authentic Chip Zorro fox emblem.
- **Interactive Windshield Visualizer**: 3-phase animated resin injection simulation (vacuum ring, pressurized resin infusion, UV curing).
- **Instant Photo Damage Inspection**: AI-ready damage analyzer with simulated diagnostic metrics.
- **Real-Time Mobile Dispatch Tracker**: Live GPS-style technician status, ETA countdown, and vehicle location indicator.
- **Omega EDI Clearinghouse Hub**: Direct insurance claims clearinghouse processing for zero out-of-pocket comprehensive claims.
- **Windshield Care Guide**: Technical reference for laminated safety glass anatomy, defroster thermal shock prevention, and first aid tips.
- **Admin Control Center**: Administrative portal for booking management, technician dispatching, and pricing control.
- **SEO & Structured Data**: Built-in JSON-LD FAQ schema, OpenGraph tags, and mobile accessibility optimization.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun installed on your machine.

### Installation

1. Extract the zip archive to your desired directory.
2. Open a terminal in the project directory:
   ```bash
   npm install
   ```
   *(or `bun install`)*

### Development

To start the local development server with hot-module reload:

```bash
npm run dev
```

Open `http://localhost:3000` (or the URL printed in the terminal) in your browser.

### Production Build

To build the optimized static production bundle:

```bash
npm run build
```

This compiles all TypeScript and React code into minified, production-ready static assets in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

### Static Hosting & Deployment

The contents of the `dist/` folder can be deployed directly to any static web hosting provider:
- **Netlify**: Drag-and-drop the `dist` folder or connect via Git.
- **Vercel**: Run `vercel` or link your repository with default Vite settings.
- **Cloudflare Pages**: Point build output to `dist` and build command to `npm run build`.
- **AWS S3 / CloudFront**: Upload `dist/*` files with appropriate MIME types.
- **Apache / Nginx / cPanel**: Upload all files from `dist/` into `public_html` or web root.

---

© Chip Zorro Auto Glass Repair. All rights reserved.
