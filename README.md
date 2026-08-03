# SoleMate — Premium Footwear E-Commerce Platform

A full-stack e-commerce web application for a footwear store, built with **Next.js** (frontend), **Express.js** (backend), and **MongoDB** (database).

## 🏗️ Architecture

```
footwear-app/
├── server/          # Express.js REST API
│   ├── config/      # Database connection
│   ├── controllers/ # Business logic
│   ├── middleware/   # Auth, upload, validation
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   ├── seed/        # Database seeder
│   └── uploads/     # User-uploaded images
│
├── client/          # Next.js 15 App Router
│   ├── src/
│   │   ├── app/           # Pages & routes
│   │   │   ├── (store)/   # Customer-facing pages
│   │   │   ├── (auth)/    # Login, register, password reset
│   │   │   └── admin/     # Admin panel
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/        # shadcn/ui primitives
│   │   │   ├── store/     # Store-specific components
│   │   │   └── admin/     # Admin-specific components
│   │   ├── context/       # React context providers
│   │   └── lib/           # Utilities & API client
│   └── public/images/     # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** (comes with Node.js)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

**Server** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/solemate
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

**Client** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOADS_URL=http://localhost:5000
```

### 3. Seed the Database

```bash
cd server
node seed/seed.js
```

This creates:
- **4 users** (1 admin + 3 customers)
- **6 categories** with hierarchy
- **20 products** with sizes, colors, and descriptions
- **5 reviews** with ratings
- **3 sample orders** in various states

### 4. Start Development Servers

```bash
# Terminal 1 — Backend API
cd server
npm run dev

# Terminal 2 — Frontend App
cd client
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔐 Test Accounts

| Role     | Email               | Password     |
|----------|---------------------|-------------|
| Admin    | admin@solemate.com  | admin123    |
| Customer | ahmed@example.com    | customer123 |
| Customer | awais@example.com    | customer123 |
| Customer | sarah@example.com   | customer123 |

## ✨ Features

### Customer-Facing Website
- 🏠 **Home** — Hero carousel, featured products, categories, testimonials
- 🛍️ **Shop** — Full filtering (gender, category, brand, size, price), sorting, pagination
- 👟 **Product Detail** — Image gallery, color/size selectors, reviews, related products
- 🛒 **Cart** — Add/update/remove items, quantity controls, guest + authenticated carts
- 💳 **Checkout** — Multi-step flow (shipping → payment → confirmation)
- 👤 **Account** — Profile management, order history
- 🔒 **Auth** — Register, login, forgot password, reset password (JWT)
- ℹ️ **Static Pages** — About Us, Contact (working form), custom 404

### Admin Panel (`/admin`)
- 📊 **Dashboard** — Revenue, orders, products, customers stats
- 📦 **Products** — Full CRUD, search, create/edit dialog
- 📁 **Categories** — Create/edit with parent hierarchy
- 📋 **Orders** — View details, update status, add tracking
- 👥 **Customers** — User list with role badges
- 📊 **Inventory** — Stock levels, low-stock alerts, size breakdown

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js 15, React 19, Tailwind CSS  |
| UI Library  | shadcn/ui, Lucide Icons             |
| Animations  | Framer Motion                       |
| Backend     | Express.js, Node.js                 |
| Database    | MongoDB, Mongoose                   |
| Auth        | JWT (jsonwebtoken, bcryptjs)        |
| Uploads     | Multer (local file system)          |
| Validation  | express-validator, Zod (client)     |
| Forms       | React Hook Form                     |

## 📂 API Endpoints

### Auth
- `POST   /api/auth/register` — Create account
- `POST   /api/auth/login` — Sign in
- `GET    /api/auth/me` — Get profile
- `PUT    /api/auth/profile` — Update profile
- `PUT    /api/auth/password` — Change password
- `POST   /api/auth/forgot-password` — Request reset email
- `PUT    /api/auth/reset-password/:token` — Reset password

### Products
- `GET    /api/products` — List (with filters/search/pagination)
- `GET    /api/products/featured` — Featured products
- `GET    /api/products/new-arrivals` — New arrivals
- `GET    /api/products/brands` — All brands
- `GET    /api/products/slug/:slug` — By slug
- `POST   /api/products` — Create (admin)
- `PUT    /api/products/:id` — Update (admin)
- `DELETE /api/products/:id` — Delete (admin)

### Categories
- `GET    /api/categories` — List all
- `POST   /api/categories` — Create (admin)
- `PUT    /api/categories/:id` — Update (admin)
- `DELETE /api/categories/:id` — Delete (admin)

### Cart
- `GET    /api/cart` — Get cart
- `POST   /api/cart/add` — Add item
- `PUT    /api/cart/update` — Update quantity
- `DELETE /api/cart/remove/:itemId` — Remove item
- `DELETE /api/cart/clear` — Clear cart

### Orders
- `POST   /api/orders` — Place order
- `GET    /api/orders/my-orders` — User's orders
- `GET    /api/orders/:id` — Order details
- `GET    /api/orders/all` — All orders (admin)
- `PUT    /api/orders/:id/status` — Update status (admin)

### Reviews
- `GET    /api/reviews/product/:productId` — Product reviews
- `POST   /api/reviews` — Create review
- `DELETE /api/reviews/:id` — Delete review

### Contact
- `POST   /api/contact` — Submit message
- `GET    /api/contact` — List messages (admin)
- `PUT    /api/contact/:id/read` — Mark read (admin)

## 🎨 Design

- **Brand Colors**: Charcoal (#1A1A1A) + Gold Accent (#D4A853)
- **Typography**: Outfit (headings) + Inter (body)
- **Style**: Clean, premium, product-first with generous white space
- **Animations**: Scroll reveals, hover effects, page transitions

---

**© 2024 SoleMate.** All rights reserved.
