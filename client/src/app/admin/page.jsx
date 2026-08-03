'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  DollarSign, ShoppingCart, Package, Users, TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ordersAPI, usersAPI } from '@/lib/api';

const STATUS_COLORS = {
  pending: '#F59E0B',
  processing: '#3B82F6',
  shipped: '#8B5CF6',
  delivered: '#10B981',
  cancelled: '#EF4444',
};

const CHART_COLOR = '#D4A853';

function computeLastNDays(orders, n = 7) {
  const days = Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    const key = d.toISOString().split('T')[0];
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      key,
      revenue: 0,
      orders: 0,
    };
  });
  orders.forEach(o => {
    const key = new Date(o.createdAt).toISOString().split('T')[0];
    const slot = days.find(d => d.key === key);
    if (slot) { slot.revenue += o.total || 0; slot.orders += 1; }
  });
  return days;
}

function computeStatusData(orders) {
  const counts = {};
  orders.forEach(o => { counts[o.orderStatus] = (counts[o.orderStatus] || 0) + 1; });
  return Object.entries(counts).map(([status, count]) => ({ status, count, color: STATUS_COLORS[status] || '#6B7280' }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
              {p.name}: {p.name === 'Revenue' ? formatCurrency(p.value) : p.value}
          </p>
        ))}
      </div>
    );
  }
};
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, ordersRes] = await Promise.all([
          usersAPI.getDashboardStats(),
          ordersAPI.getAll({ limit: 100, sort: 'newest' }),
        ]);
        setStats(dashRes.data);
        const orders = ordersRes.data || [];
        setAllOrders(orders);
        setRecentOrders(orders.slice(0, 6));
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const revenueData = computeLastNDays(allOrders, 7);
  const statusData = computeStatusData(allOrders);

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats ? formatCurrency(stats.totalRevenue || 0) : '—',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50',
      sub: 'All time',
    },
    {
      title: 'Total Orders',
      value: stats ? (stats.totalOrders || 0).toString() : '—',
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-50',
      sub: 'All time',
    },
    {
      title: 'Total Products',
      value: stats ? (stats.totalProducts || 0).toString() : '—',
      icon: Package,
      color: 'text-purple-600 bg-purple-50',
      sub: 'In catalog',
    },
    {
      title: 'Total Customers',
      value: stats ? (stats.totalCustomers || 0).toString() : '—',
      icon: Users,
      color: 'text-orange-600 bg-orange-50',
      sub: 'Registered',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here&apos;s your store overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{card.title}</span>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                    <card.icon size={18} />
                  </div>
                </div>
                {loading ? <Skeleton className="h-7 w-24" /> : (
                  <p className="font-heading text-2xl font-bold">{card.value}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp size={18} className="text-accent" /> Revenue (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-48 w-full" /> : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => formatCurrency(v)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone" dataKey="revenue" name="Revenue"
                    stroke={CHART_COLOR} strokeWidth={2.5} dot={{ fill: CHART_COLOR, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Orders by Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-48 w-full" /> : statusData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                    {statusData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name.charAt(0).toUpperCase() + name.slice(1)]} />
                  <Legend formatter={v => v.charAt(0).toUpperCase() + v.slice(1)} iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders Per Day Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Orders Per Day (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-40 w-full" /> : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" name="Orders" fill={CHART_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Order</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden sm:table-cell">Items</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-2 font-medium">{order.orderNumber}</td>
                      <td className="py-3 px-2">{order.user?.name || 'N/A'}</td>
                      <td className="py-3 px-2 hidden sm:table-cell">{order.items?.length || 0}</td>
                      <td className="py-3 px-2 font-semibold">${order.total?.toFixed(2)}</td>
                      <td className="py-3 px-2">
                        <Badge className="text-xs capitalize" style={{ backgroundColor: STATUS_COLORS[order.orderStatus] + '20', color: STATUS_COLORS[order.orderStatus] }}>
                          {order.orderStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
