# SoleMate — Full-Stack Footwear E-Commerce Platform

Build a complete full-stack e-commerce web application called **SoleMate** for a footwear store, comprising a customer-facing website and an admin panel, both sharing a single Express.js backend and MongoDB database.

---

## Project Structure

```
footwear-app/
├── client/                          # Next.js App Router (customer site + admin panel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (store)/             # Customer-facing route group
│   │   │   │   ├── page.jsx         # Home
│   │   │   │   ├── products/        # Shop / product listing
│   │   │   │   ├── product/[slug]/  # Product details
│   │   │   │   ├── cart/            # Cart page
│   │   │   │   ├── checkout/        # Checkout page
│   │   │   │   ├── account/         # User account / order history
│   │   │   │   ├── about/           # About Us
│   │   │   │   ├── contact/         # Contact form
│   │   │   │   └── layout.jsx       # Store layout (header/footer)
│   │   │   ├── (auth)/              # Auth route group
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── admin/               # Admin panel route group
│   │   │   │   ├── layout.jsx       # Admin layout (sidebar)
│   │   │   │   ├── page.jsx         # Dashboard
│   │   │   │   ├── products/        # Product CRUD
│   │   │   │   ├── categories/      # Category CRUD
│   │   │   │   ├── orders/          # Order management
│   │   │   │   ├── customers/       # Customer list
│   │   │   │   └── inventory/       # Stock management
│   │   │   ├── layout.jsx           # Root layout
│   │   │   ├── globals.css          # Global styles + shadcn theme
│   │   │   └── not-found.jsx        # 404 page
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── store/               # Customer-facing components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── HeroCarousel.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── CartSheet.jsx
│   │   │   │   ├── FilterSidebar.jsx
│   │   │   │   ├── CategoryTiles.jsx
│   │   │   │   ├── TestimonialSection.jsx
│   │   │   │   └── ScrollReveal.jsx
│   │   │   └── admin/               # Admin panel components
│   │   │       ├── AdminSidebar.jsx
│   │   │       ├── DashboardStats.jsx
│   │   │       ├── ProductForm.jsx
│   │   │       ├── OrderTable.jsx
│   │   │       └── ...
│   │   ├── lib/
│   │   │   ├── utils.js             # shadcn cn() helper
│   │   │   ├── api.js               # Axios/fetch API client
│   │   │   └── constants.js         # App constants
│   │   ├── hooks/
│   │   │   ├── useCart.js
│   │   │   ├── useAuth.js
│   │   │   └── useScrollReveal.js
│   │   └── context/
│   │       ├── AuthContext.jsx
│   │       └── CartContext.jsx
│   ├── public/
│   │   └── images/                  # Generated shoe images, logo, etc.
│   ├── components.json              # shadcn/ui config
│   ├── next.config.mjs
│   ├── package.json
│   └── .env.local
│
├── server/                          # Express.js REST API
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── reviewController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── admin.js                 # Admin role check
│   │   ├── validate.js              # Input validation
│   │   └── upload.js                # Multer config
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Review.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   ├── reviews.js
│   │   └── contact.js
│   ├── seed/
│   │   └── seed.js                  # Database seeder with sample data
│   ├── uploads/                     # Local image uploads (multer)
│   ├── server.js                    # Express app entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Proposed Changes

### Phase 1: Foundation & Backend

#### Server Setup

##### [NEW] [server.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/server.js)
Express.js entry point — connects to MongoDB, applies CORS, JSON parsing, rate limiting, serves static uploads folder, and mounts all API route files under `/api`.

##### [NEW] [db.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/config/db.js)
MongoDB connection via Mongoose using `MONGO_URI` from `.env`.

##### [NEW] [.env](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/.env)
Environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`.

---

#### Database Models (Mongoose)

##### [NEW] [User.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/models/User.js)
Fields: `name`, `email`, `password` (bcrypt-hashed), `role` (customer/admin), `phone`, `address` (street, city, state, zip, country), `timestamps`. Pre-save hook for password hashing. Instance method `matchPassword()`.

##### [NEW] [Product.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/models/Product.js)
Fields: `name`, `slug` (auto-generated), `description`, `price`, `compareAtPrice` (for strikethrough), `category` (ref), `brand`, `sizes` (array of `{size, stock}`), `colors` (array of `{name, hex, images[]}`), `totalStock` (virtual/computed), `ratings` (avg/count), `isFeatured`, `isNewArrival`, `tags`, `timestamps`.

##### [NEW] [Category.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/models/Category.js)
Fields: `name`, `slug`, `description`, `image`, `parent` (self-ref for subcategories), `timestamps`.

##### [NEW] [Order.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/models/Order.js)
Fields: `user` (ref), `items[]` (product ref, name, image, size, color, quantity, price), `shippingAddress`, `paymentMethod`, `paymentStatus`, `orderStatus` (pending/processing/shipped/delivered/cancelled), `subtotal`, `shippingCost`, `tax`, `total`, `trackingNumber`, `timestamps`.

##### [NEW] [Cart.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/models/Cart.js)
Fields: `user` (ref, unique), `items[]` (product ref, size, color, quantity), `timestamps`.

##### [NEW] [Review.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/models/Review.js)
Fields: `product` (ref), `user` (ref), `rating` (1–5), `title`, `comment`, `timestamps`. Unique compound index on (product, user).

##### [NEW] [Contact.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/models/Contact.js)
Fields: `name`, `email`, `subject`, `message`, `isRead`, `timestamps`.

---

#### Middleware

##### [NEW] [auth.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/middleware/auth.js)
JWT verification middleware — extracts token from `Authorization: Bearer <token>` header, verifies with `JWT_SECRET`, attaches `req.user`.

##### [NEW] [admin.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/middleware/admin.js)
Checks `req.user.role === 'admin'`, returns 403 if not.

##### [NEW] [upload.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/middleware/upload.js)
Multer configuration for local image uploads to `server/uploads/`. File type validation (JPEG, PNG, WebP), size limit (5MB), dynamic filename generation.

##### [NEW] [validate.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/middleware/validate.js)
Express-validator based middleware factory for request body/params validation with consistent error response format.

---

#### API Routes & Controllers

Each route file defines RESTful endpoints and delegates to the corresponding controller. All data-modifying routes include input validation.

##### [NEW] Auth routes (`/api/auth`)
- `POST /register` — Create customer account (validate, hash password, return JWT)
- `POST /login` — Authenticate user (verify password, return JWT + user data)
- `GET /me` — Get current user profile (auth-protected)
- `PUT /profile` — Update profile info (auth-protected)

##### [NEW] Product routes (`/api/products`)
- `GET /` — List products with filters (category, brand, size, color, price range), sorting, pagination, and search
- `GET /:slug` — Get single product by slug (populate reviews)
- `GET /featured` — Get featured products
- `GET /new-arrivals` — Get new arrivals
- `POST /` — Create product (admin)
- `PUT /:id` — Update product (admin)
- `DELETE /:id` — Delete product (admin)
- `POST /:id/images` — Upload product images (admin, multer)

##### [NEW] Category routes (`/api/categories`)
- `GET /` — List all categories (with subcategories populated)
- `POST /` — Create category (admin)
- `PUT /:id` — Update category (admin)
- `DELETE /:id` — Delete category (admin)

##### [NEW] Cart routes (`/api/cart`)
- `GET /` — Get user's cart (auth-protected)
- `POST /add` — Add item to cart (auth-protected)
- `PUT /update` — Update item quantity (auth-protected)
- `DELETE /remove/:itemId` — Remove item from cart (auth-protected)
- `DELETE /clear` — Clear cart (auth-protected)

##### [NEW] Order routes (`/api/orders`)
- `POST /` — Place order (auth-protected, decrements stock, clears cart)
- `GET /my-orders` — Get current user's orders (auth-protected)
- `GET /:id` — Get order detail (auth or admin)
- `GET /` — Get all orders (admin, with filters and pagination)
- `PUT /:id/status` — Update order status (admin)

##### [NEW] User routes (`/api/users`)  (admin only)
- `GET /` — List all customers (paginated)
- `GET /:id` — Get user details + their orders

##### [NEW] Review routes (`/api/reviews`)
- `POST /` — Create review for product (auth-protected)
- `GET /product/:productId` — Get reviews for a product
- `DELETE /:id` — Delete review (admin or review author)

##### [NEW] Contact routes (`/api/contact`)
- `POST /` — Submit contact form (public)
- `GET /` — List contact submissions (admin)
- `PUT /:id/read` — Mark as read (admin)

---

#### Seed Script

##### [NEW] [seed.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/server/seed/seed.js)
Populates the database with:
- 1 admin user (`admin@solemate.com` / `admin123`)
- 1 test customer (`customer@solemate.com` / `customer123`)
- 6 categories (Men, Women, Kids, Running, Casual, Sports) with a parent-child hierarchy
- 20+ products across categories with varied sizes, colors, prices, stock levels, and sample descriptions
- 5 sample reviews
- 3 sample orders in different statuses

---

### Phase 2: Next.js Client Setup & Configuration

##### [NEW] Next.js project via `create-next-app`
Initialize with: `--js --tailwind --eslint --app --src-dir --import-alias "@/*"`

> [!IMPORTANT]
> Using JavaScript (not TypeScript) as the prompt does not specify TypeScript and `.jsx` files were shown in the user's other open projects.

##### [NEW] shadcn/ui initialization
Run `npx shadcn@latest init` with New York style, neutral base color, CSS variables enabled.

##### shadcn/ui components to add:
`button`, `input`, `label`, `card`, `dialog`, `dropdown-menu`, `sheet`, `table`, `tabs`, `select`, `badge`, `avatar`, `separator`, `skeleton`, `toast` (sonner), `carousel`, `accordion`, `checkbox`, `radio-group`, `textarea`, `form`, `command` (for search autocomplete), `pagination`, `breadcrumb`, `navigation-menu`

##### [NEW] [globals.css](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/globals.css)
Custom SoleMate brand theme via CSS variables:
- **Primary palette**: Deep charcoal (#1a1a1a) with warm amber/gold accent (#D4A853) — premium, shoe-store feel
- **Neutral palette**: Warm grays (not blue-tinted)
- **Typography**: `Outfit` (headings) + `Inter` (body) from Google Fonts
- **Custom border-radius, shadows, and spacing tokens**

##### [NEW] Framer Motion (`motion/react`) installed as dependency

##### [NEW] [api.js](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/lib/api.js)
Centralized API client wrapping `fetch` — base URL from `NEXT_PUBLIC_API_URL`, automatic token injection from stored auth state, error handling, response parsing.

##### [NEW] [AuthContext.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/context/AuthContext.jsx)
React context providing `user`, `login()`, `register()`, `logout()`, `isAuthenticated`, `isAdmin`. Stores JWT in `localStorage`, auto-fetches profile on mount.

##### [NEW] [CartContext.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/context/CartContext.jsx)
React context providing `cart`, `addToCart()`, `updateQuantity()`, `removeItem()`, `clearCart()`, `cartCount`, `cartTotal`. Syncs with backend when authenticated; falls back to localStorage for guests (merges on login).

---

### Phase 3: Customer-Facing Website

#### Layout & Navigation

##### [NEW] [Header.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/components/store/Header.jsx)
- Sticky header with SoleMate logo/wordmark (left), nav links (center: Home, Shop, Men, Women, Kids, About, Contact), right-side icons (search, user account, cart with badge count)
- Cart icon opens a `Sheet` (shadcn) slide-out cart drawer
- Mobile: hamburger menu with animated drawer
- Subtle scroll-triggered background blur/opacity change

##### [NEW] [Footer.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/components/store/Footer.jsx)
- Multi-column layout: Company info + logo, Quick Links, Customer Service, Newsletter signup
- Social media icons, copyright with "SoleMate"
- Clean design matching the premium aesthetic

##### [NEW] [Store layout.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/(store)/layout.jsx)
Wraps all store pages with `Header` + `Footer`, auth/cart context providers, and Framer Motion `AnimatePresence` for page transitions.

---

#### Home Page

##### [NEW] [Home page.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/(store)/page.jsx)
Sections, top to bottom:
1. **Hero Carousel** (see HeroCarousel component below)
2. **Category Tiles** — Grid of 3 large cards (Men / Women / Kids) with images and CTAs
3. **Featured Products** — Horizontal scrollable or grid of featured product cards
4. **New Arrivals** — Product grid with "View All" link
5. **Promotional Banner** — Full-width promotional section with bold imagery
6. **Brand Story / About Snippet** — Brief company story with image
7. **Testimonials** — Customer testimonial carousel
8. **Newsletter Signup** — Email input with CTA

##### [NEW] [HeroCarousel.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/components/store/HeroCarousel.jsx)
- Uses shadcn/ui `Carousel` (Embla under the hood) with 4 slides:
  1. Men's Collection — dark/bold background, large shoe render
  2. Women's Collection — elegant, lighter tones
  3. Children's Collection — playful, bright accent colors
  4. New Arrivals — trendy, dynamic
- Each slide: full-width background gradient, large shoe image (AI-generated, centered/angled), headline text, sub-text, CTA button linking to filtered `/products?category=X`
- Auto-play with 5s interval, pause on hover
- Framer Motion entrance animations on text/image per slide change
- Navigation dots + prev/next arrows
- Smooth crossfade/slide transition between slides

##### [NEW] [ProductCard.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/components/store/ProductCard.jsx)
- Card with product image, name, brand, price, rating stars
- Hover: subtle scale-up, shadow lift, "Quick View" button fade-in, image zoom
- Framer Motion `whileHover` animation
- Links to product detail page

##### [NEW] [ScrollReveal.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/components/store/ScrollReveal.jsx)
- Reusable wrapper using `motion.div` with `whileInView` for fade-up/slide-in animations on scroll
- Respects `prefers-reduced-motion`

---

#### Products / Shop Page

##### [NEW] [Products page.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/(store)/products/page.jsx)
- Responsive grid of `ProductCard` components
- Sidebar filter panel (collapsible on mobile): category checkboxes, brand filter, size pills, color swatches, price range slider
- Sort dropdown (price low-high, high-low, newest, popular)
- Pagination (shadcn `Pagination` component)
- URL search params for all filters (shareable URLs)
- Skeleton loading states during fetch

##### [NEW] [FilterSidebar.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/components/store/FilterSidebar.jsx)
- Accordion-style filter groups with smooth expand/collapse
- Active filter badges with clear functionality
- Animated expand/collapse via Framer Motion

---

#### Product Detail Page

##### [NEW] [Product detail page.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/(store)/product/[slug]/page.jsx)
- Two-column layout: image gallery (left), product info (right)
- Image gallery: main image with thumbnail strip, click to switch, zoom on hover
- Size selector: pill buttons, grayed out if out of stock for that size
- Color selector: swatches, clicking switches product images
- Quantity picker, "Add to Cart" button with micro-animation feedback
- Price display with strikethrough compare-at price
- Stock status indicator
- Tabbed section: Description, Reviews, Size Guide
- Related Products carousel below
- Breadcrumb navigation at top

---

#### Cart Page & Cart Drawer

##### [NEW] [CartSheet.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/components/store/CartSheet.jsx)
- shadcn `Sheet` component sliding in from right
- Framer Motion slide-in animation
- List of cart items with image, name, size, color, quantity controls (±), remove button
- Subtotal calculation
- "View Cart" and "Checkout" CTAs

##### [NEW] [Cart page.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/(store)/cart/page.jsx)
- Full cart page with editable table of items
- Order summary sidebar: subtotal, estimated shipping, tax, total
- Promo code input
- "Proceed to Checkout" button
- Empty cart state with CTA to shop

---

#### Checkout Page

##### [NEW] [Checkout page.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/(store)/checkout/page.jsx)
- Auth-protected (redirects to login if not authenticated)
- Step-based form: Shipping Address → Payment Method → Order Review
- Form validation (shadcn `Form` with react-hook-form + zod)
- Payment method: simulated selection (Credit Card, PayPal, COD) — no real payment processing
- Order summary with all items and totals
- "Place Order" button → creates order via API, decrements stock, clears cart, shows success toast, redirects to order confirmation

---

#### Auth Pages

##### [NEW] [Login page.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/(auth)/login/page.jsx)
- Clean centered card with email/password form
- Client-side validation, error messaging
- "Don't have an account? Register" link
- Redirects to previous page or home on success

##### [NEW] [Register page.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/(auth)/register/page.jsx)
- Name, email, password, confirm password form
- Password strength indicator
- Terms acceptance checkbox
- Redirects to login after success

---

#### Account & Order History

##### [NEW] [Account page.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/(store)/account/page.jsx)
- Auth-protected
- Tabbed layout: Profile Info (editable), Order History, Address Book
- Order history: table/list of past orders with status badges, click to view detail
- Order detail: full order breakdown with status timeline

---

#### Static Pages

##### [NEW] [About page.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/(store)/about/page.jsx)
- Brand story, mission, team section
- Scroll-reveal animations

##### [NEW] [Contact page.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/(store)/contact/page.jsx)
- Contact form (name, email, subject, message) submitting to backend API
- Map placeholder / store address info
- Social links

##### [NEW] [not-found.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/not-found.jsx)
- Custom 404 page with shoe illustration, "Lost your sole?" messaging, CTA back to home

---

### Phase 4: Admin Panel

##### [NEW] [Admin layout.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/admin/layout.jsx)
- Auth-protected (admin role only), redirects non-admin users
- Collapsible sidebar with navigation: Dashboard, Products, Categories, Orders, Customers, Inventory
- Top bar with admin name, logout button
- Clean, functional design — minimal animations

##### [NEW] [Dashboard page.jsx](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/admin/page.jsx)
- Summary stat cards: Total Revenue, Total Orders, Total Products, Total Customers
- Low stock alerts list
- Recent orders table (last 10)
- Simple sales chart (could use recharts or a simple bar visualization)

##### [NEW] [Admin Products page](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/admin/products/page.jsx)
- Data table (shadcn `Table`) of all products with search, sort, pagination
- "Add Product" button → opens product form (dialog or separate page)
- Edit / Delete actions per row
- Product form: all fields (name, description, price, category select, sizes, colors, images upload, featured/new toggles)

##### [NEW] [Admin Categories page](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/admin/categories/page.jsx)
- List/tree of categories with subcategories
- Create/edit/delete functionality via dialogs

##### [NEW] [Admin Orders page](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/admin/orders/page.jsx)
- Data table with all orders, filterable by status
- Click to view order detail
- Status update dropdown per order (pending → processing → shipped → delivered / cancelled)

##### [NEW] [Admin Customers page](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/admin/customers/page.jsx)
- List of registered users with order count
- Click to view user details and their order history

##### [NEW] [Admin Inventory page](file:///d:/MyFiles/Internship/Tasks/footwear-app/client/src/app/admin/inventory/page.jsx)
- Product stock overview table
- Low-stock highlighting (< 5 units)
- Inline stock editing

---

### Phase 5: Assets & Polish

#### Image Generation
- Generate 4 hero shoe renders (3D-style, transparent background) for Men's, Women's, Kids, New Arrivals hero slides
- Generate category tile images (3 tiles: Men, Women, Kids)
- Generate a SoleMate logo/wordmark
- Generate 6–10 product shoe images for seed data

#### Animation Polish
- Verify all Framer Motion animations respect `prefers-reduced-motion`
- Fine-tune hero carousel transitions
- Ensure no layout shift from carousel
- Test all hover, scroll-reveal, page-transition animations

#### SEO & Meta
- Proper `<title>` and `<meta description>` on every page via Next.js `metadata` export
- Semantic HTML throughout (header, main, nav, section, article, footer)
- Unique IDs on all interactive elements
- Open Graph tags for social sharing

---

## Design System — SoleMate Brand

| Token | Value |
|---|---|
| **Primary** | `#1A1A1A` (Charcoal Black) |
| **Accent** | `#D4A853` (Warm Gold) |
| **Accent Hover** | `#C49A47` |
| **Background** | `#FAFAFA` (Off-white) |
| **Surface** | `#FFFFFF` |
| **Text Primary** | `#1A1A1A` |
| **Text Secondary** | `#6B7280` (Gray-500) |
| **Text Muted** | `#9CA3AF` (Gray-400) |
| **Border** | `#E5E7EB` (Gray-200) |
| **Success** | `#059669` |
| **Error/Destructive** | `#DC2626` |
| **Warning** | `#D97706` |
| **Heading Font** | `Outfit` (Google Fonts) — 600/700 weight |
| **Body Font** | `Inter` (Google Fonts) — 400/500 weight |
| **Border Radius** | `0.5rem` (cards), `0.375rem` (buttons/inputs) |

---

## Open Questions

> [!IMPORTANT]
> **TypeScript vs JavaScript**: Your other open projects use `.jsx`. I'll proceed with **JavaScript (JSX)** to match your existing workflow. Let me know if you'd prefer TypeScript instead.

> [!IMPORTANT]
> **MongoDB Connection**: You'll need a running MongoDB instance. I'll configure it to use `mongodb://localhost:27017/solemate` by default. Are you running MongoDB locally, or should I use a MongoDB Atlas connection string?

> [!IMPORTANT]
> **Image strategy**: I'll use **local uploads with multer** (stored in `server/uploads/`) for product images, and **AI-generated images** for hero section shoe renders, category tiles, and seed product photos. This means no cloud storage dependency. Is this acceptable?

---

## Verification Plan

### Automated Tests
- `npm run dev` on both client (port 3000) and server (port 5000) — verify both start cleanly
- Run seed script to populate database, verify data in MongoDB
- Test the full e-commerce flow: browse → product detail → add to cart → checkout → order visible in admin

### Manual Verification
- Test responsive layouts at mobile (375px), tablet (768px), and desktop (1440px) breakpoints
- Verify all animations are smooth and respect reduced-motion preference
- Test auth flow: register, login, logout, protected route redirects
- Test admin panel: CRUD operations for products, categories; order status updates
- Verify cart persistence across sessions (server-side for authenticated users)

---

## Execution Strategy

Given the scale of this project, I will build it in this order, ensuring each phase is functional before moving to the next:

1. **Server foundation** — Express setup, all models, middleware, routes, controllers, seed script
2. **Client scaffold** — Next.js + shadcn/ui + Tailwind theme + contexts + API client
3. **Core e-commerce flow** — Product listing → Product detail → Cart → Checkout → Order (the "happy path" end-to-end)
4. **Auth system** — Login, register, protected routes, admin role checks
5. **Admin panel** — Dashboard, product/category/order/customer/inventory management
6. **Home page** — Hero carousel, category tiles, featured sections, testimonials, animations
7. **Polish** — Remaining pages (About, Contact, 404), all animations, SEO, responsive testing
8. **Assets** — Generate hero images, product images, logo
9. **README** — Documentation with setup instructions
