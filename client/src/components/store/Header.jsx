'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import CartSheet from './CartSheet';

const navLinks = [
  { href: '/', label: 'Home', exact: true },
  { href: '/products', label: 'Shop', basePath: '/products', noGender: true },
  { href: '/products?gender=men', label: 'Men', basePath: '/products', gender: 'men' },
  { href: '/products?gender=women', label: 'Women', basePath: '/products', gender: 'women' },
  { href: '/products?gender=kids', label: 'Kids', basePath: '/products', gender: 'kids' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

function DesktopNav({ pathname }) {
  const searchParams = useSearchParams();
  const currentGender = searchParams ? searchParams.get('gender') : null;

  const isLinkActive = (link) => {
    if (link.href === '/') return pathname === '/';

    if (link.gender) {
      return pathname === '/products' && currentGender === link.gender;
    }
    if (link.noGender) {
      return pathname === '/products' && !currentGender;
    }
    return pathname.startsWith(link.href) && link.href !== '/';
  };

  return (
    <nav className="hidden md:flex items-center gap-1" id="main-nav">
      {navLinks.map((link) => {
        const active = isLinkActive(link);
        return (
          <Link
            key={link.label}
            href={link.href}
            className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-accent ${
              active ? 'text-accent font-semibold' : 'text-foreground/80'
            }`}
          >
            {link.label}
            {active && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNavLinks({ pathname, onNavigate }) {
  const searchParams = useSearchParams();
  const currentGender = searchParams ? searchParams.get('gender') : null;

  const isLinkActive = (link) => {
    if (link.href === '/') return pathname === '/';
    if (link.gender) return pathname === '/products' && currentGender === link.gender;
    if (link.noGender) return pathname === '/products' && !currentGender;
    return pathname.startsWith(link.href) && link.href !== '/';
  };

  return (
    <nav className="flex flex-col gap-1">
      {navLinks.map((link) => {
        const active = isLinkActive(link);
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={onNavigate}
            className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
              active ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-muted'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-border/50 shadow-sm'
            : 'bg-background'
        }`}
      >
        {/* Top bar */}
        <div className="hidden md:block bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 md:px-12 py-1.5 flex items-center justify-between text-xs">
            <span>Free shipping on orders over PKR 10,000</span>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link href="/admin" className="hover:text-accent transition-colors">
                  Admin Panel
                </Link>
              )}
              <span>📞 +92 300 1234567</span>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Logo />

            {/* Desktop nav with Suspense boundary for useSearchParams */}
            <Suspense fallback={
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map(l => (
                  <Link key={l.label} href={l.href} className="px-3 py-2 text-sm font-medium text-foreground/80">{l.label}</Link>
                ))}
              </nav>
            }>
              <DesktopNav pathname={pathname} />
            </Suspense>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 hover:bg-muted rounded-full transition-colors"
                aria-label="Search"
                id="search-toggle"
              >
                <Search size={20} />
              </button>

              {/* Account */}
              {isAuthenticated ? (
                <div className="relative group">
                  <Link
                    href="/account"
                    className="p-2.5 hover:bg-muted rounded-full transition-colors flex items-center gap-1"
                    id="account-link"
                  >
                    <User size={20} />
                    <span className="hidden lg:inline text-sm">{user?.name?.split(' ')[0]}</span>
                  </Link>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      <Link href="/account" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">My Account</Link>
                      <Link href="/account?tab=orders" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">Order History</Link>
                      {isAdmin && (
                        <Link href="/admin" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-accent">Admin Panel</Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="p-2.5 hover:bg-muted rounded-full transition-colors" aria-label="Login" id="login-link">
                  <User size={20} />
                </Link>
              )}

              {/* Wishlist button with count badge */}
              <Link href="/wishlist" className="relative p-2.5 hover:bg-muted rounded-full transition-colors" aria-label="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart button with count badge */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 hover:bg-muted rounded-full transition-colors"
                aria-label="Cart"
                id="cart-toggle"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border/50 overflow-hidden bg-background"
            >
              <div className="container mx-auto px-6 md:px-12 py-3">
                <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
                  <Input
                    type="search"
                    placeholder="Search shoes, brands, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    autoFocus
                    id="search-input"
                  />
                  <Button type="submit" id="search-submit">Search</Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-40 w-72 bg-card border-r border-border shadow-2xl md:hidden"
            id="mobile-menu"
          >
            <div className="p-6 pt-24">
              <Suspense fallback={null}>
                <MobileNavLinks pathname={pathname} onNavigate={() => setMobileMenuOpen(false)} />
              </Suspense>

              <div className="mt-8 pt-6 border-t border-border">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground px-4">Hi, {user?.name}</p>
                    <Link href="/account" className="block px-4 py-2 rounded-lg hover:bg-muted text-sm">My Account</Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-destructive/10 text-sm text-destructive"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login"><Button className="w-full" id="mobile-login">Sign In</Button></Link>
                    <Link href="/register"><Button variant="outline" className="w-full" id="mobile-register">Create Account</Button></Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Cart Sheet */}
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-[calc(5rem+28px)]" />
    </>
  );
}
