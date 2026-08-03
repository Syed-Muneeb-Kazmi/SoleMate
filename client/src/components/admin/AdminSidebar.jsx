'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart,
  Users, Warehouse, MessageSquare, Settings, X, ChevronLeft,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-40 flex-col bg-card border-r border-border transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        id="admin-sidebar"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-1">
              <Logo href="/admin" size="sm" />
              <span className="text-[10px] bg-accent/10 text-accent font-bold px-1.5 py-0.5 rounded uppercase">Admin</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="admin-nav-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to store */}
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <ChevronLeft size={18} />
            {!collapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile: sidebar is toggled via AdminTopbar */}
    </>
  );
}
