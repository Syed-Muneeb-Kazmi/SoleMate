'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Bell, User, LogOut, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart,
  Users, Warehouse,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
];

export default function AdminTopbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Derive page title from path
  const segment = pathname.split('/').filter(Boolean);
  const pageTitle = segment.length <= 1
    ? 'Dashboard'
    : segment[1].charAt(0).toUpperCase() + segment[1].slice(1);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="px-4 py-4 border-b border-border">
              <SheetTitle className="font-heading text-xl">
                Sole<span className="text-accent">Mate</span>
                <span className="text-xs text-muted-foreground ml-1">Admin</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="py-4 px-2 space-y-1">
              {navItems.map((item) => {
                const isActive = item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border p-4">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted"
              >
                <ChevronLeft size={18} /> Back to Store
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="font-heading text-lg font-semibold">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="hidden sm:flex items-center gap-2 mr-2 text-sm text-muted-foreground">
          <User size={16} />
          <span>{user?.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} title="Sign out">
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  );
}
