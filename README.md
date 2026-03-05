# Tailor24 Frontend

A luxury bespoke tailoring frontend built with React + Vite, Tailwind CSS, Redux Toolkit, and Framer Motion.

## Stack

- **React 18** + **Vite** — Fast dev server + HMR
- **Tailwind CSS** — Utility-first styling with custom luxury design tokens
- **Redux Toolkit** — Global state management (auth, catalog, orders, showrooms)
- **Framer Motion** — Page transitions and micro-animations
- **React Router v6** — Client-side routing with protected routes
- **Axios** — HTTP client with JWT interceptors
- **React Hot Toast** — Toast notifications

## Project Structure

```
src/
├── main.jsx                   # Entry point
├── App.jsx                    # Router + layout
├── index.css                  # Global styles + Tailwind
├── store/
│   ├── store.js               # Redux store
│   └── slices/
│       ├── authSlice.js       # Auth state (login, register, logout)
│       ├── catalogSlice.js    # Products + Fabrics
│       ├── orderSlice.js      # Orders + customization builder
│       └── showroomSlice.js   # Showroom state
├── services/
│   ├── api.js                 # Axios instance + JWT interceptor
│   ├── authService.js         # /api/auth/*
│   ├── catalogService.js      # /api/catalog/*
│   ├── orderService.js        # /api/orders/*
│   └── showroomService.js     # /api/showrooms/*
├── pages/
│   ├── HomePage.jsx           # Landing page
│   ├── LoginPage.jsx          # Sign in
│   ├── RegisterPage.jsx       # Sign up
│   ├── CatalogPage.jsx        # Product listing + filters
│   ├── ProductDetailPage.jsx  # 4-step order customizer
│   ├── OrdersPage.jsx         # My orders list
│   ├── OrderDetailPage.jsx    # Order details + status timeline
│   └── ShowroomsPage.jsx      # Showroom finder
└── components/
    ├── layout/
    │   ├── Navbar.jsx
    │   └── Footer.jsx
    ├── auth/
    │   └── ProtectedRoute.jsx
    ├── catalog/
    │   ├── ProductCard.jsx
    │   └── FabricCard.jsx
    ├── orders/
    │   └── OrderCard.jsx
    └── ui/
        └── Loader.jsx
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Make sure your backend is running on port 5000
# (or update VITE_API_URL in .env)

# 4. Start the dev server
npm run dev
```

## Backend API Routes Connected

| Frontend Action         | Backend Route                    |
|-------------------------|----------------------------------|
| Login                   | POST `/api/auth/login`           |
| Register                | POST `/api/auth/register`        |
| Get profile             | GET `/api/auth/me`               |
| Browse products         | GET `/api/catalog/products`      |
| Product detail          | GET `/api/catalog/products/:id`  |
| Browse fabrics          | GET `/api/catalog/fabrics`       |
| Place order             | POST `/api/orders`               |
| My orders               | GET `/api/orders`                |
| Order detail            | GET `/api/orders/:id`            |
| Cancel order            | PUT `/api/orders/:id/cancel`     |
| All showrooms           | GET `/api/showrooms`             |
| Showrooms by city       | GET `/api/showrooms?city=Indore` |

## Design System

Custom design tokens in `tailwind.config.js`:
- **`rouge`** — Deep burgundy red (primary brand color)
- **`gold`** — Warm gold (accents)
- **`cream`** — Warm off-white (backgrounds)
- **`charcoal`** — Deep warm black (text)
- **Fonts**: Cormorant Garamond (display) + DM Sans (body)
