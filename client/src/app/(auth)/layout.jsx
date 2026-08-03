import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: {
    template: '%s | SoleMate',
  },
};

export default function AuthLayout({ children }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-muted/30">
        {children}
      </div>
    </CartProvider>
  );
}
