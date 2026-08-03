import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

export default function StoreLayout({ children }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <Header />
        <main className="flex-1 px-2 md:px-0">
          {children}
        </main>
        <Footer />
      </WishlistProvider>
    </CartProvider>
  );
}
