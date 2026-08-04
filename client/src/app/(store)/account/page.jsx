'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { authAPI, ordersAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({ name: '', phone: '', street: '', city: '', state: '', zip: '', country: '' });
  const [loading, setLoading] = useState(false);
  const defaultTab = searchParams.get('tab') || 'profile';

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user) setProfile({ name: user.name || '', phone: user.phone || '', street: user.address?.street || '', city: user.address?.city || '', state: user.address?.state || '', zip: user.address?.zip || '', country: user.address?.country || '' });
    ordersAPI.getMyOrders().then(res => setOrders(res.data || [])).catch(() => {});
  }, [isAuthenticated, user, router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ name: profile.name, phone: profile.phone, address: { street: profile.street, city: profile.city, state: profile.state, zip: profile.zip, country: profile.country } });
      updateUser(res.data);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold">My Account</h1>
        <Button variant="outline" size="sm" onClick={() => { logout(); router.push('/'); }}>
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile"><User size={16} className="mr-2" /> Profile</TabsTrigger>
          <TabsTrigger value="orders"><Package size={16} className="mr-2" /> Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="mt-1.5" /></div>
                  <div><Label>Email</Label><Input value={user?.email || ''} disabled className="mt-1.5 bg-muted" /></div>
                  <div><Label>Phone</Label><Input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="mt-1.5" /></div>
                </div>
                <Separator className="my-4" />
                <h3 className="font-medium flex items-center gap-2"><MapPin size={16} /> Address</h3>
                <div><Label>Street</Label><Input value={profile.street} onChange={e => setProfile({...profile, street: e.target.value})} className="mt-1.5" /></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><Label>City</Label><Input value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})} className="mt-1.5" /></div>
                  <div><Label>State</Label><Input value={profile.state} onChange={e => setProfile({...profile, state: e.target.value})} className="mt-1.5" /></div>
                  <div><Label>ZIP</Label><Input value={profile.zip} onChange={e => setProfile({...profile, zip: e.target.value})} className="mt-1.5" /></div>
                  <div><Label>Country</Label><Input value={profile.country} onChange={e => setProfile({...profile, country: e.target.value})} className="mt-1.5" /></div>
                </div>
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order._id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm">{order.orderNumber}</span>
                          <span className="text-xs text-muted-foreground ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Badge className={`capitalize ${statusColors[order.orderStatus]}`}>{order.orderStatus}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} item(s) — <span className="font-semibold text-foreground">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AccountPage() {
  return <Suspense><AccountContent /></Suspense>;
}
