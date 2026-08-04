'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Eye, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { ordersAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { limit: 100, sort: 'newest' };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await ordersAPI.getAll(params);
      setOrders(res.data || []);
    } catch (e) { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const openDetail = async (order) => {
    try {
      const res = await ordersAPI.getById(order._id);
      setDetailOrder(res.data);
      setNewStatus(res.data.orderStatus);
      setTrackingNumber(res.data.trackingNumber || '');
    } catch (e) { toast.error('Failed to load order details'); }
  };

  const handleUpdateStatus = async () => {
    if (!detailOrder) return;
    setUpdating(true);
    try {
      const body = { orderStatus: newStatus };
      if (trackingNumber) body.trackingNumber = trackingNumber;
      await ordersAPI.updateStatus(detailOrder._id, body);
      toast.success('Order status updated');
      setDetailOrder(null);
      fetchOrders();
    } catch (e) { toast.error(e.message); }
    finally { setUpdating(false); }
  };

  const filtered = search
    ? orders.filter(o => o.orderNumber?.toLowerCase().includes(search.toLowerCase()) || o.user?.name?.toLowerCase().includes(search.toLowerCase()))
    : orders;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative max-w-sm flex-1">
          <Input placeholder="Search by order # or customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={40} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order #</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Payment</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Date</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order._id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                      <td className="py-3 px-4 hidden sm:table-cell">{order.user?.name || 'Guest'}</td>
                      <td className="py-3 px-4 hidden md:table-cell">{order.items?.length}</td>
                      <td className="py-3 px-4 font-semibold">{formatCurrency(order.total)}</td>
                      <td className="py-3 px-4"><Badge className={`text-xs capitalize ${statusColors[order.orderStatus]}`}>{order.orderStatus}</Badge></td>
                      <td className="py-3 px-4 hidden lg:table-cell"><Badge className={`text-xs capitalize ${paymentColors[order.paymentStatus]}`}>{order.paymentStatus}</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openDetail(order)}>
                          <Eye size={14} className="mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!detailOrder} onOpenChange={(o) => { if (!o) setDetailOrder(null); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {detailOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Placed on {detailOrder ? new Date(detailOrder.createdAt).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-4 py-2">
              {/* Items */}
              <div>
                <h4 className="text-sm font-medium mb-2">Items</h4>
                {detailOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-border/30">
                    <span>{item.name} × {item.quantity} (Size {item.size})</span>
                    <span className="font-medium">{formatCurrency((item.price || 0) * (item.quantity || 0))}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(detailOrder.subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(detailOrder.shippingCost)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(detailOrder.tax)}</span></div>
                <Separator />
                <div className="flex justify-between font-bold"><span>Total</span><span>{formatCurrency(detailOrder.total)}</span></div>
              </div>

              {/* Shipping address */}
              <div>
                <h4 className="text-sm font-medium mb-1">Shipping Address</h4>
                <p className="text-sm text-muted-foreground">
                  {detailOrder.shippingAddress?.name}<br />
                  {detailOrder.shippingAddress?.street}<br />
                  {detailOrder.shippingAddress?.city}, {detailOrder.shippingAddress?.state} {detailOrder.shippingAddress?.zip}
                </p>
              </div>

              {/* Update status */}
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Update Status</h4>
                <div className="flex gap-2">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select Status" className="capitalize">{newStatus ? newStatus.charAt(0).toUpperCase() + newStatus.slice(1) : ''}</SelectValue></SelectTrigger>
                    <SelectContent>
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {newStatus === 'shipped' && (
                  <Input placeholder="Tracking number" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="mt-2" />
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOrder(null)}>Close</Button>
            <Button onClick={handleUpdateStatus} disabled={updating} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
