# Branded URL Gateway, Dynamic Shortlinks & Monochrome AMOLED UI System

> **Official Project Documentation**: [`balajitechlab.com`](https://balajitechlab.com)  
> **Author**: `||BTL||™` ([balajitechlabs](https://github.com/balajitechlabs))  
> **Stack**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, Framer Motion, WebGL Shaders.

---

## 1. Features Overview

1. **Branded Gateway (`/go/[slug]`)**: Outgoing interstitial card displaying the BTL avatar, live WebGL Topographic shader background, verified badge (🛡️), and instant 1-click continue action.
2. **Direct Fast-Forwarding (`/<slug>`)**: Instant 307 redirect configured in `next.config.ts` with 0ms delay.
3. **Smart Auto-Redirect Flag (`/go/[slug]?direct=1`)**: Automatically forwards without user click if requested.
4. **Global 404 & Link Directory (`not-found.tsx`)**: Renders an interactive link directory when any unknown route is requested.
5. **Mobile-First Loading Screen**: Pure monochrome AMOLED splash with fluid `100dvh` viewport units and responsive `clamp()` scaling.

---

## 2. Directory Structure

```text
src/
├── app/
│   ├── go/
│   │   └── [slug]/
│   │       └── page.tsx          # Dynamic /go/[slug] route with rich OpenGraph metadata
│   ├── redirect/
│   │   ├── page.tsx              # Generic query-based redirect (/redirect?to=https://...)
│   │   └── RedirectClient.tsx    # URL parser & protocol security validator
│   └── not-found.tsx             # Global App Router 404 interceptor
├── components/
│   ├── RedirectBridge.tsx        # Branded Gateway Card with live Topographic shader
│   ├── NotFoundView.tsx          # 404 Link Directory with signature white hover states
│   └── LoadingScreen.tsx         # Mobile-optimized welcome splash screen
├── lib/
│   └── shortlinks.ts             # Central Type-Safe Shortlink Registry
└── styles/
    ├── common/
    │   └── loading-screen.css    # Monochrome mobile-first splash styles
    └── redirect/
        └── redirect.css          # Pure monochrome AMOLED gateway & directory CSS
```

---

## 3. How to Add a New Shortlink

Open [`src/lib/shortlinks.ts`](file:///Users/btl/Documents/btl-all-projects/balajitechlab.com/src/lib/shortlinks.ts) and add your link to `SHORTLINKS`:

```typescript
"my-app": {
  slug: "my-app",
  title: "My New Application",
  destination: "https://my-app.balajitechlab.com",
  category: "App",
  icon: "apps",
  badge: "Official Release",
  description: "A brief description of your app or project.",
},
```

If you also want an instant root redirect (`balajitechlab.com/my-app`), add it to `redirects()` in [`next.config.ts`](file:///Users/btl/Documents/btl-all-projects/balajitechlab.com/next.config.ts):

```typescript
{
  source: "/my-app",
  destination: "https://my-app.balajitechlab.com",
  permanent: false,
},
```

---

## 4. UI Invariants to Remember

* **Zero Green Styling**: Always maintain `var(--background-color-primary: #000000)` and `var(--text-color: #ffffff)`.
* **White Invert Hover**: On hover, interactive buttons and directory items smoothly invert to `#ffffff` background with `#000000` text.
* **Single Cursor Mounting**: `<Cursor />` is globally rendered in `layout.tsx`; never mount duplicate cursor instances in child components.
