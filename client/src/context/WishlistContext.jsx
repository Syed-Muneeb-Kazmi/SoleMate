'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productsAPI } from '@/lib/api';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const initWishlist = async () => {
      try {
        const saved = localStorage.getItem('solemate_wishlist');
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return;

        // Clean out dummy or non-string IDs
        const initialValid = parsed.filter(
          id => id && id !== '1' && id !== 1 && typeof id === 'string' && id.length > 5
        );
        setWishlist(initialValid);

        if (initialValid.length > 0) {
          // Verify with database to prune deleted/stale product IDs
          try {
            const res = await productsAPI.getAll({ limit: 200 });
            const allProducts = res.data || [];
            const existingIds = new Set(allProducts.map(p => p._id));
            const verified = initialValid.filter(id => existingIds.has(id));
            setWishlist(verified);
            localStorage.setItem('solemate_wishlist', JSON.stringify(verified));
          } catch (err) {
            // Ignore API fetch error (offline fallback)
          }
        }
      } catch (e) {}
    };

    initWishlist();
  }, []);

  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('solemate_wishlist', JSON.stringify(next));
      return next;
    });
  }, []);

  const isWishlisted = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  const syncWishlist = useCallback((validProductIds) => {
    if (!Array.isArray(validProductIds)) return;
    setWishlist(validProductIds);
    try {
      localStorage.setItem('solemate_wishlist', JSON.stringify(validProductIds));
    } catch (e) {}
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistCount: wishlist.length, toggleWishlist, isWishlisted, syncWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
