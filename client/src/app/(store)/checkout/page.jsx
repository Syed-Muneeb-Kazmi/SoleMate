'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { MapPin, CreditCard, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { ordersAPI } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    name: user?.name || '', street: '', city: '', state: '', zip: '', country: 'Pakistan', phone: user?.phone || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) setShipping(prev => ({ ...prev, name: prev.name || user.name, phone: prev.phone || user.phone }));
  }, [user]);

  const shippingCost = cartTotal >= 10000 ? 0 : 499;
  const tax = Math.round(cartTotal * 0.08 * 100) / 100;
  const total = cartTotal + shippingCost + tax;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.place({ shippingAddress: shipping, paymentMethod });
      await clearCart();
      toast.success('Order placed successfully!', { description: `Order ${res.data.orderNumber}` });
      setStep(3);
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0 && step !== 3) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {[{ num: 1, label: 'Shipping' }, { num: 2, label: 'Review & Pay' }, { num: 3, label: 'Confirmation' }].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s.num ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              {step > s.num ? <CheckCircle2 size={18} /> : s.num}
            </div>
            <span className={`text-sm hidden sm:block ${step >= s.num ? 'font-medium' : 'text-muted-foreground'}`}>{s.label}</span>
            {i < 2 && <div className={`w-12 h-0.5 ${step > s.num ? 'bg-accent' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Shipping */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MapPin size={20} /> Shipping Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} required className="mt-1.5" /></div>
                <div><Label>Phone</Label><Input value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} className="mt-1.5" /></div>
              </div>
              <div><Label>Street Address</Label><Input value={shipping.street} onChange={e => setShipping({...shipping, street: e.target.value})} required className="mt-1.5" /></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><Label>City</Label><Input value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} required className="mt-1.5" /></div>
                <div><Label>State</Label><Input value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} required className="mt-1.5" /></div>
                <div><Label>ZIP</Label><Input value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} required className="mt-1.5" /></div>
                <div><Label>Country</Label><Input value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})} required className="mt-1.5" /></div>
              </div>
              <Button onClick={() => {
                if (!shipping.name || !shipping.street || !shipping.city || !shipping.state || !shipping.zip) {
                  toast.error('Please fill in all required fields'); return;
                }
                setStep(2);
              }} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Continue to Payment <ArrowRight size={16} className="ml-2" /></Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Review & Payment */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard size={20} /> Payment Method</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {[{ value: 'credit_card', label: 'Credit Card', desc: 'Visa, MasterCard, Amex' },
                  { value: 'paypal', label: 'PayPal', desc: 'Pay with PayPal' },
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when delivered' }
                ].map(p => (
                  <Label key={p.value} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === p.value ? 'border-accent bg-accent/5' : 'border-border'}`}>
                    <RadioGroupItem value={p.value} />
                    <div><p className="font-medium text-sm">{p.label}</p><p className="text-xs text-muted-foreground">{p.desc}</p></div>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {cart.items.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.product?.name} × {item.quantity} (Size {item.size})</span>
                  <span>{formatCurrency((item.product?.price || 0) * item.quantity)}</span>
                </div>
              ))}
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
              </div>
              <Separator />
              <div className="flex justify-between font-heading font-bold text-lg">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft size={16} className="mr-2" /> Back</Button>
                <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-success" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">Thank you for your purchase. You&apos;ll receive a confirmation email shortly.</p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline"><Link href="/account?tab=orders">View Orders</Link></Button>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90"><Link href="/products">Continue Shopping</Link></Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
