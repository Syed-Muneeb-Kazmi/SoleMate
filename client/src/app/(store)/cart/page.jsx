'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, getImageUrl } from '@/lib/utils';

export default function CartPage() {
  const { cart, cartCount, cartTotal, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const shipping = cartTotal >= 10000 ? 0 : 499;
  const tax = Math.round(cartTotal * 0.08 * 100) / 100;
  const total = cartTotal + shipping + tax;

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-muted-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven&apos;t found your perfect sole mate yet.</p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/products">Start Shopping <ArrowRight size={18} className="ml-2" /></Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Shopping Cart ({cartCount})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div key={item._id} layout exit={{ opacity: 0, x: -100 }} className="flex gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-muted overflow-hidden shrink-0">
                  <Image src={getImageUrl(item.product?.images?.[0])} alt={item.product?.name || ''} width={128} height={128} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.product?.name}</h3>
                      <p className="text-sm text-muted-foreground">Size: {item.size} {item.color && `| ${item.color}`}</p>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 size={18} /></button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2 hover:bg-muted"><Minus size={14} /></button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2 hover:bg-muted"><Plus size={14} /></button>
                    </div>
                    <span className="font-heading font-bold">{formatCurrency((item.product?.price || 0) * item.quantity)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 p-6 rounded-xl bg-card border border-border space-y-4">
            <h2 className="font-heading text-lg font-bold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-success">Free</span> : formatCurrency(shipping)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>{formatCurrency(tax)}</span></div>
            </div>
            <Separator />
            <div className="flex justify-between font-heading font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground">Add {formatCurrency(10000 - cartTotal)} more for free shipping</p>
            )}
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
              <Link href={isAuthenticated ? '/checkout' : '/login'}>{isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
