'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/store/ProductCard';
import ScrollReveal from '@/components/store/ScrollReveal';
import { useWishlist } from '@/context/WishlistContext';
import { productsAPI } from '@/lib/api';

export default function WishlistPage() {
  const { wishlist, syncWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlisted = async () => {
      if (wishlist.length === 0) { setLoading(false); setProducts([]); return; }
      setLoading(true);
      try {
        // Fetch all products and filter by wishlisted IDs
        const res = await productsAPI.getAll({ limit: 200 });
        const all = res.data || [];
        const validProducts = all.filter(p => wishlist.includes(p._id));
        setProducts(validProducts);

        // Prune any stale IDs from wishlist context & localStorage
        const validIds = validProducts.map(p => p._id);
        if (validIds.length !== wishlist.length) {
          syncWishlist(validIds);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlisted();
  }, [wishlist, syncWishlist]);

  return (
    <div className="container mx-auto px-6 md:px-12 py-10">
      <ScrollReveal>
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Heart className="text-accent fill-accent" size={32} />
            My Wishlist
          </h1>
          <p className="text-muted-foreground">{products.length} saved {products.length === 1 ? 'item' : 'items'}</p>
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Heart size={36} className="text-muted-foreground" />
          </div>
          <h2 className="font-heading text-xl font-bold mb-2">No saved items yet</h2>
          <p className="text-muted-foreground mb-8">Click the heart icon on any product to save it here.</p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-2.5 h-auto font-semibold">
            <Link href="/products" className="inline-flex items-center justify-center gap-2">
              <ShoppingBag size={18} />
              <span>Browse Products</span>
            </Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
