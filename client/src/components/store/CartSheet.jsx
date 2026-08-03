'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getImageUrl, formatCurrency } from '@/lib/utils';

export default function CartSheet({ open, onOpenChange }) {
  const { cart, cartCount, cartTotal, updateQuantity, removeItem } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="font-heading text-lg flex items-center gap-2">
            <ShoppingBag size={20} />
            Shopping Cart ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Button onClick={() => onOpenChange(false)} asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="flex gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    {/* Product image */}
                    <div className="w-20 h-20 rounded-md bg-muted overflow-hidden shrink-0">
                      <Image
                        src={getImageUrl(item.product?.images?.[0])}
                        alt={item.product?.name || 'Product'}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">
                        {item.product?.name || 'Product'}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Size: {item.size} {item.color && `• ${item.color}`}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        {formatCurrency(item.product?.price || 0)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-7 h-7 rounded-md bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-7 h-7 rounded-md bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart summary */}
            <div className="border-t border-border px-6 py-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatCurrency(cartTotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping & taxes calculated at checkout
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                  asChild
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => onOpenChange(false)}
                  asChild
                >
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
