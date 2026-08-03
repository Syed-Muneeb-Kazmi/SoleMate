'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Fetch cart from server when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load from localStorage for guests
      const localCart = localStorage.getItem('solemate_cart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch {
          setCart({ items: [] });
        }
      }
    }
  }, [isAuthenticated]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated && cart.items.length > 0) {
      localStorage.setItem('solemate_cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cartAPI.get();
      setCart(res.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId, size, color, quantity = 1, productData = null) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await cartAPI.add({ productId, size, color, quantity });
        setCart(res.data);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message };
      } finally {
        setLoading(false);
      }
    } else {
      // Guest cart (localStorage)
      setCart(prev => {
        const existingIndex = prev.items.findIndex(
          item => item.productId === productId && item.size === size && item.color === color
        );

        let newItems;
        if (existingIndex >= 0) {
          newItems = [...prev.items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
        } else {
          newItems = [...prev.items, {
            _id: Date.now().toString(),
            productId,
            product: productData,
            size,
            color,
            quantity,
          }];
        }

        return { ...prev, items: newItems };
      });
      return { success: true };
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await cartAPI.update({ itemId, quantity });
        setCart(res.data);
      } catch (error) {
        console.error('Error updating cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCart(prev => ({
        ...prev,
        items: quantity <= 0
          ? prev.items.filter(item => item._id !== itemId)
          : prev.items.map(item =>
              item._id === itemId ? { ...item, quantity } : item
            ),
      }));
    }
  }, [isAuthenticated]);

  const removeItem = useCallback(async (itemId) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await cartAPI.remove(itemId);
        setCart(res.data);
      } catch (error) {
        console.error('Error removing from cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item._id !== itemId),
      }));
    }
  }, [isAuthenticated]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        await cartAPI.clear();
        setCart({ items: [] });
      } catch (error) {
        console.error('Error clearing cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCart({ items: [] });
      localStorage.removeItem('solemate_cart');
    }
  }, [isAuthenticated]);

  const cartCount = cart.items.reduce((total, item) => total + (item.quantity || 0), 0);

  const cartTotal = cart.items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * (item.quantity || 0);
  }, 0);

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart,
    cartCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
